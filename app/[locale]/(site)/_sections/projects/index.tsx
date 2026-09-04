import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import {
  BRANDMARK_CELL_SIZE,
  BrandMark,
  Rail,
  RichText,
  SocialIcon,
  type SocialNetwork,
} from '@/components/ui'
import { getProjects, type Project } from '@/content/sections/projects'
import type { RichText as RichTextValue } from '@/content/types'
import type { Locale } from '@/i18n/routing'
import { ACCENT_BG } from '@/lib/accents'
import { cn } from '@/lib/cn'
import { isVector } from '@/lib/media'

import { ProjectsMobileReveal } from './ProjectsMobileReveal'
import { ProjectsScroll } from './ProjectsScroll'

/** Medidas de cada parada del camino, dadas por diseño. */
const CARD = { width: 280, height: 380 }

/**
 * Alto real de una parada: el del diseño mientras quepa, y si no el que permita
 * la ventana. Las torres son lo que llena la banda entre el titular y el borde
 * inferior, así que su tamaño es también el que fija esos dos aires; dejarlas
 * en px fijos deja la sección medio vacía en pantallas altas y las mete debajo
 * del titular en las bajas.
 *
 * El ancho lo deriva la proporción del diseño, de modo que la torre nunca se
 * deforma al encoger.
 */
const CARD_HEIGHT = `min(${CARD.height}px, 52vh)`
const CARD_WIDTH = `calc(${CARD_HEIGHT} * ${CARD.width} / ${CARD.height})`

/**
 * Dónde empieza la banda superior: el titular a la izquierda y el isotipo a la
 * derecha cuelgan los dos de aquí, así que comparten constante o se
 * desalinean. Los 60px sueltos son el aire que separa la sección de la barra
 * de navegación, que si no queda pegada.
 */
const BAND_TOP = 'calc(8vh + 60px)'

/**
 * Ancho del titular de apertura y sitio del párrafo que lo acompaña.
 *
 * El párrafo se coloca a partir del titular y no con una medida suelta: arranca
 * donde éste termina más una celda de aire, así que al cambiar el ancho del
 * titular los dos se mueven juntos en vez de descuadrarse. Y termina antes del
 * isotipo, que vive a una celda del borde derecho.
 */
const INTRO_WIDTH = 'min(56vw, 40rem)'
const INTRO_BODY_LEFT = `calc(var(--cell) * 3 + ${INTRO_WIDTH})`
const INTRO_BODY_WIDTH = 'min(30vw, 27rem)'

/** Aire a cada lado de una parada. La mitad del hueco entre torres. */
const STOP_PADDING = 16

/**
 * Cuánto de la primera torre queda oculto tras el borde izquierdo al empezar la
 * sección. El camino arranca ya cortado, no desde cero.
 */
const FIRST_STOP_HIDDEN = 0.4

/**
 * Amplitud de la curva en píxeles: cuánto sube la parada más alta respecto a
 * las de los extremos. 125 es lo que marca el diseño, y la fórmula de `curveOffset` reparte el arco
 */
const CURVE_AMPLITUDE = 0

/**
 * Desplazamiento vertical de cada parada: un arco con los extremos abajo y el
 * centro arriba, que es lo que dibuja el "camino" del diseño.
 *
 * PENDIENTE: en el Figma las alturas son irregulares, no un arco limpio. Esto
 * es una aproximación; si hace falta calcarlas, el sitio para hacerlo es un
 * campo por parada en `content/sections/projects.ts`, no esta fórmula.
 */
function curveOffset(index: number, total: number) {
  if (total <= 1) return 0
  return -Math.sin((Math.PI * index) / (total - 1)) * CURVE_AMPLITUDE
}

