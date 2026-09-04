'use client'

import { useEffect, useRef } from 'react'

import { gsap, prefersReducedMotion, useGSAP } from './gsap'

export type CountUpOptions = {
  from?: number
  duration?: number
  /** Cómo se pinta el número en cada frame (prefijos, sufijos, decimales). */
  format?: (value: number) => string
  start?: string
}

/**
 * Anima un número desde `from` hasta `to` cuando su elemento entra en viewport.
 * Es el motor de los contadores de las stat cards (DESIGN_SYSTEM.md §4).
 *
 * Devuelve una ref para un elemento de texto; el valor final ya debe estar
 * renderizado en el HTML (SSR + sin JS muestran la cifra correcta).
 */
export function useCountUp<T extends HTMLElement = HTMLElement>(
  to: number,
  options: CountUpOptions = {},
) {
  const {
    from = 0,
    duration = 1.8,
    format = (value: number) => String(Math.round(value)),
    start = 'top 85%',
  } = options

  const ref = useRef<T>(null)

  // El formateador se recrea en cada render, pero su comportamiento sólo
  // depende de props estables. Se guarda en una ref para que la animación no se
  // reinicie en cada render y siga usando siempre la versión más reciente.
  const formatRef = useRef(format)
  useEffect(() => {
    formatRef.current = format
  })

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      if (prefersReducedMotion()) return

      const counter = { value: from }

      gsap.to(counter, {
        value: to,
        duration,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = formatRef.current(counter.value)
        },
        onComplete: () => {
          el.textContent = formatRef.current(to)
        },
        scrollTrigger: { trigger: el, start, once: true },
      })
    },
    { scope: ref, dependencies: [to, from, duration, start], revertOnUpdate: true },
  )

  return ref
}
