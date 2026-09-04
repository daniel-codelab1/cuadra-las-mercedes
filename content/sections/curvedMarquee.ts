import type { Locale } from '@/i18n/routing'

import type { Localized } from '../types'

export type CurvedMarqueeContent = {
  /**
   * El texto que recorre la curva. Se repite solo hasta llenarla, así que basta
   * con una vuelta: el separador del final es el que la cose con la siguiente.
   *
   * No se traduce —es el nombre de la marca—, igual que el anillo de
   * `financing` o "Todo Cuadra" en `hub`.
   */
  text: string
}

/** Banda de texto curvo entre financiamiento y Skypark. */
const curvedMarquee: Localized<CurvedMarqueeContent> = {
  es: { text: 'Cuadra ✦ Las Mercedes ✦' },
  en: { text: 'Cuadra ✦ Las Mercedes ✦' },
}

export function getCurvedMarquee(locale: Locale): CurvedMarqueeContent {
  return curvedMarquee[locale]
}
