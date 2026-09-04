import { Link } from '@/i18n/navigation'
import type { ComponentPropsWithoutRef, CSSProperties } from 'react'

import { ACCENT_BG, ACCENT_BG_DARK, ACCENT_BG_GROUP_HOVER_DARK, type Accent } from '@/lib/accents'
import { cn } from '@/lib/cn'

import { Arrow } from './Arrow'

type BaseProps = {
  children: React.ReactNode
  /**
   * Color de acento. `orange` es el CTA principal del sitio; el resto son los
   * botones secundarios que toman el color "dueño" de cada sección
   * (DESIGN_SYSTEM.md §4).
   */
  accent?: Accent
  /** Caja cuadrada con flecha pegada al botón. Actívala salvo que el Figma no la muestre. */
  withArrow?: boolean
  /**
   * Alto del botón en px. Define también el lado del cubo de la flecha, para
   * que el giro 3D tenga la profundidad correcta.
   */
  height?: number
  className?: string
}

type ButtonAsLink = BaseProps & { href: string } & Omit<
    ComponentPropsWithoutRef<typeof Link>,
    'href' | 'className' | 'children' | 'style'
  >

type ButtonAsButton = BaseProps & { href?: undefined } & Omit<
    ComponentPropsWithoutRef<'button'>,
    'className' | 'children' | 'style'
  >

export type ButtonProps = ButtonAsLink | ButtonAsButton

const SHELL = 'group inline-flex h-[var(--btn-h)] select-none items-stretch gap-0.5 align-middle'
const LABEL =
  'flex items-center px-5 text-sm font-semibold normal-case leading-none tracking-wide text-white transition-colors duration-300'
const CUBE = 'cube cube-hover relative aspect-square h-full shrink-0'

/**
 * Botón de marca: bloque de color con la etiqueta + bloque cuadrado adyacente
 * con la flecha, separados por un hilo por el que se ve el fondo de la página.
 *
 * Hover: la etiqueta cambia a la variante "dark" del acento y el cuadrado de la
 * flecha gira sobre su eje Y descubriendo una segunda cara del mismo color
 * nuevo — la impresión es la de un cubo girando, no la de una tarjeta. La
 * mecánica 3D está en `.cube*` (app/globals.css), incluida su degradación con
 * `prefers-reduced-motion`.
 *
 * Es un único elemento interactivo (los bloques son `<span>`), de modo que
 * lectores de pantalla y navegación por teclado lo tratan como un solo control.
 */
export function Button({
  children,
  accent = 'orange',
  withArrow = true,
  height = 44,
  className,
  ...props
}: ButtonProps) {
  const base = ACCENT_BG[accent]
  const hover = ACCENT_BG_GROUP_HOVER_DARK[accent]
  const dark = ACCENT_BG_DARK[accent]

  const style = {
    '--btn-h': `${height}px`,
    '--cube': `${height}px`,
  } as CSSProperties

  const content = (
    <>
      <span className={cn(LABEL, base, hover)}>{children}</span>
      {withArrow ? (
        <span className={CUBE}>
          <span className="cube-inner">
            <span className={cn('cube-face cube-face-front transition-colors duration-300', base, hover)}>
              <Arrow direction="right" className="size-4 text-white" />
            </span>
            <span className={cn('cube-face cube-face-side', dark)}>
              <Arrow direction="right" className="size-4 text-white" />
            </span>
          </span>
        </span>
      ) : null}
    </>
  )

  if (props.href !== undefined) {
    const { href, ...rest } = props as ButtonAsLink
    return (
      <Link href={href} style={style} className={cn(SHELL, className)} {...rest}>
        {content}
      </Link>
    )
  }

  const { type = 'button', ...rest } = props as ButtonAsButton
  return (
    <button type={type} style={style} className={cn(SHELL, className)} {...rest}>
      {content}
    </button>
  )
}
