import type { Locale } from '@/i18n/routing'
import type { Accent } from '@/lib/accents'

import type { Localized } from '../types'

/**
 * Una cifra de la fila de stats.
 *
 * El número viaja en crudo y el formato se compone con `prefix`/`suffix`, no
 * como texto ya armado: es lo que le permite al contador animarse desde cero y
 * seguir mostrando la cifra correcta sin JS.
 */
export type Stat = {
  id: string
  value: number
  prefix?: string
  suffix?: string
  /** Decimales a mostrar (1 en "+1.5M"). */
  decimals?: number
  /**
   * Color del subrayado. La fila de stats es la excepción documentada a la
   * regla de un acento por sección: cada tarjeta lleva el suyo (§2).
   */
  accent: Accent
  label: string
  description: string
}

export type StatsContent = {
  title: string
  stats: Stat[]
}

/**
 * Las Mercedes en números. Pasa a ser un global `stats` de Payload: el titular
 * como campo de texto y las cifras como array ordenable con el acento de cada
 * tarjeta en un campo de selección.
 */
const stats: Localized<StatsContent> = {
  es: {
    title: 'Las Mercedes 2026 en números:',
    stats: [
      {
        id: 'construccion',
        value: 400,
        prefix: '+$',
        suffix: 'M',
        accent: 'steel-blue',
        label: 'En Nuevas Construcciones',
        description:
          'Desde rascacielos corporativos y comercios hasta desarrollos residenciales de élite.',
      },
      {
        id: 'consumo',
        value: 5,
        prefix: '+$',
        suffix: 'M',
        accent: 'olive',
        label: 'Registrado en consumo diario',
        description:
          'Se prevé que para el año 2030 el flujo de consumo diario alcance los $7M.',
      },
      {
        id: 'metros',
        value: 1.5,
        prefix: '+',
        suffix: 'M',
        decimals: 1,
        accent: 'coral',
        label: 'En (m²) vendibles',
        description:
          'Donde destacan las oficinas modernas y las viviendas como sus principales pilares.',
      },
      {
        id: 'vehiculos',
        value: 40,
        prefix: '+',
        suffix: 'K',
        accent: 'coral-light',
        label: 'Vehículos circulando a diario',
        description:
          'Prepárate para la máxima exposición en la Avenida Principal de Las Mercedes.',
      },
    ],
  },

  en: {
    title: 'Las Mercedes 2026 by the numbers:',
    stats: [
      {
        id: 'construccion',
        value: 400,
        prefix: '+$',
        suffix: 'M',
        accent: 'steel-blue',
        label: 'In new construction',
        description:
          'From corporate towers and retail to elite residential developments.',
      },
      {
        id: 'consumo',
        value: 5,
        prefix: '+$',
        suffix: 'M',
        accent: 'olive',
        label: 'Recorded in daily spending',
        description: 'Daily spending is expected to reach $7M by 2030.',
      },
      {
        id: 'metros',
        value: 1.5,
        prefix: '+',
        suffix: 'M',
        decimals: 1,
        accent: 'coral',
        label: 'In sellable (m²)',
        description: 'Modern offices and housing stand out as its main pillars.',
      },
      {
        id: 'vehiculos',
        value: 40,
        prefix: '+',
        suffix: 'K',
        accent: 'coral-light',
        label: 'Vehicles passing through daily',
        description:
          'Get ready for maximum exposure on the Avenida Principal de Las Mercedes.',
      },
    ],
  },
}

export function getStats(locale: Locale): StatsContent {
  return stats[locale]
}
