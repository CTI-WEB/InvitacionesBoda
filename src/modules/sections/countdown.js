import { escapeHtml, parseWeddingDate } from '../format.js'

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

const unit = (key, label) => `
  <div class="countdown__unit">
    <span class="countdown__value" data-countdown="${key}">00</span>
    <span class="countdown__label">${label}</span>
  </div>`

/**
 * Cuenta regresiva hasta config.wedding.date.
 * Devuelve el nodo y una función destroy para liberar el intervalo.
 */
export function renderCountdown(countdown, config = {}) {
  const target = parseWeddingDate(config.wedding?.date)

  if (!countdown?.title || Number.isNaN(target.getTime())) {
    console.warn('[invitación] La cuenta regresiva necesita una fecha válida en wedding.date.')
    return null
  }

  const section = document.createElement('section')
  section.className = 'section countdown'
  section.setAttribute('aria-labelledby', 'cuenta-regresiva-titulo')
  section.innerHTML = `
    <p class="eyebrow" data-reveal>${escapeHtml(countdown.eyebrow)}</p>
    <h3 class="section__title" id="cuenta-regresiva-titulo" data-reveal style="--reveal-delay: 60ms">
      ${escapeHtml(countdown.title)}
    </h3>
    <div class="countdown__timer" role="timer" aria-live="off" data-reveal style="--reveal-delay: 120ms">
      ${unit('days', 'Días')}
      ${unit('hours', 'Horas')}
      ${unit('minutes', 'Minutos')}
      ${unit('seconds', 'Segundos')}
    </div>
    <p class="countdown__message" data-countdown-message role="status" aria-live="polite"></p>
  `

  const timer = section.querySelector('.countdown__timer')
  const message = section.querySelector('[data-countdown-message]')
  const fields = {
    days: section.querySelector('[data-countdown="days"]'),
    hours: section.querySelector('[data-countdown="hours"]'),
    minutes: section.querySelector('[data-countdown="minutes"]'),
    seconds: section.querySelector('[data-countdown="seconds"]'),
  }

  let intervalId = null

  const stop = () => {
    if (intervalId === null) return
    window.clearInterval(intervalId)
    intervalId = null
  }

  const update = () => {
    const remaining = target.getTime() - Date.now()

    if (remaining <= 0) {
      stop()
      Object.values(fields).forEach((field) => {
        field.textContent = '00'
      })
      timer.hidden = true
      message.textContent = countdown.message ?? ''
      return
    }

    fields.days.textContent = String(Math.floor(remaining / DAY)).padStart(2, '0')
    fields.hours.textContent = String(Math.floor((remaining % DAY) / HOUR)).padStart(2, '0')
    fields.minutes.textContent = String(Math.floor((remaining % HOUR) / MINUTE)).padStart(2, '0')
    fields.seconds.textContent = String(Math.floor((remaining % MINUTE) / SECOND)).padStart(2, '0')
  }

  const tick = () => {
    if (!section.isConnected) {
      stop()
      return
    }
    update()
  }

  update()

  if (target.getTime() > Date.now()) {
    intervalId = window.setInterval(tick, SECOND)
  }

  return { element: section, destroy: stop }
}
