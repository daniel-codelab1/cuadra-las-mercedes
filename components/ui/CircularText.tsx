'use client'

import { useRef } from 'react'

import { ACCENT_TEXT, type Accent } from '@/lib/accents'
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/animation'
import { cn } from '@/lib/cn'

/**
 * Qué le pasa al giro al poner el ratón encima, como múltiplo de la velocidad
 * de crucero.
 *
 * El registro de React Bits lo expresaba en duraciones (`spinDuration / 4`,
 * `* 2`, `/ 20`); aquí van como velocidad porque es lo que se le pide a
 * `timeScale`, y porque así se lee de un vistazo cuál acelera y cuál frena.
 */
const HOVER_SPEED = {
  slowDown: 0.5,
  speedUp: 4,
  pause: 0,
  goBonkers: 20,
} as const

/**
 * Cuánto crece o encoge el anillo al poner el ratón encima.
 *
 * Es independiente de la velocidad —`setSpeed` anima las dos cosas—, así que
 * cada preset puede combinarlas a su gusto: `speedUp` acelera y se abre un
 * poco, y `goBonkers` se dispara y encoge, que es lo que le da el punto de
 * broma. Al ser `scale` no toca el layout: el anillo crece sobre lo que tenga
 * al lado sin empujarlo.
 */
const HOVER_SCALE = {
  slowDown: 1,
  speedUp: 1.06,
  pause: 1,
  goBonkers: 0.8,
} as const

export type CircularTextHover = keyof typeof HOVER_SPEED

/**
 * Tamaño de letra como fracción del diámetro. El registro traía 0,12 (24px
 * sobre un anillo de 200).
 *
 * Va aquí y no en los tokens de tipografía a propósito: es geometría del
 * círculo, no un escalón de la escala tipográfica. Si el cuerpo no acompaña al
 * diámetro, las letras se solapan o dejan un hueco entre ellas.
 *
 * El techo lo marca el hueco que le toca a cada carácter: con N caracteres
 * repartidos en la circunferencia, cada uno dispone de `2π·radio / N`. Pasado
 * eso, los glifos se tocan.
 */
const FONT_RATIO = 0.155

/**
 * Cuánto más grande que una letra se pinta un separador.
 *
 * Va como múltiplo y no como fracción del diámetro para que los dos cuerpos se
 * muevan juntos: al cambiar `size` o `FONT_RATIO`, el `*` conserva su
 * proporción con el texto en vez de descolgarse. Por eso se aplica en `em`.
 */
const SEPARATOR_SCALE = .9

/** Lo que tarda el anillo en acomodarse a la velocidad nueva, en segundos. */
const HOVER_EASE_IN = 0.4

export type CircularTextProps = {
  /** El texto que da la vuelta, separadores incluidos: `CUADRA*LAS*MERCEDES*`. */
  text: string
  /**
   * Carácter que hace de separador entre palabras. Se pinta con el color de
   * acento en vez de con el del texto, que es lo que le da el aire de sello.
   * Un solo carácter: el anillo se recorre letra a letra.
   */
  separator?: string
  /** Color de los separadores. */
  accent?: Accent
  /** Cuánto más grande que una letra se pinta un separador. */
  separatorScale?: number
  /** Diámetro del anillo, en píxeles. */
  size?: number
  /** Segundos que tarda en dar una vuelta completa. */
  spinDuration?: number
  /** Qué hace el giro al pasar el ratón. `undefined` para que no haga nada. */
  onHover?: CircularTextHover
  /**
   * Lo que se lee en voz alta. Sin esto, un lector de pantalla deletrearía el
   * anillo letra a letra, asteriscos incluidos. Por defecto, el texto con los
   * separadores convertidos en espacios.
   */
  label?: string
  className?: string
}

