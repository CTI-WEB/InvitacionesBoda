import { weddingConfig } from '../config/wedding.config.js'
import './styles/tokens.css'
import './styles/base.css'
import './styles/components.css'
import './styles/sections.css'
import './styles/animations.css'
import { formatWeddingDate } from './modules/format.js'
import { renderCover } from './modules/cover.js'
import { renderInvitation } from './modules/invitation.js'
import { initReveal, observeReveals } from './modules/reveal.js'
import { disposeSections } from './modules/sections/index.js'

const isFilled = (value) => typeof value === 'string' && value.trim() !== ''

const OPEN_ANIMATION_MS = 700
const app = document.querySelector('#app')

if (!app) {
  throw new Error('No se encontró el contenedor #app')
}

const weddingDate = String(weddingConfig.wedding.date)
const ceremonyTime = weddingConfig.event?.items?.[0]?.time
const hasExplicitTime = /[T ]\d{2}:\d{2}/.test(weddingDate)

// La fecha siempre viene de wedding.date. Para la portada y la invitación,
// si la fecha no trae hora, se usa la hora de la ceremonia como referencia.
const date = formatWeddingDate(
  !hasExplicitTime && ceremonyTime ? `${weddingDate}T${ceremonyTime}` : weddingDate,
  weddingConfig.locale,
)
applyDocumentMeta(weddingConfig, date)

const cover = renderCover(weddingConfig, date)
const invitation = renderInvitation(weddingConfig, date)
app.append(cover, invitation)
initReveal()

// Libera los intervalos de las secciones al abandonar la página.
// Si el navegador la conserva en bfcache, se mantiene viva para poder volver.
window.addEventListener('pagehide', (event) => {
  if (!event.persisted) disposeSections()
})

const openButton = cover.querySelector('[data-open]')
const closeButton = invitation.querySelector('[data-close]')
const invitationTitle = invitation.querySelector('#invitacion-titulo')

openButton.addEventListener('click', openInvitation)
closeButton.addEventListener('click', closeInvitation)

async function openInvitation() {
  if (cover.classList.contains('is-leaving')) return

  if (!cover.hidden) {
    cover.classList.add('is-leaving')
    await waitForAnimation(cover, OPEN_ANIMATION_MS)
    cover.hidden = true
    cover.classList.remove('is-leaving')
  }

  invitation.hidden = false
  window.scrollTo(0, 0)
  observeReveals(invitation)
  invitationTitle.focus({ preventScroll: true })
}

function closeInvitation() {
  invitation.hidden = true
  cover.hidden = false
  window.scrollTo(0, 0)
  openButton.focus({ preventScroll: true })
}

function waitForAnimation(element, duration) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    let settled = false

    const finish = () => {
      if (settled) return
      settled = true
      element.removeEventListener('animationend', onAnimationEnd)
      window.clearTimeout(timeout)
      resolve()
    }

    const onAnimationEnd = (event) => {
      if (event.target === element) finish()
    }

    const timeout = window.setTimeout(finish, duration + 300)
    element.addEventListener('animationend', onAnimationEnd)
  })
}

function applyDocumentMeta(config, weddingDate) {
  const { couple, wedding } = config
  const meta = config.meta ?? {}
  const names = `${couple.first} y ${couple.second}`

  const siteName = isFilled(meta.siteName)
    ? meta.siteName.trim()
    : `${names} · Nuestra Boda`

  const baseDescription = isFilled(meta.description)
    ? meta.description.trim()
    : 'Acompáñanos a celebrar el día en que unimos nuestras vidas.'

  const description = `${names} se casan el ${weddingDate.long} en ${wedding.venue}, ${wedding.city}. ${baseDescription}`
  const pageUrl = isFilled(meta.url) ? meta.url.trim() : window.location.href
  const imageAlt = `${names} · Invitación de boda`
  const ogImage = isFilled(meta.ogImage)
    ? new URL(meta.ogImage.trim(), window.location.href).href
    : ''

  document.title = siteName

  setMeta('name', 'description', description)
  setMeta('property', 'og:type', 'website')
  setMeta('property', 'og:site_name', siteName)
  setMeta('property', 'og:title', siteName)
  setMeta('property', 'og:description', description)
  setMeta('property', 'og:url', pageUrl)
  setMeta('property', 'og:locale', (config.locale ?? 'es-ES').replace('-', '_'))
  setMeta('name', 'twitter:card', 'summary_large_image')
  setMeta('name', 'twitter:title', siteName)
  setMeta('name', 'twitter:description', description)

  if (ogImage) {
    setMeta('property', 'og:image', ogImage)
    setMeta('property', 'og:image:alt', imageAlt)
    setMeta('name', 'twitter:image', ogImage)
    setMeta('name', 'twitter:image:alt', imageAlt)
  }
}

function setMeta(attribute, name, content) {
  let element = document.head.querySelector(`meta[${attribute}="${name}"]`)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, name)
    document.head.append(element)
  }

  element.setAttribute('content', content)
}
