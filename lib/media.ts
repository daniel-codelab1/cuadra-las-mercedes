/**
 * Los assets de marca y los placeholders del Figma son SVG. El optimizador de
 * imágenes de Next no aporta nada sobre un SVG y por defecto lo bloquea, así
 * que estas se sirven tal cual.
 *
 * Cuando lleguen las fotos reales (JPG/WebP) esto devuelve false solo y pasan
 * por el optimizador sin tocar nada.
 */
export function isVector(url: string) {
  return url.toLowerCase().endsWith('.svg')
}
