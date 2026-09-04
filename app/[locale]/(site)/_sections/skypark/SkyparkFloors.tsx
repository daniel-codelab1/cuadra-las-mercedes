'use client'

import Image from 'next/image'
import { useRef, useState, type CSSProperties } from 'react'

import { ScrollNav } from '@/components/ui'
import type { SkyparkSlide } from '@/content/sections/skypark'
import { ScrollTrigger, useElevator, useGSAP, useLenis } from '@/lib/animation'
import { ACCENT_BG } from '@/lib/accents'
import { cn } from '@/lib/cn'

import { BOXES, COMPOSITION_COLUMNS, COMPOSITION_ROWS, cellBox, cells } from './layout'

/** Píxeles de scroll que consume cada piso mientras la sección está fijada. */
const PX_PER_FLOOR = 700

/**
 * Medidas del archivo de la tira del patrón de marca. Se pinta entera y a la
 * altura del panel, así que el ancho lo deriva su propia proporción.
 */
const TEXTURE = { src: '/brand/iconografia-clm-1.png', width: 108, height: 498 }

/**
 * La celda de esta sección no es la global: se queda con la menor entre la de
 * la grilla (ancho/20) y la que hace que las 10 filas del collage quepan en la
 * ventana. Sin esto, en pantallas bajas la composición se saldría del pin —
 * está medida en celdas justo para poder encogerla entera de una sola vez.
 */
const COMPOSITION_SCALE = {
  '--cell': `min(min(100vw, var(--shell)) / ${COMPOSITION_COLUMNS}, (100dvh - 5rem) / ${COMPOSITION_ROWS})`,
} as CSSProperties

export type SkyparkFloorsProps = {
  slides: SkyparkSlide[]
  /** La foto de cada piso, ya renderizada en el servidor. */
  images: React.ReactNode[]
  /** Un bloque de texto por piso, ya renderizado en el servidor. */
  texts: React.ReactNode[]
  /** Contenido fijo: muescas blancas, párrafo inferior. */
  children?: React.ReactNode
}

/**
 * Sección fijada que avanza por pisos con el scroll vertical.
 *
 * Tres transiciones distintas y deliberadas:
 * - **imagen** y **texto**: ascensor (`useElevator`), suben o bajan según el
 *   sentido del avance.
 * - **panel de color**: sólo cambia de color. Lo resuelve CSS con
 *   `transition-colors` al cambiar la clase, no GSAP — no hay desplazamiento
 *   que animar y así el color sigue saliendo de los tokens de marca.
 *
 * El orden de pintado es el del Figma, de atrás hacia delante: panel de color,
 * foto, rectángulos que le recortan las esquinas, y texto arriba del todo. Las
 * posiciones salen todas de `layout.ts`.
 */
