import type { Locale } from '@/i18n/routing'
import type { Accent } from '@/lib/accents'

import type { Localized, Media, RichText } from '../types'

/**
 * Un piso de la sección. Al avanzar cambian la imagen, el color del panel y el
 * texto que va encima de él.
 */
export type SkyparkSlide = {
  id: string
  /** Color del panel de fondo. Es lo único que transiciona sin ascensor. */
  accent: Accent
  /**
   * Única foto del piso. Ocupa el bloque grande del collage; las esquinas se
   * las recortan el rectángulo del color del panel (arriba, bajo el texto) y
   * la muesca blanca de abajo a la izquierda.
   */
  image: Media
  title: string
  body: RichText
}

export type SkyparkContent = {
  slides: SkyparkSlide[]
  /**
   * Párrafo de abajo a la izquierda. Es fijo: no entra en el ascensor.
   * PENDIENTE de confirmar — puede que en el Figma cambie con cada piso.
   */
  footnote: RichText
}

/**
 * Foto de un piso. `skypark` ya tiene el render definitivo; los otros dos
 * siguen con el placeholder hasta que lleguen sus imágenes.
 */
const PHOTOS: Record<string, { url: string; width: number; height: number }> = {
  skypark: { url: '/skypark/skypark-cruce-tolon.jpg', width: 1600, height: 900 },
  tolon: { url: '/skypark/bulevar-tolon-render-4.jpg', width: 1280, height: 960 },
}

const image = (slug: string, alt: string): Media => ({
  ...(PHOTOS[slug] ?? {
    url: `/skypark/${slug}.placeholder.svg`,
    width: 1200,
    height: 800,
  }),
  alt,
})

/**
 * Torre Skypark y hitos del proyecto. Pasa a ser una colección `milestones` de
 * Payload, ordenable, con el color de panel como campo de selección.
 */
const skypark: Localized<SkyparkContent> = {
  es: {
    slides: [
      {
        id: 'skypark',
        accent: 'teal-dark',
        image: image(
          'skypark',
          'Conexión peatonal elevada entre la Torre Skypark y el Centro Comercial Tolón',
        ),
        title: 'La Torre Skypark es un símbolo del avance de Las Mercedes, incorporando una conexión con el Tolón Fashion Mall',
        body: [
          {
            text:
              'Esta torre combina de forma innovadora espacios para el comercio y la ' +
              'vivienda, y su diseño incluye un elemento clave para la movilidad: una ' +
              'conexión peatonal elevada con el ',
          },
          { text: 'Centro Comercial Tolón', bold: true },
          { text: '.' },
        ],
      },
      {
        id: 'tolon',
        accent: 'olive',
        image: image(
          'tolon',
          'Render del Bulevar Tolón: peatones en el paseo empedrado, con terrazas ' +
            'bajo la pérgola de madera',
        ),
        title: 'El Bulevar Tolón articula el nuevo eje peatonal de la zona',
        body: [
          {
            text:
              'Un recorrido continuo que conecta comercio, oficinas y vivienda, pensado ' +
              'para caminarse. El bulevar es el ',
          },
          { text: 'epicentro del proyecto', bold: true },
          { text: ' y ordena todo lo que crece a su alrededor.' },
        ],
      },
      {
        id: 'nest',
        accent: 'navy',
        image: image('nest', 'Torre Nest vista desde la calle'),
        title: 'Torre Nest suma oficinas y comercio al corazón de Las Mercedes',
        body: [
          { text: 'Veinte pisos de ' },
          { text: 'oficinas y comercios', bold: true },
          {
            text:
              ' en uso, con acceso directo al eje peatonal y a la red de servicios que ' +
              'ya funciona en la zona.',
          },
        ],
      },
    ],
    footnote: [
      { text: 'Este enfoque en la ' },
      { text: 'conectividad', bold: true },
      { text: ' y ' },
      { text: 'accesibilidad', bold: true },
      {
        text:
          ' crea un flujo constante de personas, maximizando las oportunidades para el ' +
          'comercio y facilitando el día a día de sus residentes.',
      },
    ],
  },

  en: {
    slides: [
      {
        id: 'skypark',
        accent: 'teal-dark',
        image: image(
          'skypark',
          'Elevated pedestrian bridge between Torre Skypark and the Tolón shopping centre',
        ),
        title: 'The new Torre Skypark is a symbol of the progress of Las Mercedes',
        body: [
          {
            text:
              'This tower brings together retail and housing in an innovative way, and ' +
              'its design includes a key element for mobility: an elevated pedestrian ' +
              'link to the ',
          },
          { text: 'Tolon Shopping Centre', bold: true },
          { text: '.' },
        ],
      },
      {
        id: 'tolon',
        accent: 'olive',
        image: image(
          'tolon',
          'Render of Bulevar Tolón: pedestrians on the cobbled promenade, with ' +
            'terraces under the wooden pergola',
        ),
        title: 'Bulevar Tolón shapes the new pedestrian axis of the area',
        body: [
          {
            text:
              'A continuous route connecting retail, offices and housing, designed to be ' +
              'walked. The boulevard is the ',
          },
          { text: 'epicentre of the project', bold: true },
          { text: ' and orders everything growing around it.' },
        ],
      },
      {
        id: 'nest',
        accent: 'navy',
        image: image('nest', 'Torre Nest seen from the street'),
        title: 'Torre Nest adds offices and retail to the heart of Las Mercedes',
        body: [
          { text: 'Twenty floors of ' },
          { text: 'offices and retail', bold: true },
          {
            text:
              ' in use, with direct access to the pedestrian axis and to the network of ' +
              'services already running in the area.',
          },
        ],
      },
    ],
    footnote: [
      { text: 'This focus on ' },
      { text: 'connectivity', bold: true },
      { text: ' and ' },
      { text: 'accessibility', bold: true },
      {
        text:
          ' creates a constant flow of people, maximising opportunities for retail and ' +
          'making day-to-day life easier for residents.',
      },
    ],
  },
}

export function getSkypark(locale: Locale): SkyparkContent {
  return skypark[locale]
}