/**
 * "+500 proyectos en desarrollo" (sección 5 del Figma).
 *
 * **Dos versiones, no una sola adaptada.** Desde `lg`, el camino fijado con
 * scroll horizontal de siempre (`ProjectsScroll` + pin). Por debajo, un carril
 * de scroll nativo con las mismas tarjetas — no es el mismo componente
 * encogido, es otro: el camino pinneado da por sentado un ancho de pantalla
 * que no hay en un teléfono (la banda de apertura se posiciona en absoluto
 * contra el ancho de la ventana, y la ficha de cada torre sólo se descubre con
 * `:hover`, que no existe al tacto — sin foco previo posible, porque los únicos
 * elementos enfocables de la tarjeta viven dentro de la propia ficha oculta).
 * Intentar que el mismo marcado sirviera para los dos hubiera significado
 * reescribir la banda de apertura, la interacción de la ficha y el pin, todo
 * a la vez, dentro de un componente pensado para otro mecanismo. Separarlas
 * es menos trabajo total y dos piezas más simples de mantener que una sola
 * llena de condicionales.
 *
 * Las dos leen el mismo `getProjects(locale)`: nunca hay que tocar el
 * contenido en dos sitios.
 */
export async function Projects({ locale }: { locale: Locale }) {
  const { eyebrow, intro, introBody, projects } = getProjects(locale)
  const t = await getTranslations('Projects')

  const floorsLabel = (project: Project) =>
    project.floors > 0 ? t('floors', { count: project.floors }) : null
  const linkLabel = (network: SocialNetwork, project: Project) =>
    t(network, { name: project.name })

  return (
    <div id="proyectos">
      <ProjectsMobile
        eyebrow={eyebrow}
        intro={intro}
        introBody={introBody}
        projects={projects}
        floorsLabel={floorsLabel}
        linkLabel={linkLabel}
        labelPrev={t('previous')}
        labelNext={t('next')}
      />

      <ProjectsDesktop
        eyebrow={eyebrow}
        intro={intro}
        introBody={introBody}
        projects={projects}
        floorsLabel={floorsLabel}
        linkLabel={linkLabel}
      />
    </div>
  )
}

type ProjectsData = {
  eyebrow: string
  intro: RichTextValue
  introBody: RichTextValue
  projects: Project[]
  floorsLabel: (project: Project) => string | null
  linkLabel: (network: SocialNetwork, project: Project) => string
}

/**
 * Versión de escritorio: el camino fijado con scroll horizontal, sin cambios
 * de comportamiento. `hidden lg:block`: por debajo de `lg` no sólo se oculta
 * con CSS, `useHorizontalPin` tampoco arma el pin (ver su cabecera) — así no
 * hay un `ScrollTrigger` de pin viviendo sobre un elemento a `display: none`.
 */
