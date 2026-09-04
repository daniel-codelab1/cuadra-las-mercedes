import type { Locale } from '@/i18n/routing'

import type { CtaLink, Localized, MediaSlide, RichText } from '../types'

export type BulevarContent = {
  /** Rótulo grande sobre el medio mientras el bloque sigue cerrado. */
  title: string
  /** Titular que se descubre cuando el medio ya llena la pantalla. */
  heading: string
  body: RichText
  /**
   * Botón bajo el párrafo. **PENDIENTE**: el destino es `#` mientras no se
   * decida a dónde lleva "conocer más" del Bulevar —igual que los enlaces de
   * los proyectos—. Cambiarlo es cambiar `href` aquí, en los dos idiomas.
   */
  cta: CtaLink
  /**
   * Foto o vídeo, indistintamente: es el mismo `MediaSlide` polimórfico que usa
   * el carrusel del hero. Cambiar el fondo de esta sección de vídeo a foto (o
   * al revés) es cambiar este campo, sin tocar la sección ni `ScrollExpand`.
   */
  media: MediaSlide
}

/**
 * El medio es el mismo en los dos idiomas; sólo cambia el texto alternativo.
 *
 * El póster hace doble papel: es lo que se pinta mientras el vídeo carga y es
 * lo que se queda fijo con `prefers-reduced-motion`, donde el vídeo no llega a
 * reproducirse. Por eso tiene que ser un fotograma representativo y no una
 * imagen cualquiera.
 */
const VIDEO = '/media/bulevar-tolon-video-1.mp4'
const POSTER = { url: '/media/bulevar-tolon-hd-2.jpg', width: 1600, height: 1065 }

/**
 * "Se activa con el Bulevar Tolón". Pasa a ser un global `bulevar` de Payload:
 * dos textos, un rótulo y el medio.
 */
const bulevar: Localized<BulevarContent> = {
  es: {
    title: 'Cuadra Las Mercedes',
    heading: 'Se activa con el Bulevar Tolón',
    body: [
      { text: 'El nuevo ' },
      { text: 'Bulevar Tolón', bold: true },
      {
        text: ' será un atractivo eje urbano que iniciará en la Plaza Alfredo Sadel y que conectará las avenidas clave de la zona, invitando a vivir una experiencia transformadora.',
      },
    ],
    cta: { label: 'Conoce más', href: '#' },
    media: {
      type: 'video',
      src: VIDEO,
      alt: 'Recorrido por el Bulevar Tolón en Las Mercedes',
      poster: { ...POSTER, alt: 'El Bulevar Tolón en Las Mercedes' },
    },
  },

  en: {
    title: 'Cuadra Las Mercedes',
    heading: 'Powered by Bulevar Tolón',
    body: [
      { text: 'The new ' },
      { text: 'Bulevar Tolón', bold: true },
      {
        text: " will be a striking urban axis starting at Plaza Alfredo Sadel and connecting the area's key avenues, an invitation to a transformative experience.",
      },
    ],
    cta: { label: 'Learn more', href: '#' },
    media: {
      type: 'video',
      src: VIDEO,
      alt: 'A walk along Bulevar Tolón in Las Mercedes',
      poster: { ...POSTER, alt: 'Bulevar Tolón in Las Mercedes' },
    },
  },
}

export function getBulevar(locale: Locale): BulevarContent {
  return bulevar[locale]
}
