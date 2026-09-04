'use client'

import { useRef } from 'react'

import { gsap, prefersReducedMotion, useGSAP } from '@/lib/animation'

/** Lo que consume cada cambio de estado, en alturas de pantalla. */
const STEP_VH = 0.9

/** Reposo antes del primer cambio, para leer el estado inicial. */
const HOLD_VH = 0.4

/** Unidades de la línea de tiempo. Sólo cuentan unas respecto a otras. */
const HOLD = 0.5
const MOVE = 1

/**
 * Reparto del paso: primero se cierra lo que sale y después se abre lo que
 * entra, sin solaparse. El hueco entre las dos mitades es lo que hace que se
 * lea como un mecanismo —cierra, abre— y no como un fundido cruzado.
 */
const SHUT_AT = 0
const SHUT_FOR = 0.42
const OPEN_AT = 0.5
const OPEN_FOR = 0.45

/**
 * Desfase entre columnas dentro de un mismo paso, en fracción del paso.
 *
 * Sin esto las tres se abren a la vez y la sección se lee como una diapositiva
 * cambiando. Escalonadas, se leen como tres mecanismos independientes.
 */
const COLUMN_LAG = 0.12

/** Entrada: cuánto tarda en destaparse cada pieza y qué separa una de otra. */
const REVEAL_DURATION = 0.9
const REVEAL_STAGGER = 0.09

/** Desenfoque de partida de los medios. Con unidad en los dos extremos. */
const BLUR_FROM = 'blur(14px)'
const BLUR_TO = 'blur(0px)'

/**
 * Recortes.
 *
 * `SHUT` cierra hacia el centro y `OPEN` abre desde él: es la persiana. Las
 * cuatro posiciones llevan `%`, ceros incluidos, porque GSAP toma la unidad de
 * cada número del valor de llegada y un `0` pelado deja un recorte inválido a
 * mitad de camino que el navegador descarta (CLAUDE.md).
 *
 * Y por eso mismo estos valores nunca se leen del elemento: el navegador
 * colapsa la forma corta al computarlos —`inset(50% 0% 50% 0%)` sale como
 * `inset(50% 0%)`— y quien los use como punto de partida recibe menos números
 * de los que espera. Siempre `fromTo` con los dos extremos escritos.
 *
 * `COVERED` es el estado de partida de la entrada: la pieza tapada de arriba
 * abajo, que se destapa al asomar la sección.
 */
const SHUT = 'inset(50% 0% 50% 0%)'
const OPEN = 'inset(0% 0% 0% 0%)'
const COVERED = 'inset(0% 0% 100% 0%)'

export type SkyparkColumnsScrollProps = {
  /** Un bloque por columna y estado: `stacks[columna][estado]`. */
  stacks: React.ReactNode[][]
} & React.ComponentPropsWithoutRef<'section'>

/**
 * Tres columnas fijas que cambian de estado abriéndose y cerrándose.
 *
 * La sección se fija y en cada paso cada columna cierra lo que muestra y abre
 * el estado siguiente. Las columnas no se mueven de sitio: lo que cambia es su
 * contenido, y la regla de qué va en cada una vive en el contenido, no aquí.
 *
 * **Por qué los estados van superpuestos.** Cada columna renderiza todos sus
 * estados uno encima de otro y sólo uno está abierto. Así el paso de un estado
 * al siguiente es recortar dos elementos —sin montar ni desmontar nada, sin
 * recalcular layout y sin que las imágenes se vuelvan a pedir—, y una columna
 * puede pasar de entera a partida en tres sin animar geometría.
 *
 * La entrada destapa las piezas del primer estado de arriba abajo y enfoca sus
 * medios, que arrancan desenfocados.
 *
 * Con `prefers-reduced-motion` no hay pin ni cambios de estado: se queda el
 * primero, destapado y enfocado.
 */
