import { escapeHtml } from '../format.js'

const isFilled = (value) => typeof value === 'string' && value.trim() !== ''

const safeColor = (hex) => (/^#[0-9a-f]{3,8}$/i.test(hex ?? '') ? hex : null)

const describe = (item) => {
  if (typeof item === 'string') {
    return { name: item, hex: null }
  }

  return {
    name: isFilled(item?.name) ? item.name : null,
    hex: safeColor(item?.hex),
  }
}

/**
 * Código de vestimenta: tipo, nota breve, paleta y colores a evitar.
 * Devuelve { element, destroy } como el resto de secciones.
 */
export function createDressCode(config) {
  if (!config || config.enabled === false) return null
  if (!isFilled(config.title)) return null
  if (!isFilled(config.code) && !isFilled(config.description)) return null

  const palette = Array.isArray(config.palette)
    ? config.palette.map(describe).filter((item) => item.name)
    : []

  const avoid = Array.isArray(config.avoid)
    ? config.avoid.map(describe).filter((item) => item.name)
    : []

  const code = isFilled(config.code)
    ? `<p class="dress-code__code" data-reveal style="--reveal-delay: 100ms">${escapeHtml(
        config.code,
      )}</p>`
    : ''

  const description = isFilled(config.description)
    ? `<p class="dress-code__description" data-reveal style="--reveal-delay: 160ms">${escapeHtml(
        config.description,
      )}</p>`
    : ''

  const paletteBlock =
    palette.length > 0
      ? `<div class="dress-code__block" data-reveal style="--reveal-delay: 220ms">
          <h3 class="dress-code__label">Paleta sugerida</h3>
          <ul class="dress-code__palette">
            ${palette
              .map(
                (item) => `
                <li class="dress-code__swatch">
                  <span
                    class="dress-code__chip"
                    role="img"
                    aria-label="${escapeHtml(item.name)}"
                    title="${escapeHtml(item.name)}"
                    ${item.hex ? `style="--swatch-color: ${escapeHtml(item.hex)}"` : ''}
                  ></span>
                  <span class="dress-code__color">${escapeHtml(item.name)}</span>
                </li>`,
              )
              .join('')}
          </ul>
        </div>`
      : ''

  const avoidBlock =
    avoid.length > 0
      ? `<div class="dress-code__block" data-reveal style="--reveal-delay: 300ms">
          <h3 class="dress-code__label">Mejor evitar</h3>
          <ul class="dress-code__avoid">
            ${avoid
              .map(
                (item) => `
                <li>
                  ${item.hex ? `<span class="dress-code__avoid-dot" aria-hidden="true" style="--swatch-color: ${escapeHtml(item.hex)}"></span>` : ''}
                  <span>${escapeHtml(item.name)}</span>
                </li>`,
              )
              .join('')}
          </ul>
        </div>`
      : ''

  const section = document.createElement('section')
  section.className = 'section dress-code'
  section.setAttribute('aria-labelledby', 'dress-code-titulo')
  section.innerHTML = `
    <p class="eyebrow" data-reveal>${escapeHtml(config.eyebrow)}</p>
    <h2 class="section__title" id="dress-code-titulo" data-reveal style="--reveal-delay: 60ms">
      ${escapeHtml(config.title)}
    </h2>
    ${code}
    ${description}
    ${paletteBlock}
    ${avoidBlock}
  `

  return {
    element: section,
    destroy() {},
  }
}
