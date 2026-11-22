const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1)
const pad = (value) => String(value).padStart(2, '0')

/**
 * Interpreta la fecha como hora local. Un valor sin hora (YYYY-MM-DD) se
 * construiría como UTC con `new Date`, lo que desplaza el día en zonas
 * horarias negativas.
 */
export function parseWeddingDate(value) {
  const plainDate = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value).trim())

  if (plainDate) {
    const [, year, month, day] = plainDate
    return new Date(Number(year), Number(month) - 1, Number(day))
  }

  return new Date(value)
}

/**
 * Deriva todos los formatos de fecha que usa la plantilla a partir de una
 * única fuente de verdad (config.wedding.date).
 */
export function formatWeddingDate(value, locale = 'es-ES') {
  const date = parseWeddingDate(value)

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Fecha de boda inválida en wedding.config.js: "${value}"`)
  }

  const numericParts = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).formatToParts(date)

  const part = (type) => numericParts.find((item) => item.type === type)?.value ?? ''

  const weekday = capitalize(
    new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date),
  )

  const time = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)

  const long = capitalize(
    new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date),
  )

  return {
    iso: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    short: `${part('day')} · ${part('month')} · ${part('year')}`,
    weekday,
    time: `${time} h`,
    meta: `${weekday} · ${time} h`,
    long,
  }
}

export function escapeHtml(value = '') {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[char],
  )
}
