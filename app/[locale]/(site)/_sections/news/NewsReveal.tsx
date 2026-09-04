'use client'

import { useRef } from 'react'

import { gsap, prefersReducedMotion, useGSAP } from '@/lib/animation'

/**
 * Barrido de izquierda a derecha.
 *
 * Recorte con `inset()`: arranca tapada del todo por el lado derecho
 * (`inset(0% 0% 0% 0%)` sobre el borde derecho no cabría, así que se parte de
 * un recorte del 100% ahí) y ese recorte se retira hacia la derecha hasta
 * `0%`, dejando la imagen completa. El borde que avanza es vertical, de
 * izquierda a derecha.
 *
 * Las cuatro posiciones llevan `%` en los dos extremos a propósito: GSAP toma
 * la unidad de cada número del valor de llegada, y un número sin unidad dentro
 * de un `inset()` invalida la declaración entera a mitad de camino (la misma
 * trampa documentada en CLAUDE.md).
 */
const WIPE_FROM = 'inset(0% 100% 0% 0%)'
const WIPE_TO = 'inset(0% 0% 0% 0%)'

/** Retardo entre una tarjeta y la siguiente. */
const CARD_STEP = 0.12

export type NewsRevealProps = React.ComponentPropsWithoutRef<'section'>

/**
 * Entrada escalonada de la sección de novedades.
 *
 * El orden es: primero el titular; después las tarjetas en cascada, cada una
 * con su foto barrida de izquierda a derecha **y su texto a la vez**; y al
 * final el botón, que baja desde arriba.
 *
 * Es una coreografía propia de esta sección —tres tiempos encadenados y dos
 * cascadas sincronizadas entre sí—, no el reveal estándar, así que vive aquí y
 * no en `lib/animation`. Los elementos se marcan con `data-news-*` y las clases
 * `draw-init` / `reveal-init` evitan el flash antes de que GSAP arranque.
 */
export function NewsReveal({ children, className, ...props }: NewsRevealProps) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      const title = el.querySelector<HTMLElement>('[data-news-title]')
      const media = Array.from(el.querySelectorAll<HTMLElement>('[data-news-media]'))
      const bodies = Array.from(el.querySelectorAll<HTMLElement>('[data-news-body]'))
      const cta = el.querySelector<HTMLElement>('[data-news-cta]')

      if (prefersReducedMotion()) {
        gsap.set([title, ...bodies, cta].filter(Boolean), { opacity: 1, y: 0 })
        gsap.set(media, { clipPath: 'none' })
        return
      }

      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 80%', once: true } })

      tl.fromTo(
        title,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      )
        // Las fotos empiezan a destaparse antes de que el titular termine de
        // asentarse: encadenadas de punta a punta la secuencia se siente lenta.
        .fromTo(
          media,
          { clipPath: WIPE_FROM },
          {
            clipPath: WIPE_TO,
            duration: 1.1,
            stagger: CARD_STEP,
            ease: 'power2.inOut',
          },
          '-=0.25',
        )
        // `<` las ancla al arranque del barrido: cada texto entra con su foto,
        // no detrás de ella, y comparten el mismo escalonado.
        .fromTo(
          bodies,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.8, stagger: CARD_STEP, ease: 'power3.out' },
          '<',
        )
        .fromTo(
          cta,
          { opacity: 0, y: -24 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' },
          '-=0.5',
        )
    },
    { scope: ref },
  )

  return (
    <section ref={ref} className={className} {...props}>
      {children}
    </section>
  )
}
