'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'

import { prefersReducedMotion } from '@/lib/animation'
import { cn } from '@/lib/cn'

import './CurvedLoop.css'

/** Ancho del lienzo del registro, en unidades del `viewBox`. */
const CANVAS = 1440

/**
 * Cuánto texto se encadena, en unidades del lienzo. Con margen de sobra sobre
 * el ancho visible para que el bucle nunca deje un hueco al envolver.
 */
const RUN = 1800

export type CurvedLoopProps = {
  /** El texto que recorre la curva. Se repite hasta llenarla. */
  marqueeText?: string
  /**
   * Velocidad en unidades del lienzo por segundo.
   *
   * El registro la contaba por fotograma, lo que ata la velocidad a la tasa de
   * refresco: en una pantalla de 120Hz el texto corre al doble que en una de
   * 60. Aquí va por segundo, como el otro marquesina del sitio
   * (`useMarquee`), así que se ve igual en cualquier pantalla.
   */
  speed?: number
  /** Cuánto se comba la línea. 0 la deja recta. */
  curveAmount?: number
  direction?: 'left' | 'right'
  /** Si se puede arrastrar con el puntero para moverlo a mano. */
  interactive?: boolean
  /**
   * Lo que se lee en voz alta. Sin esto, un lector de pantalla recitaría la
   * frase tantas veces como se repita en la curva. Por defecto, el texto una
   * sola vez.
   */
  label?: string
  /** Clases del texto: color y tamaño salen de aquí, no del CSS. */
  className?: string
}

/**
 * Marquesina de texto siguiendo una curva.
 *
 * Portado del registro `CurvedLoop` de React Bits. El mecanismo es el suyo —un
 * `<textPath>` cuyo `startOffset` se desplaza y envuelve—, con cuatro cambios,
 * los cuatro con consecuencias:
 *
 *  - **No re-renderiza en cada fotograma.** El original guardaba el
 *    desplazamiento en estado y llamaba a `setOffset` en cada vuelta del bucle:
 *    un render de React sesenta veces por segundo para un valor que ya se
 *    escribe a mano en el atributo. Aquí el atributo es la única fuente y no
 *    hay estado que actualizar.
 *  - **La velocidad va por segundo, no por fotograma** (ver `speed`).
 *  - **Se para cuando no se ve.** El bucle sólo corre con la banda en pantalla;
 *    fuera, no gasta nada.
 *  - **`prefers-reduced-motion`**: no se mueve, y el texto se queda legible en
 *    su sitio.
 *
 * El color y el tamaño no vienen dados: se pasan por `className` con los tokens
 * del proyecto. El registro traía blanco fijo, que sobre esta página es
 * invisible.
 */
export function CurvedLoop({
  marqueeText = '',
  speed = 60,
  curveAmount = 400,
  direction = 'left',
  interactive = true,
  label,
  className,
}: CurvedLoopProps) {
  // Un espacio duro al final: sin él, las repeticiones se pegan entre sí.
  const text = useMemo(
    () => marqueeText.replace(/\s+$/, '') + ' ',
    [marqueeText],
  )

  const measureRef = useRef<SVGTextElement>(null)
  const textPathRef = useRef<SVGTextPathElement>(null)
  const jacketRef = useRef<HTMLDivElement>(null)

  const [spacing, setSpacing] = useState(0)

  const pathId = `curve-${useId()}`
  const pathD = `M-100,40 Q${CANVAS / 2 - 220},${40 + curveAmount} ${CANVAS + 100},40`

  const dragging = useRef(false)
  const lastX = useRef(0)
  const heading = useRef(direction)
  const velocity = useRef(0)

  const ready = spacing > 0
  const chain = ready
    ? Array(Math.ceil(RUN / spacing) + 2)
        .fill(text)
        .join('')
    : text

  // Cuánto mide una repetición. Hace falta para saber dónde envolver.
  useEffect(() => {
    if (measureRef.current) setSpacing(measureRef.current.getComputedTextLength())
  }, [text, className])

  /**
   * Mueve el texto y lo envuelve al llegar al final de una repetición.
   *
   * Lee y escribe el atributo directamente. Es la única fuente del
   * desplazamiento: no se pasa por JSX, para que un render de React por
   * cualquier otro motivo no lo devuelva a un valor viejo.
   */
  const advance = (delta: number) => {
    const path = textPathRef.current
    if (!path || !spacing) return
    let next = parseFloat(path.getAttribute('startOffset') || '0') + delta
    if (next <= -spacing) next += spacing
    if (next > 0) next -= spacing
    path.setAttribute('startOffset', `${next}px`)
  }

  // Punto de partida: una repetición hacia atrás, de modo que la curva entra
  // ya llena en vez de barrerse desde el borde.
  useEffect(() => {
    if (!spacing || !textPathRef.current) return
    textPathRef.current.setAttribute('startOffset', `${-spacing}px`)
  }, [spacing])

  useEffect(() => {
    const jacket = jacketRef.current
    if (!spacing || !jacket || prefersReducedMotion()) return

    let frame = 0
    let last = 0
    let onScreen = true

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
    })
    observer.observe(jacket)

    const step = (now: number) => {
      // Con un tope: si la pestaña estuvo en segundo plano, el salto acumulado
      // movería el texto de golpe al volver.
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0
      last = now

      if (onScreen && !dragging.current) {
        advance((heading.current === 'right' ? speed : -speed) * dt)
      }
      frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
    // `advance` se recrea en cada render pero sólo lee refs, así que no entra.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spacing, speed])

  const onPointerDown = (e: React.PointerEvent) => {
    if (!interactive) return
    dragging.current = true
    lastX.current = e.clientX
    velocity.current = 0
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!interactive || !dragging.current) return
    const dx = e.clientX - lastX.current
    lastX.current = e.clientX
    velocity.current = dx
    advance(dx)
  }

  const endDrag = () => {
    if (!interactive) return
    dragging.current = false
    // Sigue por donde se soltó, que es lo que hace que el arrastre se sienta
    // con inercia sin necesidad de simularla.
    if (velocity.current !== 0) heading.current = velocity.current > 0 ? 'right' : 'left'
  }

  return (
    <div
      ref={jacketRef}
      className={cn('curved-loop-jacket', interactive && 'cursor-grab active:cursor-grabbing')}
      style={{ visibility: ready ? 'visible' : 'hidden' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      <svg
        className="curved-loop-svg"
        viewBox={`0 0 ${CANVAS} 120`}
        role="img"
        aria-label={label ?? marqueeText}
      >
        {/* Sólo para medir una repetición: nunca se ve. */}
        <text ref={measureRef} xmlSpace="preserve" className={cn('invisible', className)}>
          {text}
        </text>

        <defs>
          <path id={pathId} d={pathD} fill="none" stroke="transparent" />
        </defs>

        {ready ? (
          <text xmlSpace="preserve" className={className}>
            {/* Sin `startOffset` en el JSX: lo escribe el bucle. */}
            <textPath ref={textPathRef} href={`#${pathId}`} xmlSpace="preserve">
              {chain}
            </textPath>
          </text>
        ) : null}
      </svg>
    </div>
  )
}
