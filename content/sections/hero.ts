import type { Locale } from '@/i18n/routing'

import type { CtaLink, Localized, Media, MediaSlide, RichText } from '../types'

export type HeroContent = {
  eyebrow: string
  /** Se anima carácter a carácter; mantenerlo corto. */
  title: string
  labels: string[]
  body: RichText
  cta: CtaLink
  media: MediaSlide[]
  projectStart: {
    label: string
    /** Fecha en ISO. El formato visible lo decide el idioma, no el contenido. */
    date: string
    /**
     * Imagen que ocupa el lado derecho del bloque, a todo su alto.
     * PENDIENTE de que la entreguen; mientras no exista, el bloque se pinta
     * sólo con el texto y no hay hueco vacío.
     */
    image?: Media
  }
  caption: RichText
}

/**
 * Fotos de la columna derecha, en el orden en que las pasa el carrusel. La ruta
 * y las medidas son iguales en ambos idiomas; sólo el `alt` se traduce, así que
 * cada bloque de idioma pasa un alt por foto y en este mismo orden.
 *
 * `MediaSlide` es polimórfico imagen|vídeo: sumar un vídeo a la secuencia es
 * añadir un elemento aquí, sin tocar el componente.
 */
const SLIDES = [
  { url: '/hero/bulevar-tolon-render-1.jpg', width: 1280, height: 852 },
  { url: '/hero/bulevar-tolon-render-2.jpg', width: 1280, height: 853 },
] as const

const media = (alts: string[]): MediaSlide[] =>
  SLIDES.map((slide, index) => ({
    type: 'image',
    image: { ...slide, alt: alts[index] },
  }))

/**
 * Hero. Pasa a ser un global `hero` de Payload.
 *
 * `media` es un array polimórfico imagen|vídeo: la columna derecha es un
 * carrusel, de modo que desde el CMS se puede alternar entre fotos y un vídeo
 * sin tocar código.
 */
const hero: Localized<HeroContent> = {
  es: {
    eyebrow: 'Algo nuevo acaba de llegar a',
    title: 'LAS MERCEDES',
    labels: ['Caracas, Venezuela', 'Municipio Baruta'],
    body: [
      { text: 'Las Mercedes se ha transformado en el principal ' },
      { text: 'foco de actividad comercial y urbana', bold: true },
      {
        text:
          ' de Caracas. Con la Plaza Alfredo Sadel como su epicentro y la Avenida ' +
          'Principal como su eje vital, esta zona es el destino preferido para ' +
          'quienes buscan calidad de vida, negocios sólidos y un ambiente de ' +
          'crecimiento constante.',
      },
    ],
    cta: { label: 'Descubre más', href: '#novedades' },
    media: media([
      'Render del Bulevar Tolón: terraza de café bajo los árboles, con gente ' +
        'sentada frente a los locales',
      'Render del Bulevar Tolón: vitrinas de tiendas bajo la pérgola de madera, ' +
        'con peatones recorriendo el paseo',
    ]),
    projectStart: { label: 'Inicio del Proyecto:', date: '2026-06-09' },
    caption: [
      { text: 'Cuadra Las Mercedes', bold: true },
      { text: ' se activa con el ' },
      { text: 'Bulevar Tolón', bold: true },
      {
        text:
          ' como epicentro, creando un eje urbano que conectará avenidas clave en ' +
          'dos etapas, invitando a vivir una experiencia transformadora.',
      },
    ],
  },

  en: {
    eyebrow: 'Something new has just arrived in',
    title: 'LAS MERCEDES',
    labels: ['Caracas, Venezuela', 'Baruta Municipality'],
    body: [
      { text: 'Las Mercedes has become the leading ' },
      { text: 'hub of commercial and urban activity', bold: true },
      {
        text:
          ' in Caracas. With Plaza Alfredo Sadel at its heart and Avenida Principal ' +
          'as its main axis, this area is the destination of choice for those ' +
          'seeking quality of life, solid business and an environment of steady ' +
          'growth.',
      },
    ],
    cta: { label: 'Discover more', href: '#novedades' },
    media: media([
      'Render of Bulevar Tolón: café terrace under the trees, with people seated ' +
        'outside the shops',
      'Render of Bulevar Tolón: shop windows under the wooden pergola, with ' +
        'pedestrians along the promenade',
    ]),
    projectStart: { label: 'Project start:', date: '2026-06-09' },
    caption: [
      { text: 'Cuadra Las Mercedes', bold: true },
      { text: ' comes alive with ' },
      { text: 'Bulevar Tolón', bold: true },
      {
        text:
          ' at its centre, creating an urban axis that will connect key avenues in ' +
          'two phases, an invitation to a transformative experience.',
      },
    ],
  },
}

export function getHero(locale: Locale): HeroContent {
  return hero[locale]
}
