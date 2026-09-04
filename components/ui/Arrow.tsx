import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react'

import { cn } from '@/lib/cn'

export type ArrowDirection = 'right' | 'left' | 'up' | 'down'

const ICONS = {
  right: ArrowRight,
  left: ArrowLeft,
  up: ArrowUp,
  down: ArrowDown,
} as const

/**
 * Flecha del sistema, siempre dentro de una caja cuadrada de color sólido
 * (DESIGN_SYSTEM.md §7).
 *
 * Envuelve a Lucide en vez de usarla suelta en cada sitio: así el grosor y el
 * remate del trazo se deciden una sola vez. El remate es recto y no redondeado,
 * que es lo que pega con la estética de bloques de la marca.
 */
export function Arrow({
  direction = 'right',
  className,
}: {
  direction?: ArrowDirection
  className?: string
}) {
  const Icon = ICONS[direction]

  return (
    <Icon
      aria-hidden="true"
      focusable="false"
      strokeWidth={2}
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={cn('size-[1.125em]', className)}
    />
  )
}
