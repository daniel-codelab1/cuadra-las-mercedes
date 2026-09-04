'use client'

import { useRef } from 'react'

import type { Accent } from '@/lib/accents'
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/animation'
import { cn } from '@/lib/cn'

import { BrandMark, type BrandMarkShape } from './BrandMark'

/** Lo que tarda el isotipo en alcanzar al puntero. */
const FOLLOW = 0.35

/** Entrada y salida al asomar y retirar el puntero. */
const FADE = 0.25

export type HoverMarkProps = {
  /** Lo que activa el efecto al pasarle el puntero por encima. */
  children: React.ReactNode
  color?: Accent
  shape?: BrandMarkShape
  /** Clases de tamaño del isotipo. Cuadrado, por la caja de `BrandMark`. */
  markClassName?: string
  className?: string
}

/**
 * Muestra el isotipo de marca siguiendo al puntero mientras está sobre el
 * contenido.
 *
 * El isotipo se mueve con `quickTo`, que reutiliza un mismo tween en vez de
 * crear uno nuevo por cada `pointermove`: con el ratón lanzando decenas de
 * eventos por segundo, crear tweens sueltos llena el ticker de GSAP de
 * animaciones que se pisan.
 *
 * **Sólo con puntero fino.** En táctil no hay «pasar por encima»: el primer
 * toque dispararía el efecto y lo dejaría colgado hasta tocar otra cosa. Y con
 * `prefers-reduced-motion` tampoco se monta: un elemento persiguiendo al cursor
 * es justo lo que se pide evitar.
 */
export function HoverMark({
  children,
  color = 'terracotta',
  shape = 'E',
  markClassName,
  className,
}: HoverMarkProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const markRef = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      const mark = markRef.current
      if (!root || !mark) return
      if (prefersReducedMotion()) return
      if (!window.matchMedia('(pointer: fine)').matches) return

      const xTo = gsap.quickTo(mark, 'x', { duration: FOLLOW, ease: 'power3' })
      const yTo = gsap.quickTo(mark, 'y', { duration: FOLLOW, ease: 'power3' })

      const move = (event: PointerEvent) => {
        const box = root.getBoundingClientRect()
        xTo(event.clientX - box.left)
        yTo(event.clientY - box.top)
      }

      const enter = (event: PointerEvent) => {
        // Se coloca de golpe donde entra el puntero antes de encenderse: sin
        // esto, el isotipo viajaría visible desde donde se quedó la última vez.
        const box = root.getBoundingClientRect()
        gsap.set(mark, { x: event.clientX - box.left, y: event.clientY - box.top })
        gsap.to(mark, { opacity: 1, scale: 1, duration: FADE, ease: 'power2.out' })
      }

      const leave = () => {
        gsap.to(mark, { opacity: 0, scale: 0.6, duration: FADE, ease: 'power2.in' })
      }

      root.addEventListener('pointerenter', enter)
      root.addEventListener('pointermove', move)
      root.addEventListener('pointerleave', leave)

      return () => {
        root.removeEventListener('pointerenter', enter)
        root.removeEventListener('pointermove', move)
        root.removeEventListener('pointerleave', leave)
      }
    },
    { scope: rootRef },
  )

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      {children}

      {/* `-translate-*` centra el isotipo en la punta del cursor; GSAP escribe
          `x`/`y`, que son propiedades distintas del mismo transform y no se
          pisan con la traslación en porcentaje.

          `pointer-events-none` es obligatorio: si el isotipo recibiera el
          puntero, se dispararía un `pointerleave` en el contenedor cada vez
          que pasara por debajo del cursor y el efecto parpadearía. */}
      <span
        ref={markRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 opacity-0"
      >
        <BrandMark shape={shape} color={color} className={cn('size-cell-half', markClassName)} />
      </span>
    </div>
  )
}