/**
 * Texto de marca dispuesto en círculo, girando sobre su eje.
 *
 * Portado del registro `CircularText` de React Bits
 * (https://reactbits.dev/text-animations/circular-text). El reparto de las
 * letras es el del original; lo que cambia es el motor: el registro anima con
 * `motion`, y aquí gira con GSAP, que ya está cargado en todas las páginas del
 * sitio. Dos consecuencias, las dos buenas:
 *
 *  - No entra un segundo runtime de animación en el bundle.
 *  - El cambio de velocidad al pasar el ratón es `timeScale` sobre el giro en
 *    curso, así que el anillo acelera desde donde está. El original relanza el
 *    tween (`rotate: start + 360`) en cada entrada y salida del ratón.
 *
 * Con `prefers-reduced-motion` no gira ni reacciona al ratón: se queda quieto,
 * legible, que es lo que hace falta.
 */
export function CircularText({
  text,
  separator = '✦',
  accent = 'coral',
  separatorScale = SEPARATOR_SCALE,
  size = 280,
  spinDuration = 20,
  onHover = 'speedUp',
  label,
  className,
}: CircularTextProps) {
  const ref = useRef<HTMLDivElement>(null)

  const letters = Array.from(text)

  // El giro y el hover viven juntos aquí dentro, y no en props `onMouseEnter`
  // del JSX, por dos motivos: el tween se queda en una variable local —nada de
  // refs leídas durante el render, que es lo que prohíbe `react-hooks/refs`— y
  // los listeners se quitan solos, porque `gsap.context` respeta la función de
  // limpieza que se le devuelva.
  useGSAP(
    () => {
      const el = ref.current
      if (!el || prefersReducedMotion()) return

      // De 0 a 360 y vuelta a empezar: como los dos extremos son la misma
      // posición, el ciclo cierra sin salto y no hace falta acumular ángulo.
      const spin = gsap.to(el, {
        rotation: 360,
        duration: spinDuration,
        ease: 'none',
        repeat: -1,
      })

      if (!onHover) return

      const setSpeed = (speed: number, scale: number) => {
        // Se anima el `timeScale` del propio tween, no su duración: el anillo
        // cambia de ritmo desde el ángulo en el que va, sin cortarse.
        gsap.to(spin, { timeScale: speed, duration: HOVER_EASE_IN, ease: 'power2.out' })
        gsap.to(el, { scale, duration: HOVER_EASE_IN, ease: 'power2.out' })
      }

      const enter = () => setSpeed(HOVER_SPEED[onHover], HOVER_SCALE[onHover])
      const leave = () => setSpeed(1, 1)

      el.addEventListener('mouseenter', enter)
      el.addEventListener('mouseleave', leave)

      return () => {
        el.removeEventListener('mouseenter', enter)
        el.removeEventListener('mouseleave', leave)
      }
    },
    { scope: ref, dependencies: [spinDuration, onHover], revertOnUpdate: true },
  )

  return (
    <div
      ref={ref}
      role="img"
      aria-label={label ?? letters.join('').split(separator).filter(Boolean).join(' ')}
      className={cn(
        'relative select-none text-center font-display font-bold text-foreground',
        className,
      )}
      style={{ width: size, height: size, fontSize: size * FONT_RATIO }}
    >
      {letters.map((letter, index) => {
        // Reparto tal cual lo calcula el registro: un ángulo por letra y un
        // desplazamiento mínimo que compensa el ancho del glifo. Cada `span`
        // ocupa el círculo entero y se centra por `text-align`, de modo que la
        // letra cae arriba del todo y el giro la lleva a su sitio.
        const angle = (360 / letters.length) * index
        const nudge = (Math.PI / letters.length) * index
        const transform = `rotateZ(${angle}deg) translate3d(${nudge}px, ${nudge}px, 0)`
        const isSeparator = letter === separator

        return (
          <span
            key={index}
            className={cn(
              // `leading-none` es lo que permite mezclar dos cuerpos en el
              // mismo anillo: con la altura de línea por defecto cada glifo
              // baja media interlínea, y esa media crece con el cuerpo, así que
              // el separador grande se descolgaría hacia el centro respecto a
              // las letras. A altura de línea 1 los dos cuelgan del mismo borde.
              'absolute inset-0 inline-block leading-none',
              isSeparator && ACCENT_TEXT[accent],
            )}
            style={{
              transform,
              WebkitTransform: transform,
              ...(isSeparator ? { fontSize: `${separatorScale}em` } : null),
            }}
          >
            {letter}
          </span>
        )
      })}
    </div>
  )
}
