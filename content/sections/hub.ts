import type { Locale } from '@/i18n/routing'
import type { Accent } from '@/lib/accents'

import type { Localized } from '../types'

/**
 * Un tramo de la frase. `highlight` es el que va sobre un bloque de color —el
 * énfasis del diseño—, y por eso no se parte en palabras al animar: entra de
 * una pieza, descubriéndose de izquierda a derecha.
 */
export type HubSegment = { text: string; highlight?: boolean }

/**
 * Una de las dos frases de la sección. Las líneas son las del diseño: el salto
 * es intencional (el bloque de color abre línea), no el resultado de que el
 * texto no quepa.
 */
export type HubPhrase = {
  /** Color del bloque del segmento destacado. */
  accent: Accent
  lines: HubSegment[][]
}

export type HubContent = {
  /** [0] la pregunta de entrada, [1] la respuesta al acercarse el plano. */
  phrases: [HubPhrase, HubPhrase]
}

/**
 * "Prime Business Hub". Pasa a ser un global `hub` de Payload: dos grupos de
 * frase, cada uno con sus líneas y su color de énfasis.
 *
 * `Todo Cuadra` se queda en español también en la versión en inglés: es el
 * lema de la marca —juega con "cuadra" como manzana urbana—, no una frase
 * traducible. Si se decide traducirlo, es aquí.
 */
const hub: Localized<HubContent> = {
  es: {
    phrases: [
      {
        accent: 'orange',
        lines: [
          [{ text: '¿Es o no es Las Mercedes el' }],
          [{ text: 'Prime Business Hub', highlight: true }, { text: 'de Caracas?' }],
        ],
      },
      {
        accent: 'teal-dark',
        lines: [[{ text: 'En Las Mercedes' }], [{ text: 'Todo Cuadra', highlight: true }]],
      },
    ],
  },

  en: {
    phrases: [
      {
        accent: 'orange',
        lines: [
          [{ text: 'Is Las Mercedes the' }],
          [{ text: 'Prime Business Hub', highlight: true }, { text: 'of Caracas, or not?' }],
        ],
      },
      {
        accent: 'teal-dark',
        lines: [[{ text: 'In Las Mercedes' }], [{ text: 'Todo Cuadra', highlight: true }]],
      },
    ],
  },
}

export function getHub(locale: Locale): HubContent {
  return hub[locale]
}
