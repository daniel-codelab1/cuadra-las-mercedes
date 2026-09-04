import { ACCENT_BG, type Accent } from '@/lib/accents'
import { cn } from '@/lib/cn'

export type StatCardProps = {
  /** Cifra ya formateada, o un `<CountUp>` para animarla al entrar en viewport. */
  value: React.ReactNode
  label: string
  description?: string
  /**
   * Color del tramo sólido del divisor. La fila de stats es la única excepción
   * documentada a la regla de un solo acento por sección: cada tarjeta lleva el
   * suyo (§2).
   */
  accent: Accent
  /**
   * Marca las partes de la tarjeta para que las anime la sección que la
   * contiene: el texto con `data-reveal` (`useScrollReveal`) y los dos tramos
   * del divisor con `data-draw` (`useDrawLine`).
   *
   * Va apagado por defecto **a propósito**: las clases `*-init` dejan el
   * contenido invisible hasta que GSAP lo anima, así que una tarjeta suelta
   * —la del kit, por ejemplo— no debe llevarlas o no se vería nunca.
   */
  animated?: boolean
  className?: string
}

/**
 * Tarjeta de cifra destacada (DESIGN_SYSTEM.md §4). Componente de servidor.
 *
 * El divisor son dos tramos y no una sola línea: un trozo sólido del color de
 * acento y, a continuación, el punteado neutro hasta el final de la tarjeta.
 * Es lo que permite dibujarlo por partes al hacer scroll.
 */
export function StatCard({
  value,
  label,
  description,
  accent,
  animated = false,
  className,
}: StatCardProps) {
  const reveal = animated ? 'reveal-init' : undefined
  const revealProps = animated ? { 'data-reveal': '' } : undefined
  const drawProps = animated ? { 'data-draw': '' } : undefined
  const draw = animated ? 'draw-init' : undefined

  return (
    <article className={cn('flex flex-col', className)}>
      <p {...revealProps} className={cn('font-display text-6xl lg:text-6xl font-bold text-foreground', reveal)}>
        {value}
      </p>

      <div className="my-5 flex items-center" aria-hidden="true">
        <span {...drawProps} className={cn('h-0.5 w-1/3', ACCENT_BG[accent], draw)} />
        <span
          {...drawProps}
          className={cn('h-0 flex-1 border-t-2 border-dashed border-gray-400', draw)}
        />
      </div>

      <h3 {...revealProps} className={cn('text-lg lg:text-xl font-bold text-foreground', reveal)}>
        {label}
      </h3>
      {description ? (
        <p {...revealProps} className={cn('mt-2 text-sm lg:text-body text-foreground-muted', reveal)}>
          {description}
        </p>
      ) : null}
    </article>
  )
}
