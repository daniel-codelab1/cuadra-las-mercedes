'use client'

import { useRef } from 'react'

import { gsap, prefersReducedMotion, useGSAP } from './gsap'

export type ScrollRevealOptions = {
  /** Desplazamiento vertical inicial en px. */
  y?: number
  /** Duración de cada elemento, en segundos. */
  duration?: number
  /** Retardo entre elementos hijos. */
  stagger?: number
  /** `start` de ScrollTrigger. */
  start?: string
  /** Selector de los hijos a animar. Si no hay coincidencias, anima el contenedor. */
  selector?: string
  /** Animar una sola vez (por defecto) o cada vez que entra en viewport. */
  once?: boolean
}

/**
 * Reveal estándar del sitio: fade + translateY escalonado al entrar en viewport.
 *
 * Uso:
 * ```tsx
 * const ref = useScrollReveal<HTMLDivElement>()
 * <div ref={ref}>
 *   <h2 data-reveal className="reveal-init">Historia</h2>
 *   <p data-reveal className="reveal-init">…</p>
 * </div>
 * ```
 * `reveal-init` evita el flash de contenido visible antes de que GSAP arranque;
 * con `prefers-reduced-motion` esa clase es inerte y todo queda visible.
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  options: ScrollRevealOptions = {},
) {
  const {
    y = 32,
    duration = 0.9,
    stagger = 0.12,
    start = 'top 85%',
    selector = '[data-reveal]',
    once = true,
  } = options

  const ref = useRef<T>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      const found = selector ? Array.from(el.querySelectorAll<HTMLElement>(selector)) : []
      const targets = found.length > 0 ? found : [el]

      if (prefersReducedMotion()) {
        gsap.set(targets, { opacity: 1, y: 0, clearProps: 'opacity,transform' })
        return
      }

      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          stagger,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start, once },
        },
      )
    },
    { scope: ref, dependencies: [y, duration, stagger, start, selector, once], revertOnUpdate: true },
  )

  return ref
}
