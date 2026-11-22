import { escapeHtml } from '../format.js'

const DEFAULT_CONFIRM_MESSAGE =
  'Hola, confirmo mi asistencia a la boda. ¡Nos vemos!'
const DEFAULT_DECLINE_MESSAGE =
  'Hola, lo siento, no podré asistir a la boda. Les envío mis mejores deseos.'

const isFilled = (value) => typeof value === 'string' && value.trim() !== ''

/**
 * Añade el nombre de la persona invitada conservando el saludo del mensaje.
 */
const personalise = (message, guestName) => {
  if (!isFilled(guestName)) return message

  const name = guestName.trim()

  if (/^Hola,\s*/i.test(message)) {
    return message.replace(/^Hola,\s*/i, `Hola, soy ${name} y `)
  }

  return `Soy ${name}. ${message}`
}

const whatsappUrl = (phone, message) =>
  `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

const arrowIcon = `
  <svg class="rsvp__icon" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
    <path d="M3.5 2.5h6v6M9.5 2.5 2.5 9.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.1" />
  </svg>`

/**
 * Confirmación de asistencia por WhatsApp.
 * Cada botón abre un chat con el mensaje correspondiente ya escrito.
 * Devuelve { element, destroy } como el resto de secciones.
 */
export function createRsvp(config) {
  if (!config || config.enabled === false) return null
  if (!isFilled(config.title)) return null

  const phone = String(config.phoneNumber ?? '').replace(/\D/g, '')

  if (!phone) return null

  const confirmMessage = isFilled(config.confirmMessage)
    ? config.confirmMessage.trim()
    : DEFAULT_CONFIRM_MESSAGE

  const declineMessage = isFilled(config.declineMessage)
    ? config.declineMessage.trim()
    : DEFAULT_DECLINE_MESSAGE

  const confirmUrl = whatsappUrl(
    phone,
    personalise(confirmMessage, config.guestName),
  )
  const declineUrl = whatsappUrl(
    phone,
    personalise(declineMessage, config.guestName),
  )

  const eyebrow = isFilled(config.eyebrow)
    ? `<p class="eyebrow" data-reveal>${escapeHtml(config.eyebrow)}</p>`
    : ''

  const description = isFilled(config.description)
    ? `<p class="rsvp__description" data-reveal style="--reveal-delay: 120ms">${escapeHtml(
        config.description,
      )}</p>`
    : ''

  const section = document.createElement('section')
  section.className = 'section rsvp'
  section.setAttribute('aria-labelledby', 'rsvp-titulo')
  section.innerHTML = `
    ${eyebrow}
    <h3 class="section__title" id="rsvp-titulo" data-reveal style="--reveal-delay: 60ms">
      ${escapeHtml(config.title)}
    </h3>
    ${description}
    <div class="rsvp__actions" data-reveal style="--reveal-delay: 200ms">
      <a
        class="rsvp__button rsvp__button--confirm"
        href="${escapeHtml(confirmUrl)}"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Confirmar mi asistencia por WhatsApp (se abre en una pestaña nueva)"
      >
        <span>Confirmo mi asistencia</span>
        ${arrowIcon}
      </a>
      <a
        class="rsvp__button rsvp__button--decline"
        href="${escapeHtml(declineUrl)}"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Avisar que no podré asistir por WhatsApp (se abre en una pestaña nueva)"
      >
        <span>Lo siento, no podré asistir</span>
        ${arrowIcon}
      </a>
    </div>
  `

  return {
    element: section,
    destroy() {},
  }
}
