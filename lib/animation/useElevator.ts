'use client'

import { useRef } from 'react'

import { gsap, prefersReducedMotion, useGSAP } from './gsap'

export type ElevatorOptions = {
  duration?: number
  ease?: string
}

/**
 * Transición tipo ascensor entre paneles apilados.
 *
 * El contenedor debe apilar a todos sus hijos en la misma celda de grid
 * (`grid` + `col-start-1 row-start-1` en cada hijo) y llevar `overflow-hidden`:
 * así mide siempre lo que el panel más alto y no hay salto de layout al
 * cambiar, que es lo que rompería la ilusión.
 *
 * El sentido sigue al del índice: avanzar sube el contenido, retroceder lo
 * baja. Es lo que hace que se lea como pisos y no como un fundido.
 */
export function useElevator<T extends HTMLElement = HTMLElement>(
  index: number,
  options: ElevatorOptions = {},
) {
  const { duration = 0.7, ease = 'power3.inOut' } = options

  const ref = useRef<T>(null)
  const previous = useRef(index)

  useGSAP(
    () => {
      const container = ref.current
      if (!container) return

      const items = gsap.utils.toArray<HTMLElement>(container.children)
      const from = previous.current
      const to = index
      previous.current = to

      // Primer render (o índice sin cambios): coloca sin animar.
      if (from === to) {
        items.forEach((el, i) => gsap.set(el, { yPercent: i === to ? 0 : 100 }))
        return
      }

      const direction = to > from ? -1 : 1
      const time = prefersReducedMotion() ? 0 : duration

      items.forEach((el, i) => {
        if (i === to) {
          gsap.fromTo(
            el,
            { yPercent: -direction * 100 },
            { yPercent: 0, duration: time, ease, overwrite: 'auto' },
          )
        } else if (i === from) {
          gsap.to(el, { yPercent: direction * 100, duration: time, ease, overwrite: 'auto' })
        } else {
          gsap.set(el, { yPercent: 100 })
        }
      })
    },
    { scope: ref, dependencies: [index] },
  )

  return ref
}
