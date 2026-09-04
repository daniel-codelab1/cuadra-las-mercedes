import type { SocialNetwork } from '@/components/ui'
import type { Locale } from '@/i18n/routing'

import type { CtaLink, Localized } from '../types'

/** Una columna de enlaces del pie, con su encabezado. */
export type FooterColumn = {
  title: string
  links: CtaLink[]
}

export type FooterContent = {
  columns: FooterColumn[]
  /** La misma acción que la barra de navegación, repetida al cerrar. */
  cta: CtaLink
  social: { network: SocialNetwork; href: string }[]
  /**
   * El rótulo gigante del pie.
   *
   * **Va escrito con la fuente de marca, no con el asset del logotipo.** Es una
   * excepción pedida a la regla del manual (`DESIGN_SYSTEM.md` §7: el logotipo
   * es imagen, no texto), y el motivo es de resolución: los archivos entregados
   * miden 120×44 y 462×174, así que a ancho de pantalla se escalarían entre 3×
   * y 12×. Cuando llegue un SVG del logotipo, esto se cambia por él.
   *
   * No se traduce: es la marca.
   */
  wordmark: string
}

/**
 * Pie del sitio. Pasa a ser un global `footer` de Payload: las columnas son un
 * array repetible de grupos con sus enlaces.
 *
 * **PENDIENTE**: los destinos legales (`/terminos`, `/privacidad`, `/cookies`)
 * apuntan a páginas que todavía no existen. Se crean en el paso siguiente.
 */
const footer: Localized<FooterContent> = {
  es: {
    columns: [
      {
        title: 'Secciones',
        links: [
          { label: 'Novedades', href: '#novedades' },
          { label: 'Mapa', href: '#mapa' },
          { label: 'Directorio', href: '#directorio' },
          { label: 'Cifras', href: '#cifras' },
        ],
      },
      {
        title: 'Proyecto',
        links: [
          { label: 'Proyectos', href: '#proyectos' },
          { label: 'Financiamiento', href: '#financiamiento' },
          { label: 'Bulevar Tolón', href: '#bulevar' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Términos y condiciones', href: '/terminos' },
          { label: 'Política de privacidad', href: '/privacidad' },
          { label: 'Política de cookies', href: '/cookies' },
        ],
      },
    ],
    cta: { label: 'Súmate', href: '#sumate' },
    social: [
      { network: 'instagram', href: '#' },
      { network: 'linkedin', href: '#' },
      { network: 'website', href: '#' },
    ],
    wordmark: 'Cuadra Las Mercedes',
  },

  en: {
    columns: [
      {
        title: 'Sections',
        links: [
          { label: 'News', href: '#novedades' },
          { label: 'Map', href: '#mapa' },
          { label: 'Directory', href: '#directorio' },
          { label: 'Figures', href: '#cifras' },
        ],
      },
      {
        title: 'Project',
        links: [
          { label: 'Projects', href: '#proyectos' },
          { label: 'Financing', href: '#financiamiento' },
          { label: 'Bulevar Tolón', href: '#bulevar' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Terms and conditions', href: '/terminos' },
          { label: 'Privacy policy', href: '/privacidad' },
          { label: 'Cookie policy', href: '/cookies' },
        ],
      },
    ],
    cta: { label: 'Join us', href: '#sumate' },
    social: [
      { network: 'instagram', href: '#' },
      { network: 'linkedin', href: '#' },
      { network: 'website', href: '#' },
    ],
    wordmark: 'Cuadra Las Mercedes',
  },
}

export function getFooter(locale: Locale): FooterContent {
  return footer[locale]
}
