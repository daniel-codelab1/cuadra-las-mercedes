'use client'

import { useTranslations } from 'next-intl'

import { ACCENT_BG, ACCENT_BG_HOVER, type Accent } from '@/lib/accents'
import { cn } from '@/lib/cn'

import { Arrow } from './Arrow'

export type ScrollNavProps = {
  onPrev: () => void
  onNext: () => void
  /** Desactiva la flecha correspondiente cuando ya no hay a dónde ir. */
  prevDisabled?: boolean
  nextDisabled?: boolean
  accent?: Accent
  /**
   * Lado del botón: `md` es el tamaño por defecto (56px) y `sm` el de media
   * celda de la grilla, que es el del Figma cuando las flechas acompañan a un
   * bloque de texto (sección Skypark).
   */
  size?: ScrollNavSize
  /**
   * Eje del par de botones. `vertical` apila ↑/↓ —el caso del Figma cuando las
   * flechas acompañan a un bloque de texto—; `horizontal` pone ←/→ en fila,
   * para recorrer un carril de tarjetas.
   */
  orientation?: ScrollNavOrientation
  className?: string
  /** Sobrescriben las etiquetas ARIA, que por defecto salen del catálogo de mensajes. */
  labelPrev?: string
  labelNext?: string
}

export type ScrollNavSize = 'sm' | 'md'
export type ScrollNavOrientation = 'vertical' | 'horizontal'

/**
 * Qué flecha lleva cada botón según el eje. El par siempre es «atrás» y
 * «adelante»; lo que cambia es hacia dónde apunta.
 */
const ARROWS = {
  vertical: { prev: 'up', next: 'down' },
  horizontal: { prev: 'left', next: 'right' },
} as const

const BUTTON =
  'grid place-items-center text-white transition-colors disabled:cursor-default disabled:opacity-40'

const SIZES: Record<ScrollNavSize, { button: string; arrow: string }> = {
  // `sm` se mide en celdas de la grilla guía: acompaña a un bloque de texto y
  // tiene que encoger con la composición que lo rodea. `cell-mark-half` y no
  // `cell-half`: sin piso, en un teléfono da ~10px de botón — imposible de
  // tocar (globals.css, `--cell-mark`).
  sm: { button: 'size-cell-mark-half', arrow: 'size-4' },
  md: { button: 'size-14', arrow: 'size-5' },
}

/**
 * Par de botones cuadrados para navegar manualmente entre bloques de una
 * sección (DESIGN_SYSTEM.md §4): apilados ↑/↓ por defecto, o en fila ←/→ con
 * `orientation="horizontal"`. Combínalo con ScrollTrigger o con la posición de
 * un carril para activarlo y desactivarlo.
 */
export function ScrollNav({
  onPrev,
  onNext,
  prevDisabled = false,
  nextDisabled = false,
  accent = 'coral',
  size = 'md',
  orientation = 'vertical',
  className,
  labelPrev,
  labelNext,
}: ScrollNavProps) {
  const t = useTranslations('ScrollNav')
  const { button, arrow } = SIZES[size]
  const surface = cn(BUTTON, button, ACCENT_BG[accent], ACCENT_BG_HOVER[accent])
  const arrows = ARROWS[orientation]

  return (
    // `gap-px` y no `gap-0`: el hilo que separa los dos botones deja ver el
    // fondo de página, que es lo que los lee como dos bloques y no como uno.
    <div className={cn('flex gap-px', orientation === 'vertical' && 'flex-col', className)}>
      <button
        type="button"
        onClick={onPrev}
        disabled={prevDisabled}
        aria-label={labelPrev ?? t('previous')}
        className={surface}
      >
        <Arrow direction={arrows.prev} className={arrow} />
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        aria-label={labelNext ?? t('next')}
        className={surface}
      >
        <Arrow direction={arrows.next} className={arrow} />
      </button>
    </div>
  )
}
