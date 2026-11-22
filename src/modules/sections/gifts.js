import { escapeHtml } from '../format.js'

const isFilled = (value) => typeof value === 'string' && value.trim() !== ''

const COPY_LABEL = 'Copiar CLABE'
const COPIED_LABEL = '¡Copiado!'
const COPIED_DURATION = 2000

const arrowIcon = `
  <svg class="gifts__icon" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
    <path d="M3.5 2.5h6v6M9.5 2.5 2.5 9.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.1" />
  </svg>`

const bankCard = (item) => `
  <li class="gifts__card">
    <h4 class="gifts__card-title">${escapeHtml(item.bank)}</h4>
    ${isFilled(item.name) ? `<p class="gifts__card-name">${escapeHtml(item.name)}</p>` : ''}
    <p class="gifts__clabe-label">CLABE</p>
    <p class="gifts__clabe">${escapeHtml(item.clabe)}</p>
    <button
      class="gifts__copy"
      type="button"
      data-copy-clabe="${escapeHtml(item.clabe)}"
      aria-label="Copiar CLABE de ${escapeHtml(item.bank)}"
    >
      <span data-copy-label>${COPY_LABEL}</span>
    </button>
  </li>`

const registryCard = (item) => `
  <li class="gifts__card">
    <h4 class="gifts__card-title">${escapeHtml(item.name)}</h4>
    <a
      class="gifts__link"
      href="${escapeHtml(item.url)}"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Abrir la mesa de regalos de ${escapeHtml(item.name)} (se abre en una pestaña nueva)"
    >
      <span>Visitar tienda</span>
      ${arrowIcon}
    </a>
  </li>`

/**
 * Mesa de regalos: datos bancarios con copia de CLABE y enlaces a tiendas.
 * Devuelve { element, destroy } como el resto de secciones.
 */
export function createGifts(config) {
  if (!config || config.enabled === false) return null
  if (!isFilled(config.title)) return null

  const bankDetails = Array.isArray(config.bankDetails)
    ? config.bankDetails.filter(
        (item) => item && isFilled(item.bank) && isFilled(item.clabe),
      )
    : []

  const registries = Array.isArray(config.registries)
    ? config.registries.filter(
        (item) => item && isFilled(item.name) && isFilled(item.url),
      )
    : []

  if (bankDetails.length === 0 && registries.length === 0) return null

  const eyebrow = isFilled(config.eyebrow)
    ? `<p class="eyebrow" data-reveal>${escapeHtml(config.eyebrow)}</p>`
    : ''

  const description = isFilled(config.description)
    ? `<p class="gifts__description" data-reveal style="--reveal-delay: 120ms">${escapeHtml(
        config.description,
      )}</p>`
    : ''

  const bankBlock =
    bankDetails.length > 0
      ? `<div class="gifts__group" data-reveal style="--reveal-delay: 200ms">
          <h3 class="gifts__group-title">Datos bancarios</h3>
          <ul class="gifts__list">
            ${bankDetails.map(bankCard).join('')}
          </ul>
        </div>`
      : ''

  const registryBlock =
    registries.length > 0
      ? `<div class="gifts__group" data-reveal style="--reveal-delay: ${
          bankDetails.length > 0 ? 280 : 200
        }ms">
          <h3 class="gifts__group-title">Mesas de regalo</h3>
          <ul class="gifts__list">
            ${registries.map(registryCard).join('')}
          </ul>
        </div>`
      : ''

  const section = document.createElement('section')
  section.className = 'section gifts'
  section.setAttribute('aria-labelledby', 'regalos-titulo')
  section.innerHTML = `
    ${eyebrow}
    <h2 class="section__title" id="regalos-titulo" data-reveal style="--reveal-delay: 60ms">
      ${escapeHtml(config.title)}
    </h2>
    ${description}
    ${bankBlock}
    ${registryBlock}
  `

  const activeTimeouts = new Set()

  section.querySelectorAll('[data-copy-clabe]').forEach((button) => {
    const label = button.querySelector('[data-copy-label]')
    const defaultAriaLabel = button.getAttribute('aria-label')
    let resetId = null

    button.addEventListener('click', async () => {
      if (!navigator.clipboard?.writeText) {
        console.warn('[invitación] El portapapeles no está disponible en este navegador.')
        return
      }

      try {
        await navigator.clipboard.writeText(button.dataset.copyClabe)
      } catch (error) {
        console.warn('[invitación] No se pudo copiar la CLABE:', error)
        return
      }

      if (resetId !== null) {
        window.clearTimeout(resetId)
        activeTimeouts.delete(resetId)
      }

      label.textContent = COPIED_LABEL
      button.classList.add('is-copied')
      button.setAttribute('aria-label', 'CLABE copiada')

      resetId = window.setTimeout(() => {
        label.textContent = COPY_LABEL
        button.classList.remove('is-copied')
        button.setAttribute('aria-label', defaultAriaLabel)
        activeTimeouts.delete(resetId)
        resetId = null
      }, COPIED_DURATION)

      activeTimeouts.add(resetId)
    })
  })

  return {
    element: section,
    destroy() {
      activeTimeouts.forEach((id) => window.clearTimeout(id))
      activeTimeouts.clear()
    },
  }
}
