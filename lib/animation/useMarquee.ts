'use client'

import { useRef } from 'react'

import { gsap, prefersReducedMotion, useGSAP } from './gsap'

export type MarqueeOptions = {
  /**
   * Velocidad en píxeles por segundo. Es constante a propósito: al añadir
   * logos desde el CMS crece el recorrido, no la velocidad. Con una duración
   * fija (que es lo que daría una animación CSS) el carrusel se aceleraría
   * solo al sumar aliados.
   */
  speed?: number
}

/**
 * Carrusel infinito horizontal (marquesina).
 *
 * El track debe contener la lista **duplicada dos veces**: la animación
 * desplaza exactamente la mitad de su ancho, así que al terminar el ciclo el
 * contenido visible es idéntico al del inicio y el salto no se ve. La copia
 * debe ir marcada `aria-hidden` para que no se anuncie dos veces.
 *
 * Con `prefers-reduced-motion` no se anima: el track queda quieto (conviene que
 * el contenedor lleve `overflow-x-auto` para poder recorrerlo a mano).
 *
 * `pause`/`resume` se exponen para detenerlo al pasar el ratón o al enfocar con
 * teclado — sin eso, no hay forma cómoda de hacer clic en un logo en marcha.
 */
export function useMarquee<
  C extends HTMLElement = HTMLElement,
  T extends HTMLElement = HTMLElement,
>(options: MarqueeOptions = {}) {
  const { speed = 60 } = options

  const containerRef = useRef<C>(null)
  const trackRef = useRef<T>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  useGSAP(
    (_context, contextSafe) => {
      const track = trackRef.current
      if (!track || !contextSafe) return
      if (prefersReducedMotion()) return

      // `contextSafe` es necesario porque esto también se invoca desde el
      // ResizeObserver, es decir DESPUÉS de que useGSAP haya terminado: sin
      // envolverlo, esos tweens quedarían fuera del contexto y no se
      // revertirían al desmontar.
      const build = contextSafe(() => {
        tweenRef.current?.kill()
        gsap.set(track, { x: 0 })

        const distance = track.scrollWidth / 2
        if (distance <= 0) return

        tweenRef.current = gsap.to(track, {
          x: -distance,
          duration: distance / speed,
          ease: 'none',
          repeat: -1,
        })
      })

      build()

      // El ancho cambia al cargar las imágenes y al redimensionar la ventana.
      // Observa la caja de contenido, que las transformaciones no alteran, así
      // que la propia animación no puede realimentar el observer.
      const observer = new ResizeObserver(build)
      observer.observe(track)

      return () => {
        observer.disconnect()
        tweenRef.current?.kill()
        tweenRef.current = null
      }
    },
    { scope: containerRef, dependencies: [speed], revertOnUpdate: true },
  )

  return {
    containerRef,
    trackRef,
    pause: () => tweenRef.current?.pause(),
    resume: () => tweenRef.current?.play(),
  }
}
