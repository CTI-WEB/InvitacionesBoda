import { escapeHtml } from './format.js'
import { renderSections } from './sections/index.js'

/**
 * Panel que se muestra al abrir la invitación.
 * El contenedor [data-sections] queda libre para las futuras secciones
 * (historia, ceremonia, galería, RSVP...) sin tocar este archivo.
 */
export function renderInvitation(config, date) {
  const { wedding, texts } = config

  const invitation = document.createElement('main')
  invitation.className = 'invitation'
  invitation.id = 'invitacion'
  invitation.hidden = true

  invitation.innerHTML = `
    <div class="invitation__frame">
      <p class="eyebrow" data-reveal>${escapeHtml(texts.opening)}</p>

      <h2 class="invitation__title" id="invitacion-titulo" tabindex="-1" data-reveal style="--reveal-delay: 80ms">
        ${escapeHtml(texts.headline)}
      </h2>

      <p class="invitation__lead" data-reveal style="--reveal-delay: 160ms">${escapeHtml(
        texts.intro,
      )}</p>

      <div class="divider" aria-hidden="true" data-reveal style="--reveal-delay: 220ms"><span></span></div>

      <p class="invitation__details" data-reveal style="--reveal-delay: 260ms">
        <span class="invitation__date">${escapeHtml(date.long)}</span>
        <span class="invitation__time">${escapeHtml(date.time)}</span>
        <span class="invitation__venue">${escapeHtml(wedding.venue)} · ${escapeHtml(
          wedding.city,
        )}</span>
      </p>

      <div class="sections" data-sections></div>

      <button class="text-link" type="button" data-close>Volver a la portada</button>
    </div>
  `

  invitation.querySelector('[data-sections]').append(renderSections(config))

  return invitation
}