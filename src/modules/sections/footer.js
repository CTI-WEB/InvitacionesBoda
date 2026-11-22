import { escapeHtml } from '../format.js'

const isFilled = (value) => typeof value === 'string' && value.trim() !== ''

/**
 * Pie de la invitación: hashtag, cierre y créditos. Cada bloque es opcional
 * y no deja huecos cuando falta. El footer no tiene recursos que liberar.
 */
export function createFooter(config) {
  if (!config || config.enabled === false) return null

  const hashtag = isFilled(config.hashtag) ? config.hashtag.trim() : ''
  const closing = isFilled(config.closing) ? config.closing.trim() : ''
  const credits = isFilled(config.credits) ? config.credits.trim() : ''

  if (!hashtag && !closing && !credits) return null

  const hashtagText = hashtag && !hashtag.startsWith('#') ? `#${hashtag}` : hashtag
  const hashtagUrl = isFilled(config.hashtagUrl) ? config.hashtagUrl.trim() : ''

  const blocks = []
  let delay = 0

  if (hashtag) {
    const hashtagMarkup = hashtagUrl
      ? `<a
          class="footer__hashtag"
          href="${escapeHtml(hashtagUrl)}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ver publicaciones con ${escapeHtml(hashtagText)} (se abre en una pestaña nueva)"
          data-reveal
          style="--reveal-delay: ${delay}ms"
        >${escapeHtml(hashtagText)}</a>`
      : `<p class="footer__hashtag" data-reveal style="--reveal-delay: ${delay}ms">
          ${escapeHtml(hashtagText)}
        </p>`

    blocks.push(hashtagMarkup)
    delay += 90
  }

  if (closing) {
    blocks.push(
      `<p class="footer__closing" data-reveal style="--reveal-delay: ${delay}ms">${escapeHtml(
        closing,
      )}</p>`,
    )
    delay += 90
  }

  if (credits) {
    blocks.push(
      `<p class="footer__credits" data-reveal style="--reveal-delay: ${delay}ms">${escapeHtml(
        credits,
      )}</p>`,
    )
  }

  const footer = document.createElement('footer')
  footer.className = 'section footer'
  footer.setAttribute('role', 'contentinfo')
  footer.innerHTML = blocks.join('')

  return {
    element: footer,
    destroy() {},
  }
}
