import type { Locale } from '@/i18n/routing'

import type { Localized, Partner } from '../types'

export type PartnersContent = {
  title: string
  partners: Partner[]
}

/**
 * Enlace de cada aliado. **PENDIENTE**: hoy todos apuntan a `#`; hay que poner
 * aquí la URL de cada uno antes de publicar. `href` es obligatorio en el tipo
 * para que ningún logo pueda quedarse sin destino, y esta tabla es el único
 * sitio donde se tocan — una línea por aliado.
 */
const HREF: Record<PartnerSlug, string> = {
  baruta: '#', // TODO: sitio de la Alcaldía de Baruta
  invaca: '#', // TODO: sitio de Invaca Investment Company
  'grupo-binian': '#', // TODO: sitio de Grupo Binian
  futura: '#', // TODO: sitio de Futura
  'nest-coworking': '#', // TODO: sitio de Nest Coworking
  'sky-park': '#', // TODO: sitio de Sky Park
  cittapp: '#', // TODO: sitio de Cittapp
}

/**
 * Los PNG de `public/partners/<slug>.png` son los originales recortados al
 * contenido: los archivos entregados venían en un lienzo cuadrado de 500×500
 * con mucho margen transparente, y con ese margen dentro de la imagen cada
 * logo se dibujaba a un tamaño distinto dentro de la misma caja del carrusel.
 * Las medidas de aquí son las del recorte, y son las que `next/image` necesita
 * para reservar el espacio sin provocar saltos de layout.
 *
 * `scale` es el ajuste óptico dentro de la caja del carrusel (1 = tamaño por
 * defecto): Baruta es un logo apilado —hoja, nombre y lema— y a la misma caja
 * que un logotipo apaisado se lee mucho más pequeño, así que va más grande y el
 * resto un punto por debajo.
 *
 * `white: true` marca los logos de una sola tinta oscura, que sobre el fondo
 * negro del tema oscuro desaparecerían: de ésos hay además un
 * `<slug>-white.png` monocromático (DESIGN_SYSTEM.md §6). El resto lleva color
 * suficiente para leerse en los dos temas y reutiliza el mismo archivo.
 */
const LOGOS = {
  baruta: { width: 276, height: 246, white: false, scale: 1.35 },
  invaca: { width: 370, height: 132, white: true, scale: 0.85 },
  'grupo-binian': { width: 406, height: 146, white: true, scale: 0.85 },
  futura: { width: 500, height: 204, white: false, scale: 0.85 },
  'nest-coworking': { width: 326, height: 176, white: false, scale: 0.85 },
  'sky-park': { width: 347, height: 149, white: true, scale: 0.85 },
  cittapp: { width: 378, height: 131, white: false, scale: 0.85 },
} as const satisfies Record<
  string,
  { width: number; height: number; white: boolean; scale: number }
>

type PartnerSlug = keyof typeof LOGOS

/** Los logos son los mismos en ambos idiomas; sólo cambia el `alt`. */
const partner = (slug: PartnerSlug, name: string, alt: string): Partner => {
  const { width, height, white, scale } = LOGOS[slug]
  const logoLight = { url: `/partners/${slug}.png`, alt, width, height }

  return {
    name,
    href: HREF[slug],
    scale,
    logoLight,
    logoDark: white ? { ...logoLight, url: `/partners/${slug}-white.png` } : logoLight,
  }
}

/**
 * Aliados. Pasa a ser una colección `partners` de Payload, ordenable, con los
 * dos campos de imagen y el enlace. El orden de estos arrays es el orden en que
 * entran al carrusel.
 */
const partners: Localized<PartnersContent> = {
  es: {
    title: 'Ellos lo están haciendo posible:',
    partners: [
      partner('baruta', 'Baruta', 'Logo de la Alcaldía de Baruta'),
      partner('invaca', 'Invaca', 'Logo de Invaca Investment Company'),
      partner('grupo-binian', 'Grupo Binian', 'Logo de Grupo Binian'),
      partner('futura', 'Futura', 'Logo de Futura'),
      partner('nest-coworking', 'Nest Coworking', 'Logo de Nest Coworking'),
      partner('sky-park', 'Sky Park', 'Logo de Sky Park'),
      partner('cittapp', 'Cittapp', 'Logo de Cittapp'),
    ],
  },
  en: {
    title: 'They are making it possible:',
    partners: [
      partner('baruta', 'Baruta', 'Baruta Municipality logo'),
      partner('invaca', 'Invaca', 'Invaca Investment Company logo'),
      partner('grupo-binian', 'Grupo Binian', 'Grupo Binian logo'),
      partner('futura', 'Futura', 'Futura logo'),
      partner('nest-coworking', 'Nest Coworking', 'Nest Coworking logo'),
      partner('sky-park', 'Sky Park', 'Sky Park logo'),
      partner('cittapp', 'Cittapp', 'Cittapp logo'),
    ],
  },
}

export function getPartners(locale: Locale): PartnersContent {
  return partners[locale]
}
