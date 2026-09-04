import type { Locale } from '@/i18n/routing'
import type { Accent } from '@/lib/accents'

import type { Localized } from '../types'

/**
 * Un tramo de la frase.
 *
 * Sin `accent`, la palabra pasa de gris a color de texto, que es el barrido de
 * toda la vida. Con `accent`, llega a ese color de marca en vez de al negro: el
 * punto de partida (el gris atenuado) y el momento en que se enciende son los
 * mismos, sólo cambia el destino.
 *
 * No es un `RichText`: aquel se pinta de una pieza con `<RichText>`, y esto hay
 * que partirlo palabra a palabra para poder encenderlas de una en una. Los
 * tramos son sólo la forma de decir dónde cambia el color.
 */
export type FinancingSegment = {
  text: string
  accent?: Accent
}

export type FinancingContent = {
  /**
   * La frase, en tramos. Se aplana a palabras en la sección, así que los
   * espacios entre tramos dan igual: lo que cuenta es el orden.
   *
   * Conviene que siga siendo una sola frase: cada palabra consume scroll, así
   * que cuanto más larga, más rato queda la sección fijada.
   *
   * El "²" va como carácter Unicode y no como marcado: se lee bien en voz alta
   * y sobrevive al paso por el CMS sin necesitar rich text.
   */
  text: FinancingSegment[]
  /**
   * Texto del anillo giratorio que acompaña a la frase. El separador se pinta
   * con su propio color, así que forma parte del contenido: al cambiar las
   * palabras hay que traer los suyos.
   *
   * No se traduce —es el nombre de la marca—, igual que "Todo Cuadra" en `hub`.
   */
  ring: string
}

/**
 * Financiamiento. Pasa a ser un global `financing` de Payload: el tramo es un
 * bloque repetible con su texto y un selector de acento opcional.
 *
 * El acento dueño de la sección es `orange` (DESIGN_SYSTEM.md §2), que es el de
 * la flecha y el anillo. Las cifras destacadas dentro de la frase son la
 * excepción documentada: dos tramos en `olive` y uno en `steel-blue`.
 */
const financing: Localized<FinancingContent> = {
  es: {
    text: [
      { text: 'Actualmente,' },
      { text: '260 millones de dólares están financiando 137.000m² de '},
      { text: 'nuevas construcciones', accent: 'coral-light' },
      { text: 'que comprenden principalmente oficinas, comercios y viviendas con un ' },
      { text: 'potencial de crecimiento para nuevas inversiones', accent: 'coral-light' },
      { text: 'en los sectores de comercio y hotelería.' },
    ],
    ring: 'CUADRA✦LAS✦MERCEDES✦',
  },
  en: {
    text: [
      { text: 'Right now,' },
      { text: '260 million dollars', accent: 'teal-dark' },
      { text: 'are financing' },
      { text: '137,000m² of new construction,', accent: 'teal-dark' },
      { text: 'made up mainly of offices, retail and housing, with' },
      { text: 'room to grow for new investment', accent: 'orange' },
      { text: 'in the retail and hospitality sectors.' },
    ],
    ring: 'CUADRA✦LAS✦MERCEDES✦',
  },
}

export function getFinancing(locale: Locale): FinancingContent {
  return financing[locale]
}
