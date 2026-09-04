import Image from 'next/image'

import { RichText } from '@/components/ui'
import {
  getSkyparkColumns,
  type SkyparkCell,
  type SkyparkColumn,
} from '@/content/sections/skyparkColumns'
import type { Locale } from '@/i18n/routing'
import { ACCENT_BG } from '@/lib/accents'
import { cn } from '@/lib/cn'
import { isVector } from '@/lib/media'

import { SkyparkColumnsScroll } from './SkyparkColumnsScroll'

/** Columnas de la composición. Fijo por diseño: siempre son tres. */
const COLUMNS = 3

/**
 * Torre Skypark — segunda versión, en tres columnas con ascensor.
 *
 * Tres columnas iguales que ocupan la pantalla. Cualquiera de ellas puede ir a
 * toda altura o partida en tres filas, y eso cambia de un estado a otro: al
 * hacer scroll, cada columna sube su contenido un piso.
 *
 * Toda la composición vive en `content/sections/skyparkColumns.ts` —qué celda
 * va en cada sitio, de qué color y con qué texto—, así que reordenarla no toca
 * este archivo. Aquí sólo se decide cómo se pinta una celda.
 *
 * Convive con la sección `skypark` original mientras se decide cuál se queda.
 */
export function SkyparkColumns({ locale }: { locale: Locale }) {
  const { states } = getSkyparkColumns(locale)

  // El componente cliente mueve un carril por columna, así que el contenido se
  // le entrega ya girado: `stacks[columna][estado]` en vez de por estados.
  const stacks = Array.from({ length: COLUMNS }, (_, column) =>
    states.map((state, index) => <ColumnStack key={index} column={state[column]} />),
  )

  return (
    <SkyparkColumnsScroll
      id="skypark-columnas"
      // Con reduced-motion no hay pin: la composición se queda quieta en su
      // primer estado y la sección deja de comerse la pantalla entera.
      className="relative h-dvh motion-reduce:h-auto motion-reduce:min-h-dvh"
      stacks={stacks}
    />
  )
}

/**
 * Una columna dentro de un estado: una celda a toda altura o tres filas
 * iguales.
 *
 * El reparto sale de cuántas celdas traiga el contenido, no de una bandera: una
 * celda ocupa el alto entero y tres se reparten en tercios. Así el contenido
 * puede cambiar de un caso a otro sin tocar el componente.
 */
function ColumnStack({ column }: { column: SkyparkColumn }) {
  return (
    <div className="grid h-full w-full" style={{ gridTemplateRows: `repeat(${column.cells.length}, 1fr)` }}>
      {column.cells.map((cell, index) => (
        // `data-piece` marca lo que se destapa al entrar: cada celda por
        // separado, de modo que una columna partida se descubre fila a fila.
        <div key={index} data-piece className="relative overflow-hidden">
          <Cell cell={cell} />
        </div>
      ))}
    </div>
  )
}

function Cell({ cell }: { cell: SkyparkCell }) {
  if (cell.kind === 'media') {
    const { media } = cell

    // `data-media` es lo que arranca desenfocado y se define al entrar.
    return media.type === 'image' ? (
      <Image
        data-media
        src={media.image.url}
        alt={media.image.alt}
        fill
        unoptimized={isVector(media.image.url)}
        sizes="34vw"
        className="object-cover"
      />
    ) : (
      <video
        data-media
        src={media.src}
        poster={media.poster?.url}
        aria-label={media.alt}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="size-full object-cover"
      />
    )
  }

  return (
    <div
      className={cn(
        'flex h-full w-full flex-col justify-end p-cell text-white',
        ACCENT_BG[cell.accent],
      )}
    >
      {cell.title ? <h2 className="font-display text-h2">{cell.title}</h2> : null}

      {cell.body ? (
        <p className="mt-cell-half text-body text-white/85">
          <RichText value={cell.body} />
        </p>
      ) : null}
    </div>
  )
}