function ProjectsDesktop({
  eyebrow,
  intro,
  introBody,
  projects,
  floorsLabel,
  linkLabel,
}: ProjectsData) {
  return (
    <ProjectsScroll
      className="hidden lg:block"
      overlay={
        // Lo único que permanece en pantalla durante el recorrido. Cada isotipo
        // gira sobre su propio eje, ligado al avance del desplazamiento.
        // Va a una celda del borde derecho de la ventana, en espejo del
        // titular, que arranca a una celda del izquierdo. Por eso no usa
        // `.shell`: en pantallas más anchas que la grilla lo dejaría flotando
        // muy adentro.
        <div
          aria-hidden="true"
          className="flex justify-end pr-cell"
          style={{ paddingTop: BAND_TOP }}
        >
          {/* Dos elementos anidados a propósito: el reveal escribe `opacity`/`y`
              y la rueda escribe `rotation`. En un solo elemento, GSAP los
              resolvería sobre el mismo `transform` y se pisarían. */}
          <span data-project-fixed className="reveal-init block">
            <span data-project-wheel className="block">
              <BrandMark shape="E" color="coral-light" size={BRANDMARK_CELL_SIZE} />
            </span>
          </span>
        </div>
      }
    >
      {/*
        Titular de apertura, en su propia banda superior.

        Va en un elemento de ancho cero con el texto posicionado en absoluto:
        así ocupa todo el ancho que necesita sin empujar las torres, que corren
        por debajo. Sigue dentro del carril, de modo que se va de pantalla solo
        conforme el usuario avanza; lo que no sigue el carril es su entrada, que
        cuelga del scroll de la página para poder abrir la sección.
      */}
      <div className="relative h-full w-0 shrink-0">
        {/* El posicionamiento pasa al envoltorio: el pre-título y el titular se
            apilan dentro, así que la caja se mide una sola vez y los dos
            comparten borde izquierdo y ancho. */}
        <div className="absolute left-cell" style={{ top: BAND_TOP, width: INTRO_WIDTH }}>
          <p
            data-project-intro
            className="reveal-init mb-3 text-eyebrow uppercase text-foreground-muted"
          >
            {eyebrow}
          </p>

          <h2 data-project-intro className="reveal-init font-display text-h1 text-foreground">
            <RichText value={intro} />
          </h2>
        </div>

        {/* El párrafo de la banda, a la derecha del titular. Lleva la misma
            marca que aquél, así que entra con la apertura de la sección y no
            espera a que el carril lo traiga. */}
        <p
          data-project-intro
          className="reveal-init absolute pt-cell-half text-body text-foreground"
          style={{ top: BAND_TOP, left: INTRO_BODY_LEFT, width: INTRO_BODY_WIDTH }}
        >
          <RichText value={introBody} />
        </p>
      </div>

      {projects.map((project, index) => (
        <div
          key={project.id}
          className="flex h-full shrink-0 flex-col justify-end pb-[8vh]"
          style={{
            paddingInline: STOP_PADDING,
            // La curva va en el envoltorio y el reveal en el hijo: si
            // compartieran elemento, GSAP sobrescribiría el arco al animar `y`.
            transform: `translateY(${curveOffset(index, projects.length)}px)`,
            // El camino no empieza en el borde: la primera torre nace ya
            // cortada por la izquierda. Al ir en la primera parada, arrastra a
            // todas las demás, y `scrollWidth` se reduce en la misma medida, de
            // modo que el recorrido del pin se ajusta solo.
            ...(index === 0
              ? {
                  marginLeft: `calc(-1 * (${CARD_WIDTH} * ${FIRST_STOP_HIDDEN} + ${STOP_PADDING}px))`,
                }
              : null),
          }}
        >
          <ProjectStop project={project} floors={floorsLabel(project)} linkLabel={linkLabel} />
        </div>
      ))}
    </ProjectsScroll>
  )
}

/**
 * Una parada: la foto del proyecto y, encima, su ficha.
 *
 * La ficha se descubre al pasar el ratón **o al enfocar con teclado**
 * (`group-focus-within`): lleva enlaces dentro, y unos enlaces que sólo
 * aparecen con el ratón son enlaces inalcanzables para quien navega tabulando.
 * Es la misma tarjeta de color sólido que el Figma muestra suelta entre las
 * torres, ahora sobre su propia foto.
 *
 * Sólo tiene sentido con `:hover` de verdad — de ahí que la versión móvil
 * (`ProjectsMobile`) no reutilice este componente: ahí la ficha va siempre
 * visible, debajo de la foto y no encima, porque el tacto no tiene hover.
 */
function ProjectStop({
  project,
  floors,
  linkLabel,
}: {
  project: Project
  /** Ya formateado por la interfaz: "20 Pisos". `null` si aún no se sabe. */
  floors: string | null
  linkLabel: (network: SocialNetwork, project: Project) => string
}) {
  return (
    <article
      data-project
      style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
      className="reveal-init group relative shrink-0 overflow-hidden"
    >
      <Image
        src={project.image.url}
        alt={project.image.alt}
        fill
        unoptimized={isVector(project.image.url)}
        sizes={`${CARD.width}px`}
        className="object-cover"
      />

      <div
        className={cn(
          'absolute inset-0 flex flex-col justify-between p-5 text-white',
          'opacity-0 transition-opacity duration-300',
          'group-hover:opacity-100 group-focus-within:opacity-100',
          ACCENT_BG[project.accent],
        )}
      >
        <ProjectMeta project={project} floors={floors} linkLabel={linkLabel} />
      </div>
    </article>
  )
}

/**
 * Nombre, pisos, estado, uso y enlaces de un proyecto — los campos que trae
 * `Project` menos la foto. Compartido entre la ficha de escritorio (encima de
 * la foto, oculta hasta el hover) y la tarjeta móvil (debajo, siempre
 * visible): el contenido es el mismo, sólo cambia el envoltorio que lo
 * muestra.
 */
