import type { Locale } from '@/i18n/routing'
import type { Accent } from '@/lib/accents'

import type { Localized, Media, RichText } from '../types'

/**
 * Enlaces públicos de un proyecto. Los tres son opcionales: el que falte
 * simplemente no se pinta, así que un edificio sin LinkedIn no deja un icono
 * muerto en la ficha.
 */
export type ProjectLinks = {
  website?: string
  instagram?: string
  linkedin?: string
}

/** Una parada del camino horizontal: un proyecto con su foto y su ficha. */
export type Project = {
  id: string
  name: string
  image: Media
  /** Estado de obra ("En uso", "En construcción"…). Es contenido: se traduce. */
  status: string
  /** Tipo de uso ("Oficinas y comercios", "Residencial"…). También contenido. */
  type: string
  /** Número de pisos en crudo; el rótulo lo pone la interfaz (messages). */
  floors: number
  /** Color de la ficha que se descubre sobre la foto. */
  accent: Accent
  links: ProjectLinks
}

export type ProjectsContent = {
  /**
   * Pre-título sobre el titular de apertura: la pregunta que el titular
   * contesta. Es texto llano y no `RichText` porque va entero en versalitas,
   * sin tramos destacados.
   */
  eyebrow: string
  /** Titular de apertura, a la izquierda del camino. */
  intro: RichText
  /**
   * Párrafo de apertura, a la derecha del titular en la misma banda superior.
   * Viaja en el carril con él y comparte su entrada.
   */
  introBody: RichText
  projects: Project[]
}

/**
 * Datos que no dependen del idioma: el archivo de la foto con sus medidas
 * intrínsecas —las necesita `next/image` para servir la resolución correcta—,
 * los pisos y el color de la ficha.
 *
 * El orden de esta tabla es el orden del recorrido.
 *
 * **PENDIENTE**: `floors` es provisional en todos salvo Torre Nest, que viene
 * del Figma. Hay que confirmar el número real de pisos de cada edificio (y de
 * paso el nombre completo de La Grand Plaza) antes de publicar.
 */
const PROJECTS = {
  skypark: { file: 'skypark.png', width: 359, height: 458, floors: 24, accent: 'navy' },
  'torre-hto': { file: 'torre-hto.jpg', width: 1024, height: 740, floors: 12, accent: 'orange' },
  'torre-nest': { file: 'torre-nest.jpg', width: 350, height: 450, floors: 20, accent: 'navy' },
  tolon: { file: 'tolon.jpg', width: 612, height: 1000, floors: 6, accent: 'orange' },
  avanti: { file: 'avanti.png', width: 1800, height: 1013, floors: 6, accent: 'navy' },
  'torre-luxor': { file: 'torre-luxor.jpg', width: 1280, height: 863, floors: 14, accent: 'orange' },
  'california-mall': {
    file: 'california-mall.jpg',
    width: 594,
    height: 792,
    floors: 5,
    accent: 'navy',
  },
  'torre-guayana': {
    file: 'torre-guayana.png',
    width: 477,
    height: 686,
    floors: 16,
    accent: 'orange',
  },
  'la-grand-plaza': {
    file: 'la-grand-plaza.jpg',
    width: 672,
    height: 841,
    floors: 8,
    accent: 'navy',
  },
  'torre-gerais': {
    file: 'torre-gerais.jpg',
    width: 2063,
    height: 2560,
    floors: 18,
    accent: 'orange',
  },
  'torre-torca': { file: 'torre-torca.jpg', width: 750, height: 921, floors: 15, accent: 'navy' },

} as const satisfies Record<
  string,
  { file: string; width: number; height: number; floors: number; accent: Accent }
>

type ProjectId = keyof typeof PROJECTS

/**
 * Enlaces de cada proyecto. **PENDIENTE**: hoy todos apuntan a `#`; hay que
 * poner aquí las URL reales antes de publicar. Es el único sitio donde se
 * tocan, una línea por proyecto, y basta con borrar la clave que no exista
 * (un proyecto sin Instagram no pinta el icono).
 */
const LINKS: Record<ProjectId, ProjectLinks> = {
  skypark: { website: '#', instagram: '#', linkedin: '#' },
  'torre-hto': { website: '#', instagram: '#', linkedin: '#' },
  'torre-nest': { website: '#', instagram: '#', linkedin: '#' },
  tolon: { website: '#', instagram: '#', linkedin: '#' },
  avanti: { website: '#', instagram: '#', linkedin: '#' },
  'torre-luxor': { website: '#', instagram: '#', linkedin: '#' },
  'california-mall': { website: '#', instagram: '#', linkedin: '#' },
  'torre-guayana': { website: '#', instagram: '#', linkedin: '#' },
  'la-grand-plaza': { website: '#', instagram: '#', linkedin: '#' },
  'torre-gerais': { website: '#', instagram: '#', linkedin: '#' },
  'torre-torca': { website: '#', instagram: '#', linkedin: '#' },
}

/** Lo que sí cambia con el idioma: el alt de la foto, el estado y el uso. */
type ProjectCopy = { name: string; alt: string; status: string; type: string }

const project = (id: ProjectId, copy: ProjectCopy): Project => {
  const { file, width, height, floors, accent } = PROJECTS[id]

  return {
    id,
    name: copy.name,
    image: { url: `/projects/${file}`, alt: copy.alt, width, height },
    status: copy.status,
    type: copy.type,
    floors,
    accent,
    links: LINKS[id],
  }
}