export function SkyparkColumnsScroll({
  stacks,
  className,
  ...props
}: SkyparkColumnsScrollProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const states = stacks[0]?.length ?? 0

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section || states === 0) return

      // Las capas, agrupadas por columna: `layers[columna][estado]`.
      const columns = gsap.utils
        .toArray<HTMLElement>(section.querySelectorAll('[data-column]'))
        .map((column) => gsap.utils.toArray<HTMLElement>(column.querySelectorAll('[data-layer]')))
      if (columns.length === 0) return

      const first = columns.flatMap((layers) => (layers[0] ? [layers[0]] : []))
      const piecesIn = (roots: HTMLElement[], selector: string) =>
        roots.flatMap((root) => gsap.utils.toArray<HTMLElement>(root.querySelectorAll(selector)))

      const pieces = piecesIn(first, '[data-piece]')
      const medias = piecesIn(first, '[data-media]')

      // Sólo el primer estado abierto; los demás cerrados desde el principio.
      columns.forEach((layers) => {
        layers.forEach((layer, s) => gsap.set(layer, { clipPath: s === 0 ? OPEN : SHUT }))
      })

      if (prefersReducedMotion()) {
        gsap.set(pieces, { clipPath: 'none' })
        gsap.set(medias, { filter: 'none' })
        return
      }

      // --- Entrada: se destapa y se enfoca --------------------------------
      // Cuelga del scroll de la página, no del pin: cuando la sección termina
      // de subir ya está compuesta, y el primer paso la encuentra montada.
      gsap
        .timeline({ scrollTrigger: { trigger: section, start: 'top 65%', once: true } })
        .fromTo(
          pieces,
          { clipPath: COVERED },
          {
            clipPath: OPEN,
            duration: REVEAL_DURATION,
            stagger: REVEAL_STAGGER,
            ease: 'power3.out',
          },
          0,
        )
        // El enfoque va por detrás del destape: la pieza ya está a la vista
        // cuando su medio termina de definirse, que es lo que da la sensación
        // de que la imagen "llega" en vez de aparecer hecha.
        .fromTo(
          medias,
          { filter: BLUR_FROM },
          {
            filter: BLUR_TO,
            duration: REVEAL_DURATION * 1.4,
            stagger: REVEAL_STAGGER,
            ease: 'power2.out',
          },
          REVEAL_STAGGER,
        )

      if (states < 2) return

      // --- Cambios de estado ----------------------------------------------
      const steps = states - 1

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.round(window.innerHeight * (HOLD_VH + steps * STEP_VH))}`,
          pin: true,
          anticipatePin: 1,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })

      timeline.to({}, { duration: HOLD })

      for (let step = 1; step <= steps; step++) {
        const at = HOLD + (step - 1) * MOVE

        columns.forEach((layers, column) => {
          const lag = column * COLUMN_LAG
          const saliente = layers[step - 1]
          const entrante = layers[step]
          if (!saliente || !entrante) return

          // Los dos extremos van explícitos, con `fromTo`, y NO con `.to()`.
          //
          // El motivo es que el navegador colapsa la forma corta: `inset(50% 0%
          // 50% 0%)` computa como `inset(50% 0%)` y `inset(0% 0% 0% 0%)` como
          // `inset(0%)`. Con un `.to()`, GSAP lee ese valor computado como
          // punto de partida y le llegan dos números para un destino de cuatro:
          // las posiciones que se quedan sin origen no se animan. En la
          // apertura eso dejaba `bottom` clavado en 0 desde el primer
          // fotograma, así que sólo subía el borde de arriba —abría de abajo
          // hacia arriba, con un salto al empezar— en vez de abrirse desde el
          // centro.
          //
          // `immediateRender: false` es igual de obligatorio: sin él, crear
          // estos tweens aplicaría sus valores de partida en el acto y el
          // primer estado saldría cerrado antes de que nadie haga scroll.
          timeline.fromTo(
            saliente,
            { clipPath: OPEN },
            {
              clipPath: SHUT,
              duration: MOVE * SHUT_FOR,
              ease: 'power2.in',
              immediateRender: false,
            },
            at + lag + MOVE * SHUT_AT,
          )

          timeline.fromTo(
            entrante,
            { clipPath: SHUT },
            {
              clipPath: OPEN,
              duration: MOVE * OPEN_FOR,
              ease: 'power2.out',
              immediateRender: false,
            },
            at + lag + MOVE * OPEN_AT,
          )
        })
      }
    },
    { scope: sectionRef, dependencies: [states], revertOnUpdate: true },
  )

  return (
    <section ref={sectionRef} className={className} {...props}>
      {/*
        El hueco de la barra fija.

        La sección se fija con su borde superior en el borde de la ventana, y la
        barra se le pone encima tapándole ese trozo. Sin descontarlo, la primera
        celda de una columna partida se ve más baja que las otras dos aunque
        midan lo mismo, y el reparto en tercios deja de leerse.
      */}
      <div className="h-full w-full pt-navbar">
        <div className="relative h-full w-full">
          <div className="grid h-full w-full grid-cols-3">
            {stacks.map((columna, index) => (
              <div key={index} data-column className="relative h-full overflow-hidden">
                {columna.map((estado, s) => (
                  // Todos los estados en el mismo sitio, uno encima de otro.
                  // El que manda es el que está abierto.
                  <div key={s} data-layer className="absolute inset-0">
                    {estado}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <Notches />
        </div>
      </div>
    </section>
  )
}

/**
 * Muescas de marca en dos esquinas opuestas de la composición.
 *
 * Van **fijas en pantalla**, no dentro de las columnas: no se cierran ni se
 * abren con los estados, se quedan mordiendo la composición mientras el
 * contenido cambia por debajo. Por eso viven aquí y no en una celda.
 *
 * El escalón es el mismo arriba y abajo, girado 180°: la pieza ancha pegada al
 * borde y la estrecha un paso hacia dentro. En `surface`, que es el tratamiento
 * del kit para bloques que recortan la esquina de una foto (DESIGN_SYSTEM.md
 * §4, composición de Skypark), así que siguen al tema.
 */
function Notches() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
      <span className="absolute right-0 top-0 h-cell w-cell-2 bg-surface" />
      <span className="absolute right-0 top-cell size-cell bg-surface" />

      <span className="absolute bottom-0 left-0 h-cell w-cell-2 bg-surface" />
      <span className="absolute bottom-cell left-0 size-cell bg-surface" />
    </div>
  )
}
