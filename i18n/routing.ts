import { defineRouting } from 'next-intl/routing'

/**
 * Configuración de idiomas del sitio.
 *
 * `localePrefix: 'as-needed'` deja el español sin prefijo (`/`, `/historia`) y
 * el inglés bajo `/en`. Es lo que conserva las URLs del sitio actual en
 * cuadralasmercedes.com y evita tener que montar 301 desde las viejas.
 * Cambiar a `'always'` es un solo valor aquí, pero implica redirigir todo.
 */
export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'as-needed',
})

export type Locale = (typeof routing.locales)[number]

/** Etiqueta del idioma en su propio idioma, para el selector. */
export const LOCALE_LABELS: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
}

/**
 * Bandera que representa a cada idioma en el selector. El sitio es venezolano,
 * de ahí que el español use la bandera de Venezuela y no la de España.
 */
export const LOCALE_FLAGS: Record<Locale, 'VE' | 'GB'> = {
  es: 'VE',
  en: 'GB',
}
