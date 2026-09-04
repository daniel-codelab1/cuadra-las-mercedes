'use client'

import { useEffect, useRef } from 'react'

import { gsap, prefersReducedMotion, useGSAP } from './gsap'

export type HorizontalPinSetup = {
  /**
   * El tween que desplaza el track. Es lo que hay que pasar como
   * `containerAnimation` a los ScrollTrigger de los elementos de dentro.
   * Es `null` con `prefers-reduced-motion`, donde no hay desplazamiento.
   */
  tween: gsap.core.Tween | null
  section: HTMLElement
  track: HTMLElement
}

export type HorizontalPinOptions = {
  /** Suavizado del scrub. `true` = 1:1 con el scroll. */
  scrub?: number | boolean
  /** Multiplica el recorrido de scroll respecto al ancho a desplazar. */
  speed?: number
  /**
   * Se ejecuta dentro del mismo contexto de GSAP, con el tween ya creado.
   *
   * Es la vía para animar elementos **dentro** del track: sus ScrollTrigger
   * necesitan `containerAnimation` apuntando a ese tween. Sin eso medirían el
   * scroll vertical de la página, no el desplazamiento horizontal, y se
   * dispararían todos a la vez en cuanto la sección entrase en pantalla.
   *
   * Ojo: en un ScrollTrigger con `containerAnimation` no se puede usar `pin`
   * ni `snap`, y `start`/`end` se expresan en horizontal (`'left center'`).
   */
  onSetup?: (setup: HorizontalPinSetup) => void
}

/**
 * Fija una sección y traduce el scroll vertical en desplazamiento horizontal
 * del track interno. Es el patrón del carrusel de proyectos
 * ("+500 proyectos en desarrollo", DESIGN_SYSTEM.md §4).
 *
 * Uso:
 * ```tsx
 * const { sectionRef, trackRef } = useHorizontalPin<HTMLElement, HTMLDivElement>()
 * <section ref={sectionRef} className="h-dvh overflow-hidden">
 *   <div ref={trackRef} className="flex h-full w-max items-center">…</div>
 * </section>
 * ```
 *
 * Con `prefers-reduced-motion` no se hace pin: el track queda como una fila con
 * scroll horizontal nativo (añade `motion-reduce:overflow-x-auto` en la sección).
 *
 * **Tampoco por debajo de `lg` (1024px).** El pin horizontal es el patrón más
 * frágil del sitio en touch —compite con el scroll nativo del dedo—, y en
 * `projects` la sección que lo usa se oculta con CSS por debajo de ese ancho a
 * favor de un carril de scroll nativo (ver `app/[locale]/(site)/_sections/
 * projects/index.tsx`). Sin esta guarda, GSAP seguiría creando el pin sobre un
 * elemento con `display: none` — sin dimensiones que medir, y sin nada visible
 * que anime.
 */
export function useHorizontalPin<
  S extends HTMLElement = HTMLElement,
  T extends HTMLElement = HTMLElement,
>(options: HorizontalPinOptions = {}) {
  const { scrub = 1, speed = 1, onSetup } = options

  const sectionRef = useRef<S>(null)
  const trackRef = useRef<T>(null)

  // El callback se recrea en cada render; guardarlo en una ref evita que el
  // contexto de GSAP se reconstruya (y el pin dé un salto) por ese motivo.
  const onSetupRef = useRef(onSetup)
  useEffect(() => {
    onSetupRef.current = onSetup
  })

  useGSAP(
    () => {
      const section = sectionRef.current
      const track = trackRef.current
      if (!section || !track) return

      const isDesktop = window.matchMedia('(min-width: 1024px)').matches

      if (prefersReducedMotion() || !isDesktop) {
        onSetupRef.current?.({ tween: null, section, track })
        return
      }

      // Se recalcula en cada refresh (resize, carga de imágenes) en vez de
      // capturarse una sola vez: `invalidateOnRefresh` vuelve a invocar estas fns.
      const distance = () => Math.max(0, track.scrollWidth - section.offsetWidth)

      const tween = gsap.to(track, {
        x: () => -distance(),
        // Obligatorio: con cualquier otro ease, la posición horizontal deja de
        // corresponderse con la del scroll y `containerAnimation` se desalinea.
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance() * speed}`,
          pin: true,
          anticipatePin: 1,
          scrub,
          invalidateOnRefresh: true,
        },
      })

      onSetupRef.current?.({ tween, section, track })
    },
    { scope: sectionRef, dependencies: [scrub, speed], revertOnUpdate: true },
  )

  return { sectionRef, trackRef }
}
