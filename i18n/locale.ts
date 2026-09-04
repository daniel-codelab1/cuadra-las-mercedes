import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'

import { routing, type Locale } from './routing'

/**
 * Valida el segmento `[locale]` y lo estrecha al tipo `Locale`.
 *
 * Hace falta en **cada** layout y página del segmento, no sólo en el layout
 * raíz: Next renderiza layouts y páginas en paralelo, así que un `notFound()`
 * en el layout raíz no impide que los de abajo se ejecuten antes. Sin esto,
 * una ruta como `/loquesea` llega a `getHero('loquesea')`, que devuelve
 * `undefined`, y la página revienta en vez de dar un 404 limpio.
 *
 * Nunca sustituir por un `as Locale`: el cast calla al compilador pero no
 * cambia el valor en tiempo de ejecución.
 */
export function assertLocale(value: string): Locale {
  if (!hasLocale(routing.locales, value)) notFound()
  return value
}
