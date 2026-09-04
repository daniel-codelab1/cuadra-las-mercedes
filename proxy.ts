import createMiddleware from 'next-intl/middleware'

import { routing } from './i18n/routing'

/**
 * Resuelve el idioma de cada petición y reescribe hacia el segmento `[locale]`.
 *
 * En Next 16 este archivo se llama `proxy.ts`; era `middleware.ts` hasta la 15.
 */
export default createMiddleware(routing)

export const config = {
  // Todo salvo rutas de API, internos de Next/Vercel y archivos con extensión
  // (imágenes, fuentes, favicon…), que deben servirse tal cual y no acabar
  // reescritos a /es/media/...
  //
  // El punto se escribe `[.]` y no `\.` a propósito: es equivalente y no
  // depende de cómo sobreviva la barra invertida al pasar por el fuente.
  matcher: '/((?!api|_next|_vercel|.*[.].*).*)',
}
