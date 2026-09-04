'use client'

import { useRef } from 'react'
import Image from 'next/image'

import { ACCENT_BG, type Accent } from '@/lib/accents'
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/animation'
import { cn } from '@/lib/cn'

import { BRANDMARK_SHAPES, type BrandMarkShape } from './BrandMark'

export type BrandMarkCubeFace = {
  shape: BrandMarkShape
  color: Accent
}

/**
 * Un cubo tiene cuatro caras alrededor del eje Y. Más allá de eso las
 * posiciones se repiten y las caras se solaparían, así que el componente no
 * admite más: si una sección llega a tener cinco pestañas, hay que replantear
 * la pieza, no añadir una quinta cara.
 */
export const BRANDMARK_CUBE_MAX_FACES = 4

export type BrandMarkCubeProps = {
  /**
   * Una cara por posición, en orden. La cara `n` se ve cuando `step` vale `n`,
   * y cada una lleva su propio color: el cambio de color al cambiar de pestaña
   * *es* el giro descubriendo otra cara, no un cambio de fondo.
   */
  faces: BrandMarkCubeFace[]
  /** Índice de la cara visible. */
  step: number
  /** Lado de la caja en px. */
  size: number
  className?: string
}

/**
 * Isotipo de marca montado como cubo giratorio.
 *
 * El giro lo lleva GSAP y no CSS (a diferencia del cubo de `Button`, que
 * responde a hover) porque aquí lo dispara el estado de React. Por eso el
 * contenedor usa `.cube` sin `.cube-hover`.
 */
export function BrandMarkCube({ faces, step, size, className }: BrandMarkCubeProps) {
  const root = useRef<HTMLSpanElement>(null)
  const inner = useRef<HTMLSpanElement>(null)

  const visible = faces.slice(0, BRANDMARK_CUBE_MAX_FACES)

  useGSAP(
    () => {
      const el = inner.current
      if (!el) return

      // La duración a 0 es la degradación con reduced-motion: salta a la cara
      // en vez de girar. (La variante por hover lo resuelve en CSS.)
      gsap.to(el, {
        rotateY: -90 * step,
        z: -size / 2,
        duration: prefersReducedMotion() ? 0 : 0.75,
        ease: 'power3.inOut',
        overwrite: 'auto',
      })
    },
    { scope: root, dependencies: [step, size] },
  )

  return (
    <span
      ref={root}
      className={cn('cube relative block shrink-0', className)}
      style={{ width: size, height: size, ['--cube' as string]: `${size}px` }}
      role="presentation"
    >
      {/* `transition-none`: el transform lo escribe GSAP frame a frame, una
          transición CSS encima lo haría pelear consigo mismo. */}
      <span ref={inner} className="cube-inner transition-none">
        {visible.map((face, index) => (
          <Face key={index} face={face} index={index} size={size} />
        ))}
      </span>
    </span>
  )
}

function Face({
  face,
  index,
  size,
}: {
  face: BrandMarkCubeFace
  index: number
  size: number
}) {
  const mask = BRANDMARK_SHAPES[face.shape]

  return (
    <span
      className={cn('cube-face', ACCENT_BG[face.color])}
      // Cada cara se coloca en su cuarto de vuelta y se empuja hacia fuera media
      // arista. Va en línea y no en clases CSS porque el número de caras es
      // variable.
      style={{ transform: `rotateY(${index * 90}deg) translateZ(calc(var(--cube) / 2))` }}
    >
      <Image
        src={mask.src}
        alt=""
        fill
        sizes={`${size}px`}
        // Anclada arriba a la izquierda, no centrada: el patrón tiene que
        // arrancar desde el extremo del bloque de color.
        className="object-contain object-left-top"
      />
    </span>
  )
}
