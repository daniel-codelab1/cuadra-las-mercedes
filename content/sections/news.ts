import type { Locale } from '@/i18n/routing'
import type { Accent } from '@/lib/accents'

import type { CtaLink, Localized, Media } from '../types'

/** Una noticia del carril. */
export type NewsItem = {
  id: string
  /** Titular corto, el que se lee de un vistazo. */
  title: string
  /** Una línea de contexto bajo el titular. */
  summary: string
  image: Media
  /** Color de la franja bajo la imagen. */
  accent: Accent
  /** Fecha en ISO. Ordena el carril; el formato visible lo pone el idioma. */
  date: string
  /** A dónde lleva la tarjeta. */
  href: string
}

export type NewsContent = {
  title: string
  cta: CtaLink
  items: NewsItem[]
}

/**
 * Datos que no cambian con el idioma: la foto con sus medidas intrínsecas, el
 * color de la franja, la fecha y el destino.
 *
 * Los acentos van repartidos a propósito para que dos tarjetas seguidas nunca
 * repitan color: la franja es lo que distingue una de otra de un vistazo.
 *
 * **PENDIENTE**: los destinos apuntan a `#` porque todavía no hay páginas de
 * noticia. Las fechas son las de los hitos que ya cuenta el sitio y hay que
 * confirmarlas con comunicación antes de publicar.
 */
const ITEMS = {
  bulevar: {
    file: '/media/bulevar-tolon-render-3.jpg',
    width: 1600,
    height: 528,
    accent: 'orange',
    date: '2026-07-15',
  },
  skypark: {
    file: '/skypark/conexion-tolon-skypark-1.jpg',
    width: 1200,
    height: 675,
    accent: 'teal-dark',
    date: '2026-06-02',
  },
  conexion: {
    file: '/skypark/skypark-cruce-tolon.jpg',
    width: 1600,
    height: 900,
    accent: 'steel-blue',
    date: '2026-05-20',
  },
  financiamiento: {
    file: '/media/urb-las-mercedes.jpg',
    width: 1200,
    height: 800,
    accent: 'olive',
    date: '2026-04-08',
  },
  directorio: {
    file: '/projects/torre-nest.jpg',
    width: 350,
    height: 450,
    accent: 'coral',
    date: '2026-03-11',
  },
  plano: {
    file: '/media/plano-las-mercedes.jpg',
    width: 1600,
    height: 989,
    accent: 'navy',
    date: '2026-02-26',
  },
} as const satisfies Record<
  string,
  { file: string; width: number; height: number; accent: Accent; date: string }
>

type NewsId = keyof typeof ITEMS

const item = (id: NewsId, copy: { title: string; summary: string; alt: string }): NewsItem => {
  const { file, width, height, accent, date } = ITEMS[id]

  return {
    id,
    title: copy.title,
    summary: copy.summary,
    image: { url: file, alt: copy.alt, width, height },
    accent,
    date,
    href: '#',
  }
}

/**
 * Novedades. Pasa a ser una colección `news` de Payload: cada documento es una
 * tarjeta, con su foto, su color de franja y su fecha.
 *
 * El orden de esta lista es el del carril, de la más reciente a la más
 * antigua. Al montar Payload, ese orden lo dará `date` descendente.
 */
const news: Localized<NewsContent> = {
  es: {
    title: 'Sigue las últimas novedades del proyecto',
    cta: { label: 'Ver todas las noticias', href: '#novedades' },
    items: [
      item('bulevar', {
        title: 'Bulevar Tolón',
        summary: 'Arranca el eje peatonal que ordenará la zona',
        alt: 'Render del Bulevar Tolón',
      }),
      item('skypark', {
        title: 'Torre Skypark',
        summary: 'La conexión elevada con el Tolón toma forma',
        alt: 'Conexión peatonal elevada entre la Torre Skypark y el Tolón',
      }),
      item('conexion', {
        title: 'Movilidad',
        summary: 'Caminar la zona de punta a punta, sin bajar a la calle',
        alt: 'Peatones cruzando la conexión elevada',
      }),
      item('financiamiento', {
        title: 'Inversión',
        summary: '260 millones de dólares financiando la transformación',
        alt: 'Vista aérea de la urbanización Las Mercedes',
      }),
      item('directorio', {
        title: 'Directorio',
        summary: 'Nuevas torres se suman al mapa de la zona',
        alt: 'Fachada de la Torre Nest',
      }),
      item('plano', {
        title: '93 hectáreas',
        summary: 'El territorio que sostiene los próximos desarrollos',
        alt: 'Plano catastral de Las Mercedes',
      }),
    ],
  },

  en: {
    title: 'Follow the latest news from the project',
    cta: { label: 'See all the news', href: '#novedades' },
    items: [
      item('bulevar', {
        title: 'Bulevar Tolón',
        summary: 'The pedestrian axis that will order the area begins',
        alt: 'Rendering of Bulevar Tolón',
      }),
      item('skypark', {
        title: 'Torre Skypark',
        summary: 'The elevated link to the Tolón takes shape',
        alt: 'Elevated pedestrian bridge between Torre Skypark and the Tolón',
      }),
      item('conexion', {
        title: 'Mobility',
        summary: 'Walking the area end to end, without coming down to the street',
        alt: 'Pedestrians crossing the elevated bridge',
      }),
      item('financiamiento', {
        title: 'Investment',
        summary: '260 million dollars financing the transformation',
        alt: 'Aerial view of the Las Mercedes district',
      }),
      item('directorio', {
        title: 'Directory',
        summary: 'New towers join the map of the area',
        alt: 'Facade of Torre Nest',
      }),
      item('plano', {
        title: '93 hectares',
        summary: 'The land that supports the developments to come',
        alt: 'Cadastral map of Las Mercedes',
      }),
    ],
  },
}

export function getNews(locale: Locale): NewsContent {
  return news[locale]
}
