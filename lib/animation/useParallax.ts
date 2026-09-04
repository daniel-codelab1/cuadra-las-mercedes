'use client'

import { useRef } from 'react'

import { gsap, prefersReducedMotion, useGSAP } from './gsap'

export type ParallaxOptions = {
  /**
   * Recorrido total en px a lo largo de la ventana de scroll. Positivo = el
   * elemento se queda atrás; negativo = adelanta al scroll.
   */
  distance?: number
  scrub?: number | boolean
}

/**
 * Parallax de imágenes. Aplícalo al `<Image>` (o a su wrapper) dentro de un
 * contenedor con `overflow-hidden`, y dale al elemento un alto mayor que el del
 * contenedor para que el recorrido no descubra bordes.
 */
export function useParallax<T extends HTMLElement = HTMLElement>(
  options: ParallaxOptions = {},
) {
  const { distance = 80, scrub = true } = options
  const ref = useRef<T>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      if (prefersReducedMotion()) return

      gsap.fromTo(
        el,
        { y: -distance / 2 },
        {
          y: distance / 2,
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement ?? el,
            start: 'top bottom',
            end: 'bottom top',
            scrub,
            invalidateOnRefresh: true,
          },
        },
      )
    },
    { scope: ref, dependencies: [distance, scrub], revertOnUpdate: true },
  )

  return ref
}