/**
 * "+500 proyectos en desarrollo". Pasa a ser una colección `projects` de
 * Payload: cada documento es una parada del camino, ordenable, con su foto, su
 * ficha y sus enlaces.
 */
const projects: Localized<ProjectsContent> = {
  es: {
    eyebrow: '¿Qué está pasando en Las Mercedes?',
    intro: [
      {
        text: 'Las Mercedes es, sin duda, el espacio urbano más atractivo para la inversión en Caracas',
        bold: true,
      },
    ],
    introBody: [
      {
        text:
          'Ofrece un vasto y codiciado territorio para el desarrollo. ' +
          'Su extensión de 93 hectáreas garantiza la continuidad de proyectos a gran ' +
          'escala y la posibilidad de seguir expandiendo su infraestructura de lujo.',
      },
    ],
    projects: [
      project('torre-hto', {
        name: 'Torre HTO',
        alt: 'Vista de la Torre HTO',
        status: 'En uso',
        type: 'Oficinas y comercios',
      }),
      project('skypark', {
        name: 'Torre Skypark',
        alt: 'Render de la Torre Skypark',
        status: 'En construcción',
        type: 'Comercio y vivienda',
      }),
      project('tolon', {
        name: 'Centro Comercial Tolón',
        alt: 'Fachada del Centro Comercial Tolón',
        status: 'En uso',
        type: 'Comercios',
      }),
      project('torre-nest', {
        name: 'Torre Nest',
        alt: 'Vista de la Torre Nest',
        status: 'En uso',
        type: 'Oficinas y comercios',
      }),
      project('torre-luxor', {
        name: 'Torre Luxor',
        alt: 'Vista de la Torre Luxor',
        status: 'En uso',
        type: 'Oficinas',
      }),
      project('avanti', {
        name: 'Avanti',
        alt: 'Render nocturno del edificio Avanti',
        status: 'En construcción',
        type: 'Comercios',
      }),
      project('torre-guayana', {
        name: 'Torre Guayana',
        alt: 'Vista de la Torre Guayana',
        status: 'En uso',
        type: 'Oficinas',
      }),
      project('california-mall', {
        name: 'California Mall',
        alt: 'Fachada del California Mall',
        status: 'En uso',
        type: 'Comercios',
      }),
      project('torre-gerais', {
        name: 'Torre Gerais',
        alt: 'Vista de la Torre Gerais',
        status: 'En construcción',
        type: 'Oficinas',
      }),
      project('la-grand-plaza', {
        name: 'La Grand Plaza',
        alt: 'Vista de La Grand Plaza',
        status: 'En uso',
        type: 'Oficinas y comercios',
      }),
      project('torre-torca', {
        name: 'Torre Torca',
        alt: 'Vista de la Torre Torca',
        status: 'En uso',
        type: 'Oficinas y comercios',
      }),
    ],
  },

  en: {
    eyebrow: 'Why Las Mercedes?',
    intro: [
      {
        text: 'Las Mercedes is, without question, the most attractive urban space for investment in Caracas.',
        bold: true,
      },
    ],
    introBody: [
      {
        text:
          'Las Mercedes offers a vast and sought-after territory for development. ' +
          'Its 93 hectares guarantee the continuity of large-scale projects and the ' +
          'possibility of further expanding its luxury infrastructure.',
      },
    ],
    projects: [
      project('torre-hto', {
        name: 'Torre HTO',
        alt: 'View of Torre HTO',
        status: 'In use',
        type: 'Offices and retail',
      }),
      project('skypark', {
        name: 'Torre Skypark',
        alt: 'Render of Torre Skypark',
        status: 'Under construction',
        type: 'Retail and housing',
      }),
      project('tolon', {
        name: 'Centro Comercial Tolón',
        alt: 'Facade of the Tolón shopping centre',
        status: 'In use',
        type: 'Retail',
      }),
      project('torre-nest', {
        name: 'Torre Nest',
        alt: 'View of Torre Nest',
        status: 'In use',
        type: 'Offices and retail',
      }),
      project('torre-luxor', {
        name: 'Torre Luxor',
        alt: 'View of Torre Luxor',
        status: 'In use',
        type: 'Offices',
      }),
      project('avanti', {
        name: 'Avanti',
        alt: 'Night render of the Avanti building',
        status: 'Under construction',
        type: 'Retail',
      }),
      project('torre-guayana', {
        name: 'Torre Guayana',
        alt: 'View of Torre Guayana',
        status: 'In use',
        type: 'Offices',
      }),
      project('california-mall', {
        name: 'California Mall',
        alt: 'Facade of California Mall',
        status: 'In use',
        type: 'Retail',
      }),
      project('torre-gerais', {
        name: 'Torre Gerais',
        alt: 'View of Torre Gerais',
        status: 'Under construction',
        type: 'Offices',
      }),
      project('la-grand-plaza', {
        name: 'La Grand Plaza',
        alt: 'View of La Grand Plaza',
        status: 'In use',
        type: 'Offices and retail',
      }),
      project('torre-torca', {
        name: 'Torre Torca',
        alt: 'View of Torre Torca',
        status: 'In use',
        type: 'Offices and retail',
      }),
    ],
  },
}

export function getProjects(locale: Locale): ProjectsContent {
  return projects[locale]
}
