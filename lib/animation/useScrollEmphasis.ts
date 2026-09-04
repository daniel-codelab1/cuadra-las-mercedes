'use client'

import { useRef } from 'react'

import { gsap, prefersReducedMotion, useGSAP } from './gsap'

export type ScrollEmphasisOptions = {
  /** Selector de las palabras a oscurecer, dentro del contenedor. */
  selector?: string
  /**
   * Píxeles de scroll que consume cada palabra. Es lo que decide cuánto tiempo
   * queda la sección fijada: más alto, lectura más pausada.
   */
  pxPerWord?: number
  /**
   * Solape entre palabras. 1 = estrictamente una detrás de otra; por debajo de
   * 1 empiezan a encenderse antes de que termine la anterior.
   */
  stagger?: number
}

/**
 * Fija una sección y va oscureciendo su texto palabra a palabra a medida que el
 * usuario hace scroll, para forzar el ritmo de lectura. Al terminar, suelta el
 * pin y la página sigue.
 *
 * Anima la variable `--emphasis` de cada palabra, no su `color`: el color final
 * sale de `color-mix` sobre las variables de tema (ver `.emphasis-word` en
 * app/globals.css), así que el efecto vale igual en claro y en oscuro. Animar
 * `color` directamente obligaría a leer hex del tema en tiempo de ejecución y se
 * quedaría desfasado al cambiar de tema.
 *
 * El registro `@property --emphasis` de globals.css no es cosmético: GSAP lee el
 * valor de partida con `getComputedStyle`, y una custom property sin registrar
 * computa a cadena vacía. Sin ese bloque, el barrido no arranca.
 *
 * Con `prefers-reduced-motion` no hay pin ni barrido: el texto sale entero.
 *
 * **Tampoco por debajo de `lg` (1024px).** No es sólo que fijar y trabar el
 * scroll compita con el gesto táctil: a ese ancho el párrafo, ya de por sí más
 * alto que la ventana, queda centrado dentro de un `h-dvh` con overflow
 * oculto, así que el arranque de la frase se recorta por arriba y es
 * imposible de leer mientras la sección está fijada. Se resuelve igual que
 * `prefers-reduced-motion`: sin pin, con el texto suelto en el flujo normal.
 */
export function useScrollEmphasis<
  S extends HTMLElement = HTMLElement,
  C extends HTMLElement = HTMLElement,
>(options: ScrollEmphasisOptions = {}) {
  const { selector = '[data-emphasis]', pxPerWord = 46, stagger = 0.6 } = options

  const sectionRef = useRef<S>(null)
  const contentRef = useRef<C>(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      const content = contentRef.current
      if (!section || !content) return

      const words = gsap.utils.toArray<HTMLElement>(content.querySelectorAll(selector))
      if (words.length === 0) return

      const isDesktop = window.matchMedia('(min-width: 1024px)').matches

      if (prefersReducedMotion() || !isDesktop) {
        gsap.set(words, { '--emphasis': 1 })
        return
      }

      gsap.to(words, {
        '--emphasis': 1,
        duration: 1,
        stagger,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${words.length * pxPerWord}`,
          pin: true,
          anticipatePin: 1,
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
    },
    { scope: sectionRef, dependencies: [selector, pxPerWord, stagger], revertOnUpdate: true },
  )

  return { sectionRef, contentRef }
}
