import { Arrow, LogoMarquee } from '@/components/ui'
import { getPartners } from '@/content/sections/partners'
import type { Locale } from '@/i18n/routing'

import { PartnersReveal } from './PartnersReveal'

/**
 * Aliados (sección 3 del Figma).
 *
 * Titular estático a la izquierda y carrusel infinito de logos ocupando el
 * resto del ancho. El acento dueño de la sección es `olive`, que es el que el
 * Figma usa para la flecha de este bloque (DESIGN_SYSTEM.md §2).
 */
export function Partners({ locale }: { locale: Locale }) {
  const { title, partners } = getPartners(locale)

  return (
    <PartnersReveal
      id="aliados"
      aria-labelledby="aliados-titulo"
      className="flex flex-col gap-cell py-section pl-cell lg:pl-cell-2 md:flex-row md:items-center md:gap-cell-2"
    >
      <div className="shrink-0 md:w-cell-4">
        <span data-reveal className="reveal-init grid size-8 place-items-center bg-brand-olive">
          <Arrow direction="right" className="size-4 text-white" />
        </span>

        <h2
          id="aliados-titulo"
          data-reveal
          className="reveal-init mt-5 text-lg lg:text-xl text-label uppercase text-foreground"
        >
          {title}
        </h2>
      </div>

      {/*
        `min-w-0` es lo que permite que el carrusel se recorte dentro del flex
        en vez de estirar la fila: sin él, un track más ancho que la pantalla
        desbordaría la página entera.
      */}
      <div data-reveal className="reveal-init min-w-0 flex-1">
        <LogoMarquee partners={partners} />
      </div>
    </PartnersReveal>
  )
}
