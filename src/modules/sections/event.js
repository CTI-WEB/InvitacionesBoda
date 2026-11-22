import { escapeHtml, formatWeddingDate } from '../format.js'

/**
 * Ceremonia y recepción. La fecha se toma de config.wedding.date; cada
 * entrada aporta su hora, dirección y enlace a Google Maps.
 */
export function renderEvent(event, config = {}) {
  if (
    !event?.title ||
    !Array.isArray(event.items) ||
    event.items.length === 0 ||
    !config.wedding?.date
  ) {
    return null
  }

  const locale = config.locale ?? 'es-ES'
  const date = formatWeddingDate(config.wedding.date, locale)

  const items = event.items
    .map((item, index) => {
      const time = item.time ?? '00:00'
      const dateTime = formatWeddingDate(`${date.iso}T${time}`, locale)
      const title = escapeHtml(item.title)
      const link = item.mapsUrl
        ? `<a class="event__link" href="${escapeHtml(item.mapsUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Ver ubicación de ${title} en Google Maps (se abre en una pestaña nueva)">
            <span>Ver ubicación</span>
            <svg class="event__icon" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
              <path d="M3.5 2.5h6v6M9.5 2.5 2.5 9.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.1" />
            </svg>
          </a>`
        : ''

      return `
        <li class="event__item" data-reveal style="--reveal-delay: ${120 + index * 100}ms">
          <h4 class="event__name">${title}</h4>
          <p class="event__date">
            <time datetime="${date.iso}T${escapeHtml(time)}">${escapeHtml(
              date.weekday,
            )}, ${escapeHtml(date.long)}</time>
          </p>
          <p class="event__time">${escapeHtml(dateTime.time)}</p>
          <address class="event__address">${escapeHtml(item.address)}</address>
          ${link}
        </li>`
    })
    .join('')

  const eventSection = document.createElement('section')
  eventSection.className = 'section event'
  eventSection.setAttribute('aria-labelledby', 'evento-titulo')
  eventSection.innerHTML = `
    <p class="eyebrow" data-reveal>${escapeHtml(event.eyebrow)}</p>
    <h3 class="section__title" id="evento-titulo" data-reveal style="--reveal-delay: 60ms">
      ${escapeHtml(event.title)}
    </h3>
    <ul class="event__list">${items}</ul>
  `

  return eventSection
}
