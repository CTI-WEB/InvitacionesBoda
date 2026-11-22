import { renderStory } from './story.js'
import { renderEvent } from './event.js'
import { renderCountdown } from './countdown.js'
import { renderGallery } from './gallery.js'
import { createDressCode } from './dress-code.js'
import { createRsvp } from './rsvp.js'
import { createGifts } from './gifts.js'
import { createMusic } from './music.js'
import { createFooter } from './footer.js'

/**
 * Registro de secciones disponibles.
 * Para añadir una sección: crea su módulo, regístralo aquí y añade su id
 * a `sections` en config/wedding.config.js.
 */
const renderers = {
  story: renderStory,
  event: renderEvent,
  countdown: renderCountdown,
  gallery: renderGallery,
  dressCode: createDressCode,
  rsvp: createRsvp,
  gifts: createGifts,
  music: createMusic,
  footer: createFooter,
}

const destroyers = new Set()

export function renderSections(config) {
  const fragment = document.createDocumentFragment()
  const order = Array.isArray(config.sections) ? config.sections : []

  order.forEach((id) => {
    const render = renderers[id]
    const data = config[id]

    if (!render) {
      console.warn(`[invitación] No existe un módulo para la sección "${id}".`)
      return
    }

    if (!data) {
      console.warn(`[invitación] Falta la configuración de la sección "${id}".`)
      return
    }

    const result = render(data, config)

    if (!result) {
      return
    }

    if (typeof result.destroy === 'function') {
      destroyers.add(result.destroy)
    }

    fragment.append(result.element ?? result)
  })

  return fragment
}

/**
 * Libera los recursos de las secciones montadas (intervalos, listeners...).
 */
export function disposeSections() {
  destroyers.forEach((destroy) => {
    try {
      destroy()
    } catch (error) {
      console.warn('[invitación] No se pudo desmontar una sección:', error)
    }
  })
  destroyers.clear()
}
