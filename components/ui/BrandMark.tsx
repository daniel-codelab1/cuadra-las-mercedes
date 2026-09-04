import Image from 'next/image'

import { ACCENT_BG, type Accent } from '@/lib/accents'
import { cn } from '@/lib/cn'

/**
 * Máscaras del isotipo: bloques blancos sobre fondo transparente. El color del
 * icono lo pone el contenedor y se ve por donde la máscara es transparente, así
 * que un solo asset sirve para cualquier acento (DESIGN_SYSTEM.md §7).
 *
 * Son el mismo patrón en dos orientaciones, y por eso tienen proporciones
 * inversas: `E` es vertical y `M` horizontal.
 */
export const BRANDMARK_SHAPES = {
  E: { src: '/brand/iconografia-clm-E.png', width: 59, height: 72 },
  M: { src: '/brand/iconografia-clm-M.png', width: 72, height: 59 },
} as const

export type BrandMarkShape = keyof typeof BRANDMARK_SHAPES

/**
 * Lado del isotipo cuando ocupa una celda de la grilla guía: 1440 / 20 = 72px.
 *
 * Es una constante y no `var(--cell)` porque el cubo necesita el valor en px
 * para calcular su `translateZ`. Las secciones que muestran el isotipo usan
 * ésta para que todas coincidan.
 */
export const BRANDMARK_CELL_SIZE = 72

export type BrandMarkProps = {
  /** Color "dueño" de la sección donde aparece el isotipo. */
  color?: Accent
  /** Orientación del patrón. */
  shape?: BrandMarkShape
  /** Lado del cuadrado en px. Omítelo para dimensionarlo con clases (`size-*`, `w-cell`…). */
  size?: number
  className?: string
}

/**
 * Isotipo de bloques recolorable (DESIGN_SYSTEM.md §7).
 *
 * No existe un PNG por color: hay un contenedor con el color de marca y encima
 * la máscara. Cambiar de color es cambiar `color`, nunca generar un asset.
 *
 * La máscara va en `object-contain` y no `cover`: las dos formas tienen
 * proporción no cuadrada, y recortarlas dentro de una caja cuadrada partiría
 * bloques del patrón por la mitad.
 */
export function BrandMark({
  color = 'teal-dark',
  shape = 'E',
  size,
  className,
}: BrandMarkProps) {
  const mask = BRANDMARK_SHAPES[shape]

  return (
    <span
      className={cn('relative block size-16 shrink-0 overflow-hidden', ACCENT_BG[color], className)}
      style={size ? { width: size, height: size } : undefined}
      role="presentation"
    >
      <Image
        src={mask.src}
        alt=""
        fill
        sizes={size ? `${size}px` : '128px'}
        className="object-contain object-left-top"
      />
    </span>
  )
}
