import { escapeHtml } from '../format.js'

/**
 * Galería editorial. Las imágenes se cargan de forma diferida y las que
 * fallan se ocultan para no dejar huecos; si fallan todas, se oculta la
 * sección completa.
 */
export function renderGallery(gallery) {
  const items = Array.isArray(gallery?.items)
    ? gallery.items.filter((item) => item?.src)
    : []

  if (!gallery?.title || items.length === 0) {
    return null
  }

  const figures = items
    .map((item, index) => {
      const caption = item.caption
        ? `<figcaption class="gallery__caption">${escapeHtml(item.caption)}</figcaption>`
        : ''

      return `
        <li class="gallery__item" data-reveal style="--reveal-delay: ${100 + index * 70}ms">
          <figure class="gallery__figure">
            <div class="gallery__frame">
              <img
                class="gallery__image"
                src="${escapeHtml(item.src)}"
                alt="${escapeHtml(item.alt ?? '')}"
                loading="lazy"
                decoding="async"
              >
            </div>
            ${caption}
          </figure>
        </li>`
    })
    .join('')

  const section = document.createElement('section')
  section.className = 'section gallery'
  section.setAttribute('aria-labelledby', 'galeria-titulo')
  section.innerHTML = `
    <p class="eyebrow" data-reveal>${escapeHtml(gallery.eyebrow)}</p>
    <h3 class="section__title" id="galeria-titulo" data-reveal style="--reveal-delay: 60ms">
      ${escapeHtml(gallery.title)}
    </h3>
    <ul class="gallery__grid">${figures}</ul>
  `

  const listItems = [...section.querySelectorAll('.gallery__item')]

  const hideBrokenItem = (image) => {
    const item = image.closest('.gallery__item')

    if (!item || item.hidden) return

    item.hidden = true

    if (listItems.every((listItem) => listItem.hidden)) {
      section.hidden = true
    }
  }

  section.querySelectorAll('.gallery__image').forEach((image) => {
    image.addEventListener('error', () => hideBrokenItem(image))

    if (image.complete && image.naturalWidth === 0) {
      hideBrokenItem(image)
    }
  })

  return section
}
