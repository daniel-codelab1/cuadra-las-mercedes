'use client'

import { useCallback } from 'react'

import { useDrawLine, useScrollReveal } from '@/lib/animation'

/**
 * Cuándo arranca la sección y cuánto espera el trazo.
 *
 * El retardo es lo que ordena la secuencia que pide el diseño: primero entran
 * las cifras y sus textos, y sólo entonces empieza a crecer el tramo de color y
 * a dibujarse el punteado hasta el final de la fila.
 */
const START = 'top 78%'
const DRAW_DELAY = 0.9

/**
 * Envoltorio cliente de la fila de cifras: sostiene las dos animaciones de la
 * sección y nada más. El contenido lo sigue montando el servidor.
 *
 * - `useScrollReveal` entra las cifras, los títulos y las descripciones
 *   (`data-reveal`), escalonados en el orden del DOM: izquierda a derecha.
 * - `useDrawLine` dibuja después los subrayados (`data-draw`) tramo a tramo,
 *   encadenados, de modo que las cuatro tarjetas se leen como un solo camino
 *   recorriendo la fila hasta el final del contenedor.
 */
export function StatsReveal({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'section'>) {
  const revealRef = useScrollReveal<HTMLElement>({ start: START })
  const drawRef = useDrawLine<HTMLElement>({ start: START, delay: DRAW_DELAY })

  // Dos hooks sobre el mismo elemento: cada uno trae su propia ref, así que una
  // callback ref las apunta a las dos en vez de anidar un div de más.
  const setRefs = useCallback(
    (node: HTMLElement | null) => {
      revealRef.current = node
      drawRef.current = node
    },
    [revealRef, drawRef],
  )

  return (
    <section className={className} {...props}>
      {/*
        Las animaciones cuelgan de un envoltorio sin padding y no de la sección:
        el `py-section` mediría casi 200px de aire por arriba, y el trigger se
        dispararía con la fila de cifras todavía por debajo del pliegue.
      */}
      <div ref={setRefs}>{children}</div>
    </section>
  )
}
