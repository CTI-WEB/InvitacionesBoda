import { escapeHtml } from './format.js'

export function renderCover(config, date) {
  const { couple, hero, wedding, texts } = config
  const names = `${couple.first} y ${couple.second}`

  const media = hero.image
    ? `<img class="cover__photo" src="${escapeHtml(hero.image)}" alt="${escapeHtml(
        hero.alt ?? '',
      )}" width="1000" height="1250" decoding="async" fetchpriority="high">`
    : `<div class="cover__monogram" aria-hidden="true"><span>${escapeHtml(
        couple.monogram,
      )}</span></div>`

  const cover = document.createElement('section')
  cover.className = 'cover'
  cover.id = 'portada'
  cover.setAttribute('aria-label', 'Portada de la invitación')

  cover.innerHTML = `
    <div class="cover__frame">
      <header class="cover__head">
        <p class="eyebrow" data-reveal>${escapeHtml(texts.overline)}</p>
        <h1 class="cover__names" aria-label="${escapeHtml(names)}" data-reveal style="--reveal-delay: 120ms">
          <span class="cover__name">${escapeHtml(couple.first)}</span>
          <span class="cover__amp" aria-hidden="true">&amp;</span>
          <span class="cover__name">${escapeHtml(couple.second)}</span>
        </h1>
        <p class="cover__date" data-reveal style="--reveal-delay: 240ms">
          <time class="cover__date-main" datetime="${escapeHtml(date.iso)}">${escapeHtml(date.short)}</time>
          <span class="cover__date-meta">${escapeHtml(date.meta)}</span>
          <span class="cover__venue">${escapeHtml(wedding.venue)} · ${escapeHtml(wedding.city)}</span>
        </p>
      </header>

      <div class="cover__media" ${hero.image ? '' : 'role="img" aria-label="Monograma de los novios"'} data-reveal style="--reveal-delay: 180ms">
        ${media}
      </div>

      <div class="cover__actions">
        <button
          class="btn cover__open"
          type="button"
          data-open
          data-reveal
          style="--reveal-delay: 360ms"
          aria-controls="invitacion"
        >${escapeHtml(texts.cta)}</button>
      </div>
    </div>
  `

  return cover
}
