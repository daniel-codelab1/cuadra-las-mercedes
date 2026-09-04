/**
 * Formas del contenido editable.
 *
 * Mientras Payload no esté montado, cada sección exporta sus datos desde un
 * módulo en `content/sections/` tipado con estas formas. Cuando montemos
 * Payload, estas mismas formas son las colecciones/globals — el objetivo es que
 * los componentes de sección no cambien al hacer el swap.
 *
 * **Contenido vs. interfaz.** Aquí vive lo que un editor cambiaría desde el
 * CMS (titulares, párrafos, cifras, imágenes). Las cadenas de interfaz
 * —etiquetas ARIA, "Abrir menú", el copyright— viven en `messages/*.json` y se
 * leen con next-intl. No mezclar: lo de aquí acabará en campos localizados de
 * Payload, lo de allí no.
 */

import type { Locale } from '@/i18n/routing'

/**
 * Un contenido en sus dos idiomas. Es el equivalente local a un campo
 * `localized: true` de Payload: al migrar, `getX(locale)` pasa de leer este
 * record a pedirle a Payload el documento en ese `locale`.
 */
export type Localized<T> = Record<Locale, T>

/** Imagen resuelta (lo que Payload devuelve para un campo `upload`). */
export type Media = {
  url: string
  alt: string
  width: number
  height: number
}

/** Enlace de acción reutilizable en botones y navegación. */
export type CtaLink = {
  label: string
  href: string
}

/**
 * Texto con tramos en negrita, como los párrafos del hero.
 *
 * Se modela como segmentos y no como HTML para no acabar con
 * `dangerouslySetInnerHTML`: el rich text de Payload se aplana a esta forma en
 * el borde, y el componente `<RichText>` la pinta.
 */
export type RichTextSegment = {
  text: string
  bold?: boolean
}

export type RichText = RichTextSegment[]

/**
 * Una diapositiva del `MediaCarousel`. La columna de medios del hero admite
 * tanto foto como vídeo, y el carrusel decide cómo avanzar según el tipo.
 */
export type MediaSlide =
  | { type: 'image'; image: Media }
  | { type: 'video'; src: string; alt: string; poster?: Media }

/**
 * Logo de aliado. Son DOS assets, no uno con filtro CSS: varios logos usan una
 * versión monocromática blanca en tema oscuro que no es el mismo archivo
 * invertido (DESIGN_SYSTEM.md §6). Si un logo funciona sobre ambos fondos,
 * repite el mismo `Media` en las dos variantes.
 */
export type Partner = {
  name: string
  /**
   * Obligatorio a propósito: todo logo del carrusel de aliados es un enlace.
   * Dejarlo opcional acabaría con logos sueltos sin destino.
   */
  href: string
  logoLight: Media
  logoDark: Media
  /**
   * Ajuste óptico dentro de la caja del carrusel: 1 es el tamaño por defecto.
   * Dos logos con la misma caja no se ven del mismo tamaño —uno apaisado la
   * llena de ancho y uno cuadrado sólo de alto—, así que cada asset trae aquí
   * cuánto hay que corregirlo. Al migrar a Payload es un campo numérico junto a
   * las dos imágenes.
   */
  scale?: number
}

/** Cifra de la fila de stats. `accent` es el color del divisor punteado. */
export type Stat = {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  label: string
  description?: string
}