export function SkyparkFloors({ slides, images, texts, children }: SkyparkFloorsProps) {
  const [active, setActive] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const triggerRef = useRef<ScrollTrigger | null>(null)
  const getLenis = useLenis()

  const imageStack = useElevator<HTMLDivElement>(active)
  const textStack = useElevator<HTMLDivElement>(active)

  const count = slides.length

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section || count < 2) return

      triggerRef.current = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${(count - 1) * PX_PER_FLOOR}`,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        // Sin `scrub`: el avance es discreto. El progreso sólo elige qué piso
        // toca; la transición entre ellos la lleva el ascensor a su ritmo.
        onUpdate: (self) => {
          setActive(Math.round(self.progress * (count - 1)))
        },
      })

      return () => {
        triggerRef.current?.kill()
        triggerRef.current = null
      }
    },
    { scope: sectionRef, dependencies: [count] },
  )

  /**
   * Las flechas no cambian el estado directamente: desplazan la página hasta la
   * posición de scroll de ese piso, y de ahí el `onUpdate` deriva el índice.
   * Cambiar el estado a mano dejaría la posición de scroll desincronizada y el
   * siguiente gesto de rueda daría un salto.
   */
  const goTo = (index: number) => {
    const trigger = triggerRef.current
    if (!trigger) return

    const clamped = Math.max(0, Math.min(count - 1, index))
    const target = trigger.start + (clamped / (count - 1)) * (trigger.end - trigger.start)

    const lenis = getLenis()
    if (lenis) lenis.scrollTo(target)
    else window.scrollTo({ top: target, behavior: 'smooth' })
  }

  return (
    <section
      ref={sectionRef}
      id="skypark"
      style={COMPOSITION_SCALE}
      className="relative grid h-dvh place-items-center overflow-hidden"
    >
      {/* Marco de la composición: 20 × 10 celdas, centrado. Todo lo de dentro
          se posiciona contra sus bordes. */}
      <div
        className="relative"
        style={{ width: cells(COMPOSITION_COLUMNS), height: cells(COMPOSITION_ROWS) }}
      >
        {/* Panel de color, detrás de todo. Sólo transiciona el color.
            Sangra hasta el borde derecho de la ventana: en el Figma el verde
            se sale del marco. */}
        <div
          aria-hidden="true"
          // `right` sale del marco centrado hasta el borde de la ventana:
          // 50% es medio marco y 50vw media ventana.
          style={{ ...cellBox(BOXES.panel), right: 'calc(50% - 50vw)' }}
          className={cn(
            'absolute z-0 transition-colors duration-700',
            ACCENT_BG[slides[active].accent],
          )}
        >
          {/* Tira del patrón de marca (DESIGN_SYSTEM.md §7), pegada al lado
              derecho del panel. Se pinta una sola vez y entera: toma el alto
              del panel y el ancho se lo da su propia proporción, así que el
              patrón nunca se corta ni se repite. */}
          <Image
            src={TEXTURE.src}
            alt=""
            width={TEXTURE.width}
            height={TEXTURE.height}
            sizes="200px"
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 h-full w-auto opacity-[0.07]"
          />

          {/* Dos cuadros de una celda que muerden la esquina inferior derecha
              del panel, a la misma altura: uno pegado a su borde derecho —que
              sangra hasta el borde de la ventana— y otro pegado al costado de
              la foto. Van dentro del panel, y no con las demás muescas del
              marco, porque el de la derecha tiene que seguir a ese borde que
              sangra; el otro deriva su posición de la caja de la foto. */}
          <div className="absolute bottom-0 right-0 size-cell bg-surface" />
          <div
            className="absolute bottom-0 size-cell bg-surface"
            style={{ left: cells(BOXES.photo.x + BOXES.photo.w - BOXES.panel.x) }}
          />
        </div>

        {/* La foto de cada piso, por delante del panel. Ascensor. */}
        <div ref={imageStack} className="absolute inset-0 z-10 grid overflow-hidden">
          {images.map((image, index) => (
            <div
              key={slides[index].id}
              aria-hidden={index !== active}
              inert={index !== active}
              className="relative col-start-1 row-start-1"
            >
              {image}
            </div>
          ))}
        </div>

        {/*
          Rectángulo del color del panel sobre la esquina superior derecha de
          la foto: es lo que despeja el sitio del texto. Va fuera del panel
          —que es un contexto de apilado propio— para poder quedar por delante
          de la foto, y repite su misma transición de color.
        */}
        <div
          aria-hidden="true"
          style={cellBox(BOXES.photoCorner)}
          className={cn(
            'absolute z-20 transition-colors duration-700',
            ACCENT_BG[slides[active].accent],
          )}
        />

        {/* Muesca blanca y párrafo fijo. */}
        {children}

        {/* Texto sobre el panel. Ascensor. */}
        <div
          ref={textStack}
          style={cellBox(BOXES.text)}
          className="absolute z-30 grid overflow-hidden"
        >
          {texts.map((text, index) => (
            <div
              key={slides[index].id}
              aria-hidden={index !== active}
              inert={index !== active}
              className="col-start-1 row-start-1"
            >
              {text}
            </div>
          ))}
        </div>

        {/* Navegación manual entre pisos. */}
        <div className="absolute z-40" style={cellBox(BOXES.nav)}>
          <ScrollNav
            size="sm"
            className="gap-cell-half"
            onPrev={() => goTo(active - 1)}
            onNext={() => goTo(active + 1)}
            prevDisabled={active === 0}
            nextDisabled={active === count - 1}
          />
        </div>
      </div>
    </section>
  )
}
