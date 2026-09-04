import type { Locale } from '@/i18n/routing'

import type { CtaLink, Localized } from '../types'

export type NavigationContent = {
  links: CtaLink[]
  cta: CtaLink
}

/**
 * Barra de navegación. Pasa a ser un global `navigation` de Payload
 * (array de enlaces + grupo de CTA).
 *
 * Los `href` son iguales en ambos idiomas: son anclas dentro de la home. Si en
 * el futuro hay rutas propias por idioma (`/historia` vs `/history`), eso se
 * resuelve con `pathnames` en `i18n/routing.ts`, no duplicando href aquí.
 *
 * **Historia / Story** falta a propósito: su sección está desmontada de la home
 * (ver `app/[locale]/(site)/page.tsx`) y un enlace de barra que no lleva a
 * ninguna parte es peor que no tenerlo. Vuelve en cuanto vuelva la sección.
 */
const navigation: Localized<NavigationContent> = {
  es: {
    links: [
      { label: 'Novedades', href: '#novedades' },
      { label: 'Mapa', href: '#mapa' },
      { label: 'Directorio', href: '#directorio' },
      { label: 'Cifras', href: '#cifras' },
    ],
    cta: { label: 'Súmate', href: '#sumate' },
  },
  en: {
    links: [
      { label: 'News', href: '#novedades' },
      { label: 'Map', href: '#mapa' },
      { label: 'Directory', href: '#directorio' },
      { label: 'Figures', href: '#cifras' },
    ],
    cta: { label: 'Join us', href: '#sumate' },
  },
}

export function getNavigation(locale: Locale): NavigationContent {
  return navigation[locale]
}
