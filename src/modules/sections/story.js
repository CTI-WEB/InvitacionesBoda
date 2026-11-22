import { escapeHtml } from '../format.js'

/**
 * Sección piloto: línea de tiempo de la pareja.
 * Recibe únicamente los datos de config.story.
 */
export function renderStory(story) {
  if (!story?.title || !Array.isArray(story.items) || story.items.length === 0) {
    return null
  }

  const section = document.createElement('section')
  section.className = 'section story'
  section.setAttribute('aria-labelledby', 'historia-titulo')

  const items = story.items
    .map(
      (item, index) => `
        <li class="story__item" data-reveal style="--reveal-delay: ${120 + index * 90}ms">
          <span class="story__date">${escapeHtml(item.date)}</span>
          <p class="story__text">${escapeHtml(item.text)}</p>
        </li>`,
    )
    .join('')

  section.innerHTML = `
    <p class="eyebrow" data-reveal>${escapeHtml(story.eyebrow)}</p>
    <h3 class="section__title" id="historia-titulo" data-reveal style="--reveal-delay: 60ms">
      ${escapeHtml(story.title)}
    </h3>
    <ol class="story__timeline">${items}</ol>
  `

  return section
}
