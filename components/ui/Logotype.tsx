import Image from 'next/image'

import { cn } from '@/lib/cn'
import { isVector } from '@/lib/media'

/**
 * Assets reales del logotipo. Cada variante trae sus medidas intrínsecas
 * porque no comparten proporción exacta.
 *
 * Sobre la variante oscura: el manual entrega dos archivos con el logo en
 * blanco, `logo-cuadra-las-mercedes-1.png` y `cuadra-las-mercedes-negativo.png`.
 * El primero **no tiene transparencia**: es un rectángulo opaco `#171717`, que
 * sobre nuestra superficie oscura (`#000000`) deja una caja gris visible. Se usa
 * el negativo, que es el mismo logo con canal alfa. Si en algún momento se
 * quiere el otro, es cambiar el `src` de aquí abajo y nada más.
 */
const LOGOTYPE = {
  black: { src: '/brand/logo-clm-pos.png', width: 462, height: 174 },
  white: { src: '/brand/logo-clm-neg.png', width: 462, height: 174 },
} as const

type Variant = keyof typeof LOGOTYPE

export type LogotypeProps = {
  /**
   * `black` para fondos claros, `white` para oscuros, `auto` para que siga el
   * tema activo. Usa `auto` sobre cualquier superficie themeable; fija la
   * variante sólo donde el fondo no cambia (el footer es negro siempre).
   */
  variant?: Variant | 'auto'
  /** Alto en px; el ancho se deriva de la proporción del lockup. */
  height?: number
  className?: string
  priority?: boolean
}

export function Logotype({
  variant = 'auto',
  height = 48,
  className,
  priority = false,
}: LogotypeProps) {
  if (variant === 'auto') {
    // Se pintan las dos variantes y CSS elige: next-themes escribe la clase de
    // tema en <html> antes de hidratar, así que no hay parpadeo ni desajuste.
    // Un logo no puede resolverse con un filtro CSS (DESIGN_SYSTEM.md §6): son
    // dos assets distintos.
    return (
      <>
        <Mark variant="black" height={height} priority={priority} className={cn('dark:hidden', className)} />
        <Mark variant="white" height={height} priority={priority} className={cn('hidden dark:block', className)} />
      </>
    )
  }

  return <Mark variant={variant} height={height} priority={priority} className={className} />
}

function Mark({
  variant,
  height,
  className,
  priority,
}: {
  variant: Variant
  height: number
  className?: string
  priority: boolean
}) {
  const { src, width: intrinsicWidth, height: intrinsicHeight } = LOGOTYPE[variant]

  return (
    <Image
      src={src}
      alt="Cuadra Las Mercedes"
      width={Math.round(height * (intrinsicWidth / intrinsicHeight))}
      height={height}
      priority={priority}
      unoptimized={isVector(src)}
      className={cn('w-auto', className)}
      style={{ height }}
    />
  )
}
