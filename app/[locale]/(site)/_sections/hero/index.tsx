import Image from 'next/image'
import { getFormatter } from 'next-intl/server'

import { Arrow, Button, MediaCarousel, RichText } from '@/components/ui'
import { getHero } from '@/content/sections/hero'
import type { Locale } from '@/i18n/routing'
import { isVector } from '@/lib/media'

import { HeroReveal } from './HeroReveal'

/**
 * Hero (sección 2 del Figma).
 *
 * Columna izquierda: antetítulo + titular tecleado + ficha de ubicación +
 * párrafo + CTA. Columna derecha: collage de medios, con el bloque principal
 * como carrusel que admite foto o vídeo.
 *
 * Excepción documentada a "un acento por sección": el diseño aprobado usa
 * coral (flecha), olive (fecha de inicio), steel-blue (parche) y orange (CTA).
 * Ver DESIGN_SYSTEM.md §2.
 */
export async function Hero({ locale }: { locale: Locale }) {
  const hero = getHero(locale)
  const format = await getFormatter()

  // La fecha se guarda en ISO y el idioma decide cómo se lee: en español sale
  // 09/06/2026 y en inglés 06/09/2026, que es junio 9 en ambos casos.
  const projectStartDate = new Date(`${hero.projectStart.date}T00:00:00`)

  return (
    <HeroReveal className="grid items-start gap-cell-1 pb-cell pt-cell-2 md:pt-cell pl-cell pr-cell md:pl-cell-2 md:pr-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      {/* ---------------------------------------------------------------- */}
      {/* Columna izquierda                                                 */}
      {/* ---------------------------------------------------------------- */}
      <div className="pb-cell-2 pt-cell-2 lg:pb-0 lg:pt-cell">
        <div className="flex items-center gap-4">
          <p
            data-hero="eyebrow"
            className="reveal-init text-label text-body lg:text-lg uppercase text-foreground-muted"
          >
            {hero.eyebrow}
          </p>
          <span
            data-hero="arrow"
            className="reveal-init grid size-8 shrink-0 place-items-center bg-brand-coral"
          >
            <Arrow direction="down" className="size-4 text-white" />
          </span>
        </div>

        {/*
          El titular se parte en caracteres para poder teclearlo. Se agrupa por
          palabras para que la línea siga pudiendo romper en los espacios, y el
          `aria-label` devuelve el texto entero a los lectores de pantalla.
        */}
        <h1
          aria-label={hero.title}
          className="mt-3 lg:mt-5 font-display text-5xl font-bold lg:text-display leading-[0.9] text-foreground"
        >
          {hero.title.split(' ').map((word, wordIndex) => (
            <span key={wordIndex} aria-hidden="true">
              {wordIndex > 0 ? ' ' : null}
              <span className="inline-block">
                {Array.from(word).map((char, charIndex) => (
                  <span key={charIndex} data-hero="char" className="reveal-init inline-block">
                    {char}
                  </span>
                ))}
              </span>
            </span>
          ))}
          {/* Oculto de partida: sólo lo muestra la línea de tiempo mientras teclea. */}
          <span data-hero="caret" aria-hidden="true" className="type-caret hidden" />
        </h1>

        <div className="mt-cell-2 lg:mt-cell pr-0 lg:pr-cell-2">
          <div className="flex flex-wrap gap-x-cell-2 gap-y-2">
            {hero.labels.map((label) => (
              <p key={label} data-hero="item" className="reveal-init text-xs lg:text-sm text-label uppercase text-gray-400">
                {label}
              </p>
            ))}
          </div>
          <hr
            data-hero="rule"
            className="reveal-init mt-3 origin-left border-t border-foreground/15"
          />
        </div>

        <p data-hero="item" className="reveal-init mt-cell-2 lg:mt-cell max-w-full lg:max-w-[80%] text-sm lg:text-body text-foreground">
          <RichText value={hero.body} />
        </p>

        <div data-hero="item" className="reveal-init mt-cell">
          <Button href={hero.cta.href}>{hero.cta.label}</Button>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Columna derecha: collage                                          */}
      {/* ---------------------------------------------------------------- */}
      <div>
        <div data-hero="media" className="reveal-init relative">
          <MediaCarousel
            slides={hero.media}
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="aspect-[1] lg:aspect-[16/11] w-full"
          />

          {/*
            Muesca blanca que recorta la esquina superior izquierda: es el
            "escalón" del collage, no un margen. Va sobre el carrusel.
          */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-cell-mark h-cell-mark-3 w-0 md:w-cell-mark-2 bg-surface"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-[calc(var(--cell-mark)*4)] h-cell-mark w-0 md:w-cell-mark bg-surface"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 h-cell-mark w-cell-mark-2 bg-surface"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-cell-mark h-cell-mark w-cell-mark bg-surface"
          />

          {/* Parche steel-blue sobre la foto. */}
          <div
            data-hero="patch"
            aria-hidden="true"
            className="reveal-init absolute bottom-0 left-cell-mark-3 hidden h-cell-mark w-cell-mark-2 bg-brand-steel-blue sm:block"
          />

        </div>

        {/*
          Fila de dos bloques inmediatamente debajo de la imagen: la fecha de
          inicio y el pie de foto.

          `items-stretch` es lo que hace que el bloque olive tome el alto del
          pie de foto; sin eso sólo mediría lo que su texto, y la imagen de
          dentro no tendría un alto de contenedor que abarcar.
        */}
        <div className="flex flex-col items-stretch gap-cell sm:flex-row sm:items-center sm:gap-6">
          <div
            data-hero="meta"
            className="reveal-init flex shrink-0 items-stretch bg-brand-olive text-white"
          >
            <div className="min-w-full lg:min-w-cell-3 text-center px-cell lg:px-6 py-4 lg:py-8">
              <p className="text-label text-xs uppercase leading-tight">{hero.projectStart.label}</p>
              <time
                dateTime={hero.projectStart.date}
                className="font-display text-body lg:text-xl leading-tight"
              >
                {format.dateTime(projectStartDate, {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </time>
            </div>

            {/*
              Imagen pegada al borde derecho, desde arriba y a todo el alto del
              bloque. Es el último hijo de un flex `items-stretch`, así que se
              alinea sola sin necesidad de posicionamiento absoluto —y sin poder
              solaparse con el texto. PENDIENTE del asset.
            */}
            {hero.projectStart.image ? (
              <Image
                src={hero.projectStart.image.url}
                alt={hero.projectStart.image.alt}
                width={hero.projectStart.image.width}
                height={hero.projectStart.image.height}
                unoptimized={isVector(hero.projectStart.image.url)}
                sizes="(min-width: 640px) 15vw, 40vw"
                className="h-full w-auto self-stretch"
              />
            ) : null}
          </div>

          <p data-hero="meta" className="reveal-init flex-1 text-sm text-foreground">
            <RichText value={hero.caption} />
          </p>
        </div>
      </div>
    </HeroReveal>
  )
}
