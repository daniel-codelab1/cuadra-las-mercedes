import type { Locale } from '@/i18n/routing'

import type { Localized } from './types'

export type SiteContent = {
  name: string
  footerDescription: string
}

/** Contenido global del sitio. Pasa a ser un global `site` de Payload. */
const site: Localized<SiteContent> = {
  es: {
    name: 'Cuadra Las Mercedes',
    footerDescription:
      'Cuadra Las Mercedes es el proyecto de renovación urbana y comercial de Las Mercedes, ' +
      'Municipio Baruta, Caracas, Venezuela.',
  },
  en: {
    name: 'Cuadra Las Mercedes',
    footerDescription:
      'Cuadra Las Mercedes is the urban and commercial renewal project of Las Mercedes, ' +
      'Baruta Municipality, Caracas, Venezuela.',
  },
}

export function getSite(locale: Locale): SiteContent {
  return site[locale]
}
