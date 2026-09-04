/**
 * Carga de fuentes de marca (DESIGN_SYSTEM.md §3).
 *
 * Hoy las variables `--font-display` / `--font-body` se definen en globals.css
 * con un fallback de sistema, porque todavía no tenemos los archivos:
 *
 *   - Futuru (display): pendiente confirmar licencia y hosting propio.
 *   - General Sans (cuerpo): Fontshare, licencia gratuita, self-hostable.
 *
 * Cuando lleguen los archivos a public/fonts/, se activa aquí con `next/font/local`
 * (que redefine esas mismas variables, así que ningún componente cambia).
 * El paso a paso está en docs/FONTS.md.
 *
 * `fontVariables` ya está enganchado en app/layout.tsx: activar las fuentes es
 * editar sólo este archivo.
 */

export const fontVariables = ''

/* --- Activación (descomentar cuando existan los archivos) -------------------

import localFont from 'next/font/local'

const futuru = localFont({
  src: [
    { path: '../public/fonts/Futuru-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../public/fonts/Futuru-Black.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-display',
  display: 'swap',
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
})

const generalSans = localFont({
  src: [
    { path: '../public/fonts/GeneralSans-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/GeneralSans-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../public/fonts/GeneralSans-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-body',
  display: 'swap',
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
})

export const fontVariables = `${futuru.variable} ${generalSans.variable}`

---------------------------------------------------------------------------- */
