import type { Locale } from '@/i18n/routing'
import type { Accent } from '@/lib/accents'

import type { Localized, Media, MediaSlide, RichText } from '../types'

/**
 * Una celda: o un medio que la cubre entera, o un bloque de color.
 *
 * El bloque de color admite título y párrafos, y puede ir sin ellos: en el
 * diseño las columnas de color a toda altura llevan texto y las celdas de un
 * tercio están de momento vacías. **PENDIENTE**: definir qué va dentro de esas.
 */
export type SkyparkCell =
  | { kind: 'media'; media: MediaSlide }
  | { kind: 'panel'; accent: Accent; title?: string; body?: RichText }

/**
 * Una columna dentro de un estado.
 *
 * `cells` con un elemento es una columna a toda altura; con tres, la columna
 * partida en tres filas iguales. Es la misma forma para los dos casos a
 * propósito: así una columna puede pasar de entera a partida entre un estado y
 * el siguiente sin que el componente tenga que distinguirlos.
 */
export type SkyparkColumn = { cells: SkyparkCell[] }

/** Los tres columnas de un estado, de izquierda a derecha. */
export type SkyparkColumnsState = [SkyparkColumn, SkyparkColumn, SkyparkColumn]

export type SkyparkColumnsContent = {
  /**
   * Los estados por los que pasa la sección, en orden. El ascensor de cada
   * columna se mueve un piso por cada salto.
   */
  states: SkyparkColumnsState[]
}

const RENDER: Media = {
  url: '/skypark/bulevar-tolon-render-4.jpg',
  width: 1280,
  height: 960,
  alt: '',
}

const CRUCE: Media = {
  url: '/skypark/skypark-cruce-tolon.jpg',
  width: 1600,
  height: 900,
  alt: '',
}

/**
 * Los medios se declaran como `MediaSlide`, el tipo polimórfico imagen|vídeo
 * que ya usan el hero y `bulevar`. Cambiar cualquiera de estas celdas por un
 * vídeo es cambiar el objeto aquí; ni la sección ni el componente se enteran.
 */
const media = (image: Media, alt: string): SkyparkCell => ({
  kind: 'media',
  media: { type: 'image', image: { ...image, alt } },
})

const panel = (
  accent: Accent,
  copy?: { title: string; body: RichText },
): SkyparkCell => ({ kind: 'panel', accent, ...copy })

/**
 * Torre Skypark — versión en tres columnas.
 *
 * Cada estado describe la pantalla completa. La regla de la composición:
 *
 *   columnas 1 y 2   se intercambian el medio y el texto de un estado al otro
 *   columna 3        siempre en tres filas; lo que cambia es en cuál va el medio
 *
 * Esa regla vive aquí y no en el componente, que sólo sabe cerrar un estado y
 * abrir el siguiente. Romperla —dos medios seguidos, una columna partida en la
 * 1— es editar este archivo y funciona igual.
 *
 * Los textos salen de los mismos pisos que la sección `skypark`. Se copian en
 * vez de importarse porque aquí cada celda es editable por separado: al montar
 * Payload esto es una colección de estados con sus celdas, no un espejo de la
 * otra sección.
 */
