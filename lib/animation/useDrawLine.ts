'use client'

import { useRef } from 'react'

import { gsap, prefersReducedMotion, useGSAP } from './gsap'

export type DrawLineOptions = {
  /**
   * Velocidad de dibujo en px/s, no una duración fija: así todos los tramos se
   * dibujan al mismo ritmo aunque midan distinto, que es lo que hace que se
   * lean como un solo trazo y no como líneas creciendo a la vez.
   */
  speed?: number
  /** Espera antes de empezar a dibujar, para encadenarlo tras un reveal. */
  delay?: number
  /** `start` de ScrollTrigger. */
  start?: string
  /** Selector de los tramos a dibujar, en el orden en que se recorren. */
  selector?: string
  once?: boolean
}

/**
 * Estado inicial y final del recorte. Ver `.draw-init` en `globals.css`.
 *
 * Con `%` explícito en las cuatro posiciones, ceros incluidos: GSAP toma la
 * unidad de cada número del valor de llegada, así que un `0` pelado en una
 * posición que sí se mueve pinta un recorte inválido a mitad de camino y el
 * navegador lo descarta (ver la nota larga en la sección `hub`).
 */
const HIDDEN = 'inset(0% 100% 0% 0%)'
const DRAWN = 'inset(0% 0% 0% 0%)'

/**
 * Dibuja líneas horizontales de izquierda a derecha al entrar en viewport, un
 * tramo tras otro (motor de los subrayados de la fila de cifras).
 *
 * Recorta con `clip-path` en vez de animar el ancho o `scaleX`: escalar
 * deformaría el punteado y animar el ancho obligaría a recalcular el layout en
 * cada frame. Recortando, cada tramo aparece a su tamaño final y sólo se
 * descubre.
 *
 * Uso:
 * ```tsx
 * const ref = useDrawLine<HTMLElement>({ delay: 0.9 })
 * <section ref={ref}>
 *   <span data-draw className="draw-init …" />
 * </section>
 * ```
 */
export function useDrawLine<T extends HTMLElement = HTMLElement>(
  options: DrawLineOptions = {},
) {
  const {
    speed = 900,
    delay = 0,
    start = 'top 85%',
    selector = '[data-draw]',
    once = true,
  } = options

  const ref = useRef<T>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      const targets = Array.from(el.querySelectorAll<HTMLElement>(selector))
      if (targets.length === 0) return

      if (prefersReducedMotion()) {
        gsap.set(targets, { clipPath: 'none' })
        return
      }

      const timeline = gsap.timeline({
        delay,
        scrollTrigger: { trigger: el, start, once },
      })

      // Encadenados: el siguiente tramo arranca donde termina el anterior.
      targets.forEach((target) => {
        timeline.fromTo(
          target,
          { clipPath: HIDDEN },
          { clipPath: DRAWN, duration: target.offsetWidth / speed, ease: 'none' },
        )
      })
    },
    { scope: ref, dependencies: [speed, delay, start, selector, once], revertOnUpdate: true },
  )

  return ref
}
