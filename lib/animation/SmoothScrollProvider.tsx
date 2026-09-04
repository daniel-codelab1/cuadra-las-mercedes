'use client'

import { createContext, useCallback, useContext, useEffect, useRef } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap'

const LenisContext = createContext<() => Lenis | null>(() => null)

/**
 * Devuelve un getter de la instancia activa de Lenis (`null` si no la hay: SSR
 * o `prefers-reduced-motion`).
 *
 * Hace falta para desplazar la página por código —flechas de navegación,
 * anclas— sin pelearse con el smooth scroll: un `window.scrollTo` compite con
 * la interpolación de Lenis y da tirones. Quien lo use debe contemplar el
 * `null` y caer a `window.scrollTo`.
 *
 * Es un getter y no la instancia porque sólo se necesita dentro de manejadores
 * de eventos, nunca durante el render: guardarla en estado obligaría a
 * re-renderizar toda la app al montarse, sin que nada de lo pintado dependa de
 * ella.
 */
export function useLenis() {
  return useContext(LenisContext)
}

/**
 * Envuelve la app con smooth scroll de Lenis y sincroniza su RAF con el ticker
 * de GSAP, de modo que ScrollTrigger lea posiciones ya interpoladas y las
 * animaciones no vayan un frame por detrás del scroll.
 *
 * Si el usuario pide `prefers-reduced-motion`, no se instancia Lenis: el scroll
 * queda nativo y ScrollTrigger sigue funcionando igual.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const getLenis = useCallback(() => lenisRef.current, [])

  useEffect(() => {
    if (prefersReducedMotion()) return

    const instance = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      // El scroll táctil nativo ya se siente bien; forzarlo empeora en móvil.
      syncTouch: false,
    })

    instance.on('scroll', ScrollTrigger.update)

    const raf = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    ScrollTrigger.refresh()
    lenisRef.current = instance

    return () => {
      gsap.ticker.remove(raf)
      gsap.ticker.lagSmoothing(500, 33)
      instance.destroy()
      lenisRef.current = null
    }
  }, [])

  return <LenisContext.Provider value={getLenis}>{children}</LenisContext.Provider>
}
