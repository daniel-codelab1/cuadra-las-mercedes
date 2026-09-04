import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import { BackgroundVideo, Button, RichText, ScrollExpand } from '@/components/ui'
import { getBulevar } from '@/content/sections/bulevar'
import type { Locale } from '@/i18n/routing'


/**
 * "Se activa con el Bulevar Tolón".
 *
 * Bloque que se abre con el scroll: el medio arranca recortado en el centro de
 * la pantalla, con el nombre de la marca encima, y crece hasta llenarla; al
 * final entra el titular y el párrafo.
 *
 * El fondo es un `MediaSlide`, así que admite foto o vídeo y la decisión vive
 * en `content/`, no aquí. Hoy es vídeo; volver a una foto es cambiar el campo
 * `media` del contenido, sin tocar esta sección.
 *
 * El recorrido lo lleva `ScrollExpand` (`components/ui`), que es de cliente;
 * esta sección se queda en el servidor y sólo le pasa el contenido ya
 * vestido con los tokens. El texto va en blanco fijo, no themeable: cae
 * siempre sobre la foto oscurecida por el degradado, como el footer
 * (DESIGN_SYSTEM.md §6).
 */
export async function Bulevar({ locale }: { locale: Locale }) {
  const { title, heading, body, cta, media } = getBulevar(locale)
  const t = await getTranslations('Bulevar')

  return (
    <ScrollExpand
      id="bulevar"
      // El recorrido lo marca la página, así que Lenis ya entrega la posición
      // interpolada y el componente no vuelve a suavizarla (`smoothing` a 0 por
      // defecto; ver la cabecera de ScrollExpand).
      useWindowScroll
      media={
        media.type === 'image' ? (
          <Image
            src={media.image.url}
            alt={media.image.alt}
            fill
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <BackgroundVideo src={media.src} poster={media.poster?.url} alt={media.alt} />
        )
      }
      // Escalón de bloques mordiendo las dos esquinas inferiores: una pieza de
      // 2×1 celdas a ras del suelo y otra de 1×1 encima, contra el borde. Van
      // en `surface`, que es el tratamiento del kit para bloques que recortan
      // la esquina de una foto (DESIGN_SYSTEM.md §4, composición de Skypark):
      // se leen como si la página se comiera el vídeo, y cambian con el tema.
      //
      // `frameDecor` los alinea con el recuadro visible y los enciende al final
      // del recorrido, con el medio ya descubierto.
      frameDecor={
        <>
          <span className="absolute bottom-0 left-0 h-cell-mark w-cell-mark-2 bg-surface" />
          <span className="absolute bottom-cell-mark left-0 size-cell-mark bg-surface" />

          <span className="absolute bottom-0 right-0 h-cell-mark w-cell-mark-2 bg-surface" />
          <span className="absolute bottom-cell-mark right-0 size-cell-mark bg-surface" />
        </>
      }
      // El botón no entra con el párrafo: espera a que el recorrido termine y
      // el medio esté abierto del todo, y sube durante el tramo en el que la
      // sección sigue fijada. Al ir ligado al scroll, se va solo al subir.
      // Secundario de la sección: el naranja queda para el CTA principal
      // (DESIGN_SYSTEM.md §4).
      holdContent={
        <Button href={cta.href} accent="steel-blue" className="mt-cell-half">
          {cta.label}
        </Button>
      }
      // `text-statement` y no `text-7xl` (72px fijos): a 390px el rótulo tocaba
      // el padding del 6% de los dos lados sin ningún aire — es el mismo token
      // fluido que usa `hub` para su frase sobre el plano, el papel más
      // parecido que hay ya tokenizado a "declaración grande sobre una foto".
      title={
        <span className="font-display text-5xl lg:text-statement font-bold [text-shadow:0_2px_3px_rgba(0,0,0,0.7)] text-white">
          {title}
        </span>
      }
      scrollHint={<span className="text-label text-white/60">{t('scrollHint')}</span>}
    >
      {/* `text-statement`, no `text-6xl` (60px fijos): en 390px envolvía a tres
          líneas de texto muy pesado. Mismo token que el rótulo de arriba —los
          dos ocupan el mismo papel, uno tras otro, nunca a la vez—. */}
      <h2 className="font-display text-3xl lg:text-statement [text-shadow:0_2px_3px_rgba(0,0,0,0.7)] font-bold text-white">
        {heading}
      </h2>

      {/* `text-body`, no `text-md`: esa clase no existe en Tailwind —el token
          de cuerpo de este proyecto es `body`, no `md`— así que no hacía nada
          y el párrafo tomaba los 17px por herencia de un ancestro. `text-body`
          es exactamente ese mismo valor (1.0625rem), puesto donde se ve. */}
      <p className="mt-cell-half [text-shadow:0_2px_2px_rgba(0,0,0,0.7)] max-w-2xl text-body lg:text-lg text-white">
        <RichText value={body} />
      </p>

    </ScrollExpand>
  )
}
