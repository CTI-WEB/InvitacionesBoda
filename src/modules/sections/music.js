import { escapeHtml } from '../format.js'

const isFilled = (value) => typeof value === 'string' && value.trim() !== ''

const formatTime = (value) => {
  const total = Number.isFinite(value) && value > 0 ? Math.floor(value) : 0
  const minutes = Math.floor(total / 60)
  const seconds = total % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

const playIcon = `
  <svg class="music__toggle-icon" data-music-icon="play" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M9.2 6.2v11.6l9.2-5.8-9.2-5.8Z" fill="currentColor" stroke="currentColor" stroke-linejoin="round" stroke-width="1" />
  </svg>`

const pauseIcon = `
  <svg class="music__toggle-icon" data-music-icon="pause" viewBox="0 0 24 24" aria-hidden="true" focusable="false" hidden>
    <rect x="8.5" y="6" width="2.6" height="12" rx="0.6" fill="currentColor" />
    <rect x="12.9" y="6" width="2.6" height="12" rx="0.6" fill="currentColor" />
  </svg>`

const arrowIcon = `
  <svg class="music__icon" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
    <path d="M3.5 2.5h6v6M9.5 2.5 2.5 9.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.1" />
  </svg>`

/**
 * Música: reproductor HTML5 con controles personalizados o enlace externo
 * a Spotify/YouTube. Si ambos existen, el reproductor tiene prioridad.
 */
export function createMusic(config) {
  if (!config || config.enabled === false) return null
  if (!isFilled(config.title)) return null

  const audioSrc = isFilled(config.audioSrc) ? config.audioSrc.trim() : ''
  const externalUrl = isFilled(config.externalUrl) ? config.externalUrl.trim() : ''

  if (!audioSrc && !externalUrl) return null

  const hasAudio = audioSrc !== ''
  const hasExternal = externalUrl !== ''

  const externalLabel = isFilled(config.externalLabel)
    ? config.externalLabel.trim()
    : 'Escuchar la canción'

  const eyebrow = isFilled(config.eyebrow)
    ? `<p class="eyebrow" data-reveal>${escapeHtml(config.eyebrow)}</p>`
    : ''

  const description = isFilled(config.description)
    ? `<p class="music__description" data-reveal style="--reveal-delay: 120ms">${escapeHtml(
        config.description,
      )}</p>`
    : ''

  const playerBlock = hasAudio
    ? `<div class="music__player" data-reveal style="--reveal-delay: 200ms">
        <audio class="music__audio" src="${escapeHtml(audioSrc)}" preload="metadata"></audio>
        <button
          class="music__toggle"
          type="button"
          data-music-toggle
          aria-label="Reproducir"
        >
          ${playIcon}
          ${pauseIcon}
        </button>
        <div class="music__timeline">
          <div
            class="music__progress"
            role="slider"
            tabindex="0"
            aria-label="Progreso de la canción"
            aria-valuemin="0"
            aria-valuemax="0"
            aria-valuenow="0"
            aria-valuetext="00:00 de 00:00"
            data-music-progress
          >
            <span class="music__progress-track">
              <span class="music__progress-fill" data-music-progress-fill></span>
            </span>
          </div>
          <p class="music__times">
            <span data-music-current aria-label="Tiempo actual">00:00</span>
            <span data-music-duration aria-label="Duración">00:00</span>
          </p>
        </div>
      </div>`
    : ''

  const externalBlock = hasExternal
    ? `<div class="music__external" data-reveal style="--reveal-delay: ${
        hasAudio ? 300 : 200
      }ms">
        ${hasAudio ? '<p class="music__external-label">También puedes escucharla en</p>' : ''}
        <a
          class="music__link"
          href="${escapeHtml(externalUrl)}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="${escapeHtml(externalLabel)} (se abre en una pestaña nueva)"
        >
          <span>${escapeHtml(externalLabel)}</span>
          ${arrowIcon}
        </a>
      </div>`
    : ''

  const section = document.createElement('section')
  section.className = 'section music'
  section.setAttribute('aria-labelledby', 'musica-titulo')
  section.innerHTML = `
    ${eyebrow}
    <h2 class="section__title" id="musica-titulo" data-reveal style="--reveal-delay: 60ms">
      ${escapeHtml(config.title)}
    </h2>
    ${description}
    ${playerBlock}
    ${externalBlock}
  `

  const controller = new AbortController()
  const { signal } = controller
  let audio = null

  if (hasAudio) {
    audio = section.querySelector('.music__audio')
    const toggle = section.querySelector('[data-music-toggle]')
    const playGlyph = section.querySelector('[data-music-icon="play"]')
    const pauseGlyph = section.querySelector('[data-music-icon="pause"]')
    const progress = section.querySelector('[data-music-progress]')
    const fill = section.querySelector('[data-music-progress-fill]')
    const currentLabel = section.querySelector('[data-music-current]')
    const durationLabel = section.querySelector('[data-music-duration]')

    const getDuration = () =>
      Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 0

    const setPlayingState = (playing) => {
      playGlyph.toggleAttribute('hidden', playing)
      pauseGlyph.toggleAttribute('hidden', !playing)
      toggle.setAttribute('aria-label', playing ? 'Pausar' : 'Reproducir')
      toggle.classList.toggle('is-playing', playing)
    }

    const updateProgress = () => {
      const duration = getDuration()
      const current = Number.isFinite(audio.currentTime) ? audio.currentTime : 0
      const ratio = duration > 0 ? Math.min(Math.max(current / duration, 0), 1) : 0

      fill.style.width = `${ratio * 100}%`
      currentLabel.textContent = formatTime(current)
      durationLabel.textContent = formatTime(duration)
      progress.setAttribute('aria-valuemax', String(Math.round(duration)))
      progress.setAttribute('aria-valuenow', String(Math.round(current)))
      progress.setAttribute(
        'aria-valuetext',
        `${formatTime(current)} de ${formatTime(duration)}`,
      )
    }

    const seekToRatio = (ratio) => {
      const duration = getDuration()

      if (!duration) return

      audio.currentTime = Math.min(Math.max(ratio, 0), 1) * duration
      updateProgress()
    }

    const seekFromPointer = (event) => {
      const rect = progress.getBoundingClientRect()

      if (!rect.width) return

      seekToRatio((event.clientX - rect.left) / rect.width)
    }

    const onProgressKeydown = (event) => {
      const duration = getDuration()

      if (!duration) return

      const step = event.shiftKey ? 10 : 5
      let handled = true

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          seekToRatio((audio.currentTime + step) / duration)
          break
        case 'ArrowLeft':
        case 'ArrowDown':
          seekToRatio((audio.currentTime - step) / duration)
          break
        case 'Home':
          seekToRatio(0)
          break
        case 'End':
          seekToRatio(1)
          break
        default:
          handled = false
      }

      if (handled) event.preventDefault()
    }

    toggle.addEventListener(
      'click',
      async () => {
        if (audio.paused) {
          try {
            await audio.play()
          } catch (error) {
            console.warn('[invitación] No se pudo reproducir el audio:', error)
          }
        } else {
          audio.pause()
        }
      },
      { signal },
    )

    audio.addEventListener('play', () => setPlayingState(true), { signal })
    audio.addEventListener('pause', () => setPlayingState(false), { signal })
    audio.addEventListener('ended', () => setPlayingState(false), { signal })
    audio.addEventListener('timeupdate', updateProgress, { signal })
    audio.addEventListener('loadedmetadata', updateProgress, { signal })
    audio.addEventListener('durationchange', updateProgress, { signal })

    progress.addEventListener('click', seekFromPointer, { signal })
    progress.addEventListener('keydown', onProgressKeydown, { signal })

    updateProgress()
  }

  return {
    element: section,
    destroy() {
      controller.abort()

      if (!audio) return

      audio.pause()
      audio.removeAttribute('src')
      audio.load()
    },
  }
}
