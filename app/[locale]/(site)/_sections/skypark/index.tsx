import Image from 'next/image'

import { RichText } from '@/components/ui'
import { getSkypark, type SkyparkSlide } from '@/content/sections/skypark'
import type { Locale } from '@/i18n/routing'
import { isVector } from '@/lib/media'

import { BOXES, TYPE, cellBox, cells, type CellBox } from './layout'
import { SkyparkFloors } from './SkyparkFloors'

/**
 * Cuadros de una celda en color de fondo sobre dos esquinas opuestas de la
 * foto. Se derivan de la caja de la foto en vez de escribirse a mano: si la
 * foto se mueve o cambia de tamaño, las esquinas la siguen.
 */
const PHOTO_SQUARES: CellBox[] = [
  { x: BOXES.photo.x, y: BOXES.photo.y, w: 1, h: 1 },
  { x: BOXES.photo.x + BOXES.photo.w - 1, y: BOXES.photo.y + BOXES.photo.h - 1, w: 1, h: 1 },
]

/**
 * Torre Skypark (sección 7 del Figma).
 *
 * Sección fijada que avanza por pisos: al hacer scroll cambian la foto, el
 * color del panel de fondo y el texto que va encima. Las flechas de la
 * izquierda permiten recorrerla a mano.
 *
 * Los paneles se renderizan en el servidor y se le pasan montados al componente
 * cliente, que sólo lleva el estado del piso y las animaciones. La geometría
 * —común a servidor y cliente— vive en `layout.ts`.
 */
export function Skypark({ locale }: { locale: Locale }) {
  const { slides, footnote } = getSkypark(locale)

  return (
    <SkyparkFloors
      slides={slides}
      images={slides.map((slide) => (
        <SlidePhoto key={slide.id} slide={slide} />
      ))}
      texts={slides.map((slide) => (
        <SlideText key={slide.id} slide={slide} />
      ))}
    >
      {/*
        Recortes en color de fondo sobre la foto: el bloque que despeja el
        párrafo de abajo a la izquierda y los dos cuadros de una celda de las
        esquinas superior izquierda e inferior derecha. Todos en `surface`, para
        que sigan al tema, y por delante de la foto pero por detrás del texto.
      */}
      {[BOXES.photoNotch, ...PHOTO_SQUARES].map((box, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="pointer-events-none absolute z-20 bg-surface"
          style={cellBox(box)}
        />
      ))}

      {/* Párrafo fijo, abajo a la izquierda. No entra en el ascensor. */}
      <p
        className="absolute z-30 text-body text-foreground"
        style={{ ...cellBox(BOXES.footnote), fontSize: cells(TYPE.body) }}
      >
        <RichText value={footnote} />
      </p>
    </SkyparkFloors>
  )
}

/**
 * La foto del piso: un solo bloque grande por delante del panel de color.
 *
 * Se recorta con `object-cover` dentro de su caja, así que la fuente puede
 * tener cualquier proporción sin descuadrar la composición ni el alto de los
 * demás pisos.
 */
function SlidePhoto({ slide }: { slide: SkyparkSlide }) {
  return (
    <div className="absolute overflow-hidden" style={cellBox(BOXES.photo)}>
      <Image
        src={slide.image.url}
        alt={slide.image.alt}
        fill
        unoptimized={isVector(slide.image.url)}
        sizes="60vw"
        className="object-cover"
      />
    </div>
  )
}

function SlideText({ slide }: { slide: SkyparkSlide }) {
  return (
    <div className="text-white">
      <h2 className="font-display text-h2" style={{ fontSize: cells(TYPE.title) }}>
        {slide.title}
      </h2>
      <p
        className="text-body text-white/85"
        style={{ fontSize: cells(TYPE.body), marginTop: cells(TYPE.gap) }}
      >
        <RichText value={slide.body} />
      </p>
    </div>
  )
}
