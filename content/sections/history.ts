import type { Locale } from '@/i18n/routing'
import type { Accent } from '@/lib/accents'

import type { CtaLink, Localized, Media, RichText } from '../types'

export type HistoryTab = {
  id: string
  label: string
  /**
   * Color del isotipo mientras esta pestaña está activa. Cada pestaña es una
   * cara del cubo, así que el cambio de color *es* el giro: no se repinta un
   * fondo, se descubre otra cara.
   *
   * PENDIENTE de confirmar contra el Figma: sólo se facilitaron las vistas de
   * Historia y Ubicación, y en ambas el isotipo se ve verde oscuro. Los de
   * Ubicación y Novedades son elección propia dentro de la paleta.
   */
  accent: Accent
  media: Media
  /** Columna izquierda del bloque de texto: uno o más párrafos. */
  columnLeft: RichText[]
  /** Columna derecha; debajo de ella va el CTA. */
  columnRight: RichText[]
  cta: CtaLink
}

export type HistoryContent = {
  /** Bajada fija bajo el isotipo: no cambia al cambiar de pestaña. */
  intro: string
  tabs: HistoryTab[]
}

/**
 * PENDIENTE: los párrafos son el lorem ipsum del Figma, no copy real. Hay que
 * sustituirlos antes de publicar — están marcados aquí y en el README.
 */
const LOREM_A =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ' +
  'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, ' +
  'quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

const LOREM_B =
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore ' +
  'eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, ' +
  'sunt in culpa qui officia deserunt mollit anim id est laborum.'

/** Placeholder mientras no llega el asset real de esa pestaña. */
const placeholder = (slug: string, alt: string): Media => ({
  url: `/media/${slug}.placeholder.svg`,
  alt,
  width: 1200,
  height: 450,
})

/**
 * Foto histórica de Las Mercedes. Es 4:3, más cuadrada que la banda ancha del
 * diseño: el recorte lo hace el contenedor con `object-cover`, no el archivo.
 */
const historiaMedia = (alt: string): Media => ({
  url: '/media/urb-las-mercedes.jpg',
  alt,
  width: 1015,
  height: 752,
})

/**
 * Historia / Ubicación / Novedades.
 *
 * Pasa a ser un global `history` de Payload con un array de pestañas: cada una
 * con su imagen, sus dos columnas de texto y su CTA. El orden del array es el
 * orden de las pestañas.
 */
const history: Localized<HistoryContent> = {
  es: {
    intro:
      'Las Mercedes nació en la década de 1940 sobre terrenos de una antigua hacienda de caña.',
    tabs: [
      {
        id: 'historia',
        label: 'Historia',
        accent: 'teal-dark',
        media: historiaMedia('Vista histórica de Las Mercedes en blanco y negro'),
        columnLeft: [[{ text: LOREM_A }], [{ text: LOREM_B }]],
        columnRight: [[{ text: LOREM_B }]],
        cta: { label: 'Conoce más', href: '#historia' },
      },
      {
        id: 'ubicacion',
        label: 'Ubicación',
        accent: 'steel-blue',
        media: placeholder('ubicacion', 'Mapa de Las Mercedes y su entorno en Caracas'),
        columnLeft: [[{ text: LOREM_A }], [{ text: LOREM_B }]],
        columnRight: [[{ text: LOREM_B }]],
        cta: { label: 'Conoce más', href: '#mapa' },
      },
      {
        id: 'novedades',
        label: 'Novedades',
        accent: 'coral',
        media: placeholder('novedades', 'Novedades del proyecto'),
        columnLeft: [[{ text: LOREM_A }], [{ text: LOREM_B }]],
        columnRight: [[{ text: LOREM_B }]],
        cta: { label: 'Conoce más', href: '#novedades' },
      },
    ],
  },

  en: {
    intro:
      'Las Mercedes was born in the 1940s on the grounds of a former sugar cane estate.',
    tabs: [
      {
        id: 'historia',
        label: 'Story',
        accent: 'teal-dark',
        media: historiaMedia('Historic black and white view of Las Mercedes'),
        columnLeft: [[{ text: LOREM_A }], [{ text: LOREM_B }]],
        columnRight: [[{ text: LOREM_B }]],
        cta: { label: 'Learn more', href: '#historia' },
      },
      {
        id: 'ubicacion',
        label: 'Location',
        accent: 'steel-blue',
        media: placeholder('ubicacion', 'Map of Las Mercedes and its surroundings in Caracas'),
        columnLeft: [[{ text: LOREM_A }], [{ text: LOREM_B }]],
        columnRight: [[{ text: LOREM_B }]],
        cta: { label: 'Learn more', href: '#mapa' },
      },
      {
        id: 'novedades',
        label: 'News',
        accent: 'coral',
        media: placeholder('novedades', 'Project news'),
        columnLeft: [[{ text: LOREM_A }], [{ text: LOREM_B }]],
        columnRight: [[{ text: LOREM_B }]],
        cta: { label: 'Learn more', href: '#novedades' },
      },
    ],
  },
}

export function getHistory(locale: Locale): HistoryContent {
  return history[locale]
}
