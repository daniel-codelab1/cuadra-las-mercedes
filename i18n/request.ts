import * as rootParams from 'next/root-params'
import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'

import { routing } from './routing'

/**
 * Configuración por petición: resuelve el idioma y carga su catálogo de
 * mensajes de interfaz.
 *
 * El idioma puede llegar por dos vías: explícito, cuando algo llama a
 * `getTranslations({ locale })` (lo hace `generateMetadata`), o implícito desde
 * el segmento `[locale]` de la URL. Hay que contemplar las dos, y validar
 * siempre: `[locale]` actúa como catch-all y puede traer basura (`/unknown.txt`).
 *
 * `timeZone` es fija a propósito: sin ella las fechas se formatearían con la
 * zona del servidor y no coincidirían con las del cliente al hidratar.
 */
export default getRequestConfig(async ({ locale }) => {
  const candidate = locale ?? (await rootParams.locale())
  const resolved = hasLocale(routing.locales, candidate) ? candidate : routing.defaultLocale

  return {
    locale: resolved,
    timeZone: 'America/Caracas',
    messages: (await import(`../messages/${resolved}.json`)).default,
  }
})