const skyparkColumns: Localized<SkyparkColumnsContent> = {
  es: {
    states: [
      [
        { cells: [media(RENDER, 'Render del Bulevar Tolón junto a la Torre Skypark')] },
        {
          cells: [
            panel('teal-dark', {
              title: 'La nueva Torre Skypark es un símbolo del avance de Las Mercedes',
              body: [
                {
                  text:
                    'Esta torre combina de forma innovadora espacios para el comercio y ' +
                    'la vivienda, y su diseño incluye un elemento clave para la ' +
                    'movilidad: una conexión peatonal elevada con el ',
                },
                { text: 'Centro Comercial Tolón', bold: true },
                { text: '.' },
              ],
            }),
          ],
        },
        {
          cells: [
            panel('orange'),
            media(CRUCE, 'Conexión peatonal elevada entre la Torre Skypark y el Tolón'),
            panel('olive'),
          ],
        },
      ],
      [
        {
          cells: [
            panel('orange', {
              title: 'El Bulevar Tolón articula el nuevo eje peatonal de la zona',
              body: [
                {
                  text:
                    'Un recorrido continuo que conecta comercio, oficinas y vivienda, ' +
                    'pensado para caminarse. El bulevar es el ',
                },
                { text: 'epicentro del proyecto', bold: true },
                { text: ' y ordena todo lo que crece a su alrededor.' },
              ],
            }),
          ],
        },
        { cells: [media(RENDER, 'Render del Bulevar Tolón junto a la Torre Skypark')] },
        {
          cells: [
            media(CRUCE, 'Conexión peatonal elevada entre la Torre Skypark y el Tolón'),
            panel('teal-dark'),
            panel('olive'),
          ],
        },
      ],
      [
        { cells: [media(RENDER, 'Render del Bulevar Tolón junto a la Torre Skypark')] },
        {
          cells: [
            panel('steel-blue', {
              title: 'Torre Nest suma oficinas y comercio al corazón de Las Mercedes',
              body: [
                { text: 'Veinte pisos de ' },
                { text: 'oficinas y comercios', bold: true },
                {
                  text:
                    ' en uso, con acceso directo al eje peatonal y a la red de servicios ' +
                    'que ya funciona en la zona.',
                },
              ],
            }),
          ],
        },
        {
          cells: [
            panel('teal-dark'),
            panel('orange'),
            media(CRUCE, 'Conexión peatonal elevada entre la Torre Skypark y el Tolón'),
          ],
        },
      ],
    ],
  },

  en: {
    states: [
      [
        { cells: [media(RENDER, 'Render of Bulevar Tolón next to Torre Skypark')] },
        {
          cells: [
            panel('teal-dark', {
              title: 'The new Torre Skypark is a symbol of the progress of Las Mercedes',
              body: [
                {
                  text:
                    'This tower brings together retail and housing in an innovative way, ' +
                    'and its design includes a key element for mobility: an elevated ' +
                    'pedestrian link to the ',
                },
                { text: 'Tolon Shopping Centre', bold: true },
                { text: '.' },
              ],
            }),
          ],
        },
        {
          cells: [
            panel('orange'),
            media(CRUCE, 'Elevated pedestrian bridge between Torre Skypark and the Tolón'),
            panel('olive'),
          ],
        },
      ],
      [
        {
          cells: [
            panel('orange', {
              title: 'Bulevar Tolón shapes the new pedestrian axis of the area',
              body: [
                {
                  text:
                    'A continuous route connecting retail, offices and housing, designed ' +
                    'to be walked. The boulevard is the ',
                },
                { text: 'epicentre of the project', bold: true },
                { text: ' and orders everything growing around it.' },
              ],
            }),
          ],
        },
        { cells: [media(RENDER, 'Render of Bulevar Tolón next to Torre Skypark')] },
        {
          cells: [
            media(CRUCE, 'Elevated pedestrian bridge between Torre Skypark and the Tolón'),
            panel('teal-dark'),
            panel('olive'),
          ],
        },
      ],
      [
        { cells: [media(RENDER, 'Render of Bulevar Tolón next to Torre Skypark')] },
        {
          cells: [
            panel('steel-blue', {
              title: 'Torre Nest adds offices and retail to the heart of Las Mercedes',
              body: [
                { text: 'Twenty floors of ' },
                { text: 'offices and retail', bold: true },
                {
                  text:
                    ' in use, with direct access to the pedestrian axis and to the ' +
                    'network of services already running in the area.',
                },
              ],
            }),
          ],
        },
        {
          cells: [
            panel('teal-dark'),
            panel('orange'),
            media(CRUCE, 'Elevated pedestrian bridge between Torre Skypark and the Tolón'),
          ],
        },
      ],
    ],
  },
}

export function getSkyparkColumns(locale: Locale): SkyparkColumnsContent {
  return skyparkColumns[locale]
}
