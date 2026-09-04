'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import type { Accent } from '@/lib/accents'

import { ScrollNav } from './ScrollNav'

export type RailProps = {
  children: React.ReactNode
  /**
   * El titular de la sección, ya montado en el servidor, junto a las flechas.
   * Se omite cuando el titular ya vive fuera del carril —caso de la versión
   * móvil de `projects`, que trae su propia banda de apertura por encima—: las
   * flechas pasan solas a la derecha, sin la fila que las reparte con él.
   */
  heading?: React.ReactNode
  labelPrev: string
  labelNext: string
  /** Color de las flechas. Cada sección trae el suyo. */
  accent?: Accent
}

/** Margen para dar por llegado un extremo, en píxeles. */
const EDGE = 8

/** Hueco entre tarjetas, en píxeles. Tiene que coincidir con el `gap` del carril. */
const GAP = 24

/**
 * Carril horizontal de tarjetas con flechas.
 *
 * El desplazamiento es **scroll nativo**, no un tren de `transform`: así el
 * carril se recorre con el trackpad, con arrastre táctil y con el teclado sin
 * escribir nada de eso, y el ajuste a cada tarjeta lo da `scroll-snap` del CSS.
 * Las flechas sólo llaman a `scrollBy`.
 *
 * El salto es el ancho de una tarjeta real, medido del DOM: escrito a mano
 * dejaría de cuadrar en cuanto la tarjeta cambie de tamaño con la ventana.
 *
 * Compartido entre `news` y la versión móvil de `projects`: es el mismo
 * carril en los dos sitios, sin nada propio de ninguna sección — de ahí que
 * viva en `components/ui` y no dentro de una carpeta de sección.
 */
export function Rail({ children, heading, labelPrev, labelNext, accent = 'coral' }: RailProps) {
  const railRef = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const sync = useCallback(() => {
    const rail = railRef.current
    if (!rail) return
    const max = rail.scrollWidth - rail.clientWidth
    setAtStart(rail.scrollLeft <= EDGE)
    // Si todo cabe, no hay a dónde ir: las dos flechas se apagan.
    setAtEnd(max <= EDGE || rail.scrollLeft >= max - EDGE)
  }, [])

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return

    sync()
    rail.addEventListener('scroll', sync, { passive: true })

    // También al cambiar de tamaño: el carril puede pasar a caber entero, y
    // entonces las flechas tienen que apagarse solas.
    const observer = new ResizeObserver(sync)
    observer.observe(rail)

    return () => {
      rail.removeEventListener('scroll', sync)
      observer.disconnect()
    }
  }, [sync])

  const step = (direction: 1 | -1) => {
    const rail = railRef.current
    if (!rail) return
    const card = rail.firstElementChild as HTMLElement | null
    const amount = card ? card.offsetWidth + GAP : rail.clientWidth * 0.8
    rail.scrollBy({ left: amount * direction, behavior: 'smooth' })
  }

  return (
    <>
      <div className={heading ? 'flex items-start justify-between gap-cell' : 'flex justify-end'}>
        {heading}

        <ScrollNav
          orientation="horizontal"
          accent={accent}
          size="sm"
          onPrev={() => step(-1)}
          onNext={() => step(1)}
          prevDisabled={atStart}
          nextDisabled={atEnd}
          labelPrev={labelPrev}
          labelNext={labelNext}
          className="shrink-0"
        />
      </div>

      {/*
        `-mx-cell px-cell` saca el carril del aire lateral de la sección para
        que las tarjetas puedan sangrar hasta el borde, y devuelve ese aire como
        relleno para que la primera arranque alineada con el titular.

        `scroll-pl-cell` es obligatorio junto al sangrado: sin él, el `snap-start`
        de la primera tarjeta se alinea con el borde del contenedor y se come
        ese relleno de entrada, así que el carril arranca ya desplazado una
        celda y la flecha de retroceso nace encendida.

        La barra se oculta pero el carril sigue siendo un contenedor de scroll
        de verdad: teclado, trackpad y arrastre táctil funcionan solos.
      */}
      <div
        ref={railRef}
        className="scrollbar-none -mx-cell mt-cell flex snap-x snap-mandatory scroll-pl-cell gap-6 overflow-x-auto px-cell pb-2"
      >
        {children}
      </div>
    </>
  )
}