function ProjectMeta({
  project,
  floors,
  linkLabel,
}: {
  project: Project
  floors: string | null
  linkLabel: (network: SocialNetwork, project: Project) => string
}) {
  const links = (['website', 'instagram', 'linkedin'] as const).filter(
    (network) => project.links[network],
  )

  return (
    <>
      <header className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-h2 leading-none">{project.name}</h3>
        {floors ? <p className="shrink-0 text-label">{floors}</p> : null}
      </header>

      <div className="flex flex-col gap-4">
        <footer className="flex items-end justify-between gap-3 text-label">
          <p>{project.status}</p>
          <p className="text-right">{project.type}</p>
        </footer>

        {links.length > 0 ? (
          <ul className="flex items-center gap-3">
            {links.map((network) => (
              <li key={network}>
                <a
                  href={project.links[network]}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={linkLabel(network, project)}
                  className="grid size-9 place-items-center border border-white/70 transition-colors hover:bg-white hover:text-black focus-visible:bg-white focus-visible:text-black"
                >
                  <SocialIcon network={network} />
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </>
  )
}

/**
 * Versión móvil: la misma apertura y las mismas torres, en flujo normal.
 *
 * La banda de apertura (antetítulo, titular, párrafo) se apila en columna en
 * vez de posicionarse en absoluto contra el ancho de la ventana — eso es lo
 * que en el camino de escritorio hacía que el párrafo cayera encima del
 * isotipo en una pantalla angosta. Las torres van en un `Rail` (el mismo
 * carril de `news`, scroll nativo con flechas) y no en el camino curvo: no
 * hay pin, así que no compite con el gesto de scroll del dedo.
 */
function ProjectsMobile({
  eyebrow,
  intro,
  introBody,
  projects,
  floorsLabel,
  linkLabel,
  labelPrev,
  labelNext,
}: ProjectsData & { labelPrev: string; labelNext: string }) {
  return (
    <ProjectsMobileReveal className="px-cell py-section lg:hidden">
      <p data-reveal className="reveal-init mb-3 text-eyebrow uppercase text-foreground-muted">
        {eyebrow}
      </p>

      <h2 data-reveal className="reveal-init font-display text-h1 text-foreground">
        <RichText value={intro} />
      </h2>

      <p data-reveal className="reveal-init mt-cell-half max-w-prose text-body text-foreground">
        <RichText value={introBody} />
      </p>

      <div data-reveal className="reveal-init mt-cell">
        <Rail labelPrev={labelPrev} labelNext={labelNext} accent="coral-light">
          {projects.map((project) => (
            <ProjectCardMobile
              key={project.id}
              project={project}
              floors={floorsLabel(project)}
              linkLabel={linkLabel}
            />
          ))}
        </Rail>
      </div>
    </ProjectsMobileReveal>
  )
}

/**
 * Una parada del carril móvil: la ficha va siempre visible, debajo de la foto
 * — no hay hover al tacto, así que ocultarla la vuelve inalcanzable (es
 * justo lo que le pasa hoy a la ficha de escritorio en un teléfono).
 */
function ProjectCardMobile({
  project,
  floors,
  linkLabel,
}: {
  project: Project
  floors: string | null
  linkLabel: (network: SocialNetwork, project: Project) => string
}) {
  return (
    <article className="w-[min(70vw,20rem)] shrink-0 snap-start">
      <div className="relative overflow-hidden" style={{ aspectRatio: `${CARD.width} / ${CARD.height}` }}>
        <Image
          src={project.image.url}
          alt={project.image.alt}
          fill
          unoptimized={isVector(project.image.url)}
          sizes="70vw"
          className="object-cover"
        />

        <span aria-hidden="true" className="absolute right-0 top-0 h-cell-mark w-cell-mark-2 bg-surface" />
        <span aria-hidden="true" className="absolute right-0 top-cell-mark size-cell-mark bg-surface" />
      </div>

      <div className={cn('flex flex-col gap-4 p-4 text-white', ACCENT_BG[project.accent])}>
        <ProjectMeta project={project} floors={floors} linkLabel={linkLabel} />
      </div>
    </article>
  )
}
