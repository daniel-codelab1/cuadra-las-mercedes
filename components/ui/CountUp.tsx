'use client'

import { useCountUp } from '@/lib/animation'

export type CountUpProps = {
  /** Valor final. */
  to: number
  from?: number
  duration?: number
  prefix?: string
  suffix?: string
  /** Decimales a mostrar durante y al final de la animación (ej. 1 para "+1.5M"). */
  decimals?: number
  /**
   * Etiqueta BCP-47 con la que se formatea el número.
   *
   * La fila de cifras pasa `en-US` en los dos idiomas: el Figma escribe las
   * abreviaturas al estilo anglosajón (`+1.5M`, `+40K`) y eso es parte de cómo
   * la marca escribe sus cifras, no del idioma de la página.
   */
  locale?: string
  /**
   * `start` de ScrollTrigger. Por defecto la cifra se anima cuando ella misma
   * entra en viewport; una sección con coreografía propia puede adelantarlo
   * para que el contador arranque a la vez que el resto de su entrada.
   */
  start?: string
}

/**
 * Contador animado para las cifras de `StatCard`.
 *
 * El valor final se renderiza en el HTML del servidor, así que sin JS —o con
 * `prefers-reduced-motion`— la cifra correcta se ve igual; la animación sólo la
 * sustituye frame a frame cuando entra en viewport.
 */
export function CountUp({
  to,
  from = 0,
  duration,
  prefix = '',
  suffix = '',
  decimals = 0,
  locale = 'es-VE',
  start,
}: CountUpProps) {
  const format = (value: number) =>
    `${prefix}${value.toLocaleString(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`

  const ref = useCountUp<HTMLSpanElement>(to, { from, duration, format, start })

  return (
    <span ref={ref} suppressHydrationWarning>
      {format(to)}
    </span>
  )
}
