import type { Locale } from '@/i18n/routing'

import type { CtaLink, Localized, Media, MediaSlide } from '../types'

export type SkyparkEditorialContent = {
  /**
   * Botón bajo el párrafo de la columna izquierda. **PENDIENTE**: el destino es
   * `#` mientras no se decida a dónde lleva, igual que el de `bulevar`.
   */
  cta: CtaLink
  /** El medio grande de la columna izquierda. */
  lead: MediaSlide
  /** Los dos medios del pie de la columna derecha, en el orden en que se ven. */
  aside: [MediaSlide, MediaSlide]
}

const CONEXION: Media = {
  url: '/skypark/conexion-tolon-skypark-1.jpg',
  width: 1200,
  height: 675,
  alt: '',
}

const CRUCE: Media = {
  url: '/skypark/skypark-cruce-tolon.jpg',
  width: 1600,
  height: 900,
  alt: '',
}

const image = (media: Media, alt: string): MediaSlide => ({
  type: 'image',
  image: { ...media, alt },
})

/**
 * Torre Skypark — medios de la versión editorial.
 *
 * Los textos de esta sección salen de `skypark`, que es donde viven los pisos.
 * Los medios no: la composición editorial pide unos concretos en unos sitios
 * concretos —uno grande y dos al pie— y no se corresponden con los de los
 * pisos, así que van aparte.
 *
 * Son `MediaSlide`, el tipo polimórfico imagen|vídeo que ya usan el hero y
 * `bulevar`. Cambiar cualquiera de los tres por un vídeo, o al revés, es
 * cambiar el objeto aquí: ni la sección ni el componente se enteran.
 *
 * **PENDIENTE**: el vídeo no tiene póster. Sin él, la caja se queda vacía
 * mientras carga y con `prefers-reduced-motion` no se ve nada, porque en ese
 * caso no llega a reproducirse. Basta con exportar un fotograma y añadirlo.
 */
const skyparkEditorial: Localized<SkyparkEditorialContent> = {
  es: {
    cta: { label: 'Conoce más', href: '#' },
    lead: image(CONEXION, 'Conexión peatonal elevada entre la Torre Skypark y el Tolón'),
    aside: [
      {
        type: 'video',
        src: '/skypark/skypark-vid.mp4',
        alt: 'Recorrido por la Torre Skypark y su entorno',
      },
      image(CRUCE, 'El cruce del Tolón visto desde la conexión elevada'),
    ],
  },

  en: {
    cta: { label: 'Learn more', href: '#' },
    lead: image(CONEXION, 'Elevated pedestrian bridge between Torre Skypark and the Tolón'),
    aside: [
      {
        type: 'video',
        src: '/skypark/skypark-vid.mp4',
        alt: 'A walk through Torre Skypark and its surroundings',
      },
      image(CRUCE, 'The Tolón crossing seen from the elevated bridge'),
    ],
  },
}

export function getSkyparkEditorial(locale: Locale): SkyparkEditorialContent {
  return skyparkEditorial[locale]
}
