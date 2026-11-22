const SELECTOR = '[data-reveal]'
let observer = null

/**
 * Aparición suave al entrar en pantalla. Sin librerías y respetando
 * prefers-reduced-motion (gestionado en CSS).
 */
export function initReveal() {
  document.documentElement.classList.add('has-reveal')

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll(SELECTOR).forEach((element) => {
      element.classList.add('revealed')
    })
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('revealed')
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.15, rootMargin: '0px 0px -80px 0px' },
  )

  // La portada es contenido above-the-fold: se revela al cargar para que
  // el CTA no quede oculto por el margen inferior del observador.
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      document.querySelectorAll('.cover [data-reveal]').forEach((element) => {
        element.classList.add('revealed')
      })
    })
  })

  observeReveals()
}

export function observeReveals(root = document) {
  if (!observer) return

  root.querySelectorAll(SELECTOR).forEach((element) => {
    if (!element.classList.contains('revealed')) {
      observer.observe(element)
    }
  })
}
