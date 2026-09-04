'use client'

import { useRef } from 'react'

import { gsap, prefersReducedMotion, useGSAP } from '@/lib/animation'

/** Cuánto se acerca el plano de punta a punta de la sección. */
const ZOOM = 1.3

/** Píxeles de scroll que consume el acercamiento mientras la sección está fijada. */
const ZOOM_DISTANCE = 1200

/**
 * Cadencia con la que se construye una frase: cuánto separa a una pieza de la
 * siguiente y cuánto tarda en entrar cada tipo de pieza.
 *
 * El paso tiene que ser menor que la duración de cada palabra —si no, la frase
 * se lee a tirones—, pero no tanto como para que media frase esté en fundido a
 * la vez: entonces el conjunto se lee como un fade del bloque entero y no como
 * palabras entrando una tras otra.
 */
type Pace = {
  step: number
  word: number
  highlight: number
  burst: number
  /** Cuánto tarda cada letra del remate y qué la separa de la siguiente. */
  letter: number
  letterStep: number
}

/** Pregunta: se escribe sola al asomar, así que sus tiempos son segundos. */
const LIVE: Pace = {
  step: 0.16,
  word: 0.32,
  highlight: 0.6,
  burst: 0.8,
  letter: 0.3,
  letterStep: 0.05,
}

/**
 * Respuesta: la escribe el scroll dentro del pin, así que sus tiempos son
 * fracciones del recorrido (1 = `ZOOM_DISTANCE` píxeles). Empezando en
 * `ANSWER_AT`, la construcción entera ocupa el tramo 0,55–0,93: unos 460px
 * para escribirse y otros ~85px de respiro, ya escrita, antes de que la
 * sección se suelte.
 */
const SCROLLED: Pace = {
  step: 0.06,
  word: 0.12,
  highlight: 0.16,
  burst: 0.2,
  letter: 0.09,
  letterStep: 0.022,
}

/** Punto del recorrido (0-1) en el que la pregunta empieza a irse, y cuánto tarda. */
const QUESTION_EXIT_AT = 0.32
const QUESTION_EXIT = 0.2

/**
 * En qué punto del recorrido se empieza a escribir la respuesta: la pregunta
 * acabó de irse en 0,52, así que el relevo es limpio y aún queda un respiro
 * entre las dos frases.
 */
const ANSWER_AT = 0.55

/**
 * Recortes del bloque destacado. Ver `.draw-init` / `.burst-init` en globals.
 *
 * Las cuatro posiciones llevan `%` explícito, también los ceros, y no es
 * cosmético: GSAP interpola estas cadenas tomando la unidad de cada número del
 * valor de LLEGADA. Con un `0` pelado en la cuarta posición, el recorte que se
 * pinta a mitad de camino es `inset(0 25% 0 25)` —un `25` sin unidad no es un
 * `<length-percentage>` válido—, el navegador tira la declaración entera y el
 * `clip-path` computado pasa a `none`: el bloque se ve completo durante todo el
 * barrido y sólo los fotogramas 0 y 1 salen bien. Se ve como que aparece de
 * golpe. Al barrido normal no le pasaba porque su cuarta posición es 0 → 0 y
 * GSAP la copia literal en vez de interpolarla.
 */
const WIPE_FROM = 'inset(0% 100% 0% 0%)'
const BURST_FROM = 'inset(0% 50% 0% 50%)'
const SHOWN = 'inset(0% 0% 0% 0%)'

export type HubZoomProps = {
  /** El plano de fondo, ya renderizado en el servidor. */
  map: React.ReactNode
  /** La pregunta de entrada, con sus piezas marcadas `data-hub-piece`. */
  question: React.ReactNode
  /** La respuesta, que se escribe con el plano ya acercado. */
  answer: React.ReactNode
}

/**
 * Sección fijada en la que el plano de la zona se acerca con el scroll.
 *
 * Las dos frases se construyen igual —pieza a pieza, palabra a palabra— pero
 * con relojes distintos. La pregunta corre sola al asomar su bloque, antes de
 * que la sección se fije. La respuesta no: la escribe el scroll, dentro del pin
 * y en la misma línea de tiempo que gobierna el acercamiento, de modo que la
 * construcción y el recorrido son una sola cosa. Eso es lo que da la sensación
 * de bajar sobre la ciudad hasta encontrar la respuesta, y lo que hace que al
 * subir la frase se deshaga en vez de apagarse de golpe.
 *
 * Con `prefers-reduced-motion` no hay pin ni zoom: las dos frases se apilan en
 * una columna y el plano se queda quieto (ver `motion-reduce:` en el marcado).
 */
export function HubZoom({ map, question, answer }: HubZoomProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const questionRef = useRef<HTMLDivElement>(null)
  const answerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      const questionEl = questionRef.current
      const answerEl = answerRef.current
      if (!section || !questionEl || !answerEl) return

      const piecesOf = (root: HTMLElement) =>
        gsap.utils.toArray<HTMLElement>(root.querySelectorAll('[data-hub-piece]'))

      if (prefersReducedMotion()) {
        gsap.set([questionEl, answerEl], { opacity: 1 })
        gsap.set(section.querySelectorAll('[data-hub-letter]'), { opacity: 1, y: 0 })
        gsap.set([...piecesOf(questionEl), ...piecesOf(answerEl)], {
          opacity: 1,
          y: 0,
          scale: 1,
          clipPath: 'none',
        })
        return
      }

      /**
       * Escribe una frase pieza a pieza, a la cadencia que se le pase. Cada
       * tipo entra a su manera: las palabras en cascada y el tramo destacado
       * descubriéndose sobre su bloque de color —de izquierda a derecha, o
       * abriéndose desde el centro cuando el diseño pide más énfasis—.
       *
       * Devuelve la línea de tiempo sin atar a nada: quien la pide decide si le
       * cuelga su propio `ScrollTrigger` o la anida en otra ya existente.
       */
      const write = (root: HTMLElement, pace: Pace, vars?: gsap.TimelineVars) => {
        const timeline = gsap.timeline(vars)

        piecesOf(root).forEach((piece, index) => {
          const at = index * pace.step

          switch (piece.dataset.hubPiece) {
            case 'highlight':
              timeline.fromTo(
                piece,
                { clipPath: WIPE_FROM },
                { clipPath: SHOWN, duration: pace.highlight, ease: 'power2.out' },
                at,
              )
              break

            // Remate: el bloque se abre desde el centro y aterriza desde un
            // tamaño mayor. Mismo mecanismo que el destacado normal, pero en
            // los dos ejes y con una entrada más seca.
            case 'highlight-burst': {
              timeline.fromTo(
                piece,
                { clipPath: BURST_FROM, scale: 1.14 },
                { clipPath: SHOWN, scale: 1, duration: pace.burst, ease: 'power4.out' },
                at,
              )

              // Y encima, las letras una a una. Arrancan a mitad de la
              // apertura: esperar a que la placa termine deja un bloque de
              // color vacío en pantalla, y salir antes las recortaría, porque
              // el `clip-path` del bloque las alcanza.
              const letters = gsap.utils.toArray<HTMLElement>(
                piece.querySelectorAll('[data-hub-letter]'),
              )

              if (letters.length > 0) {
                timeline.fromTo(
                  letters,
                  { opacity: 0, y: 12 },
                  {
                    opacity: 1,
                    y: 0,
                    duration: pace.letter,
                    stagger: pace.letterStep,
                    ease: 'power2.out',
                  },
                  at + pace.burst * 0.5,
                )
              }
              break
            }

            default:
              timeline.fromTo(
                piece,
                { opacity: 0, y: 18 },
                { opacity: 1, y: 0, duration: pace.word, ease: 'power3.out' },
                at,
              )
          }
        })

        return timeline
      }

      // La pregunta se escribe ligada al propio recorrido de entrada, no al
      // reloj: antes iba a tiempo real (`toggleActions: 'play none none
      // reverse'`, ~2s), suponiendo que el usuario tarda eso en cubrir la
      // media pantalla que falta hasta que la sección se fija. Con un scroll
      // más rápido que esa suposición —cualquier golpe de rueda o trackpad—
      // las palabras seguían en opacidad 0 durante casi todo el tramo y sólo
      // se volvían legibles ya con la sección fijada y centrada: se leía como
      // que el texto aparecía de golpe arriba, no como que subía escribiéndose.
      //
      // `scrub` ata el avance de la cascada a la posición del scroll —el mismo
      // mecanismo que ya usa la respuesta dentro del pin—, así que termina de
      // escribirse siempre en el mismo punto del recorrido sin importar la
      // velocidad, y de paso reversa sola al subir sin necesitar
      // `toggleActions`.
      write(questionEl, LIVE, {
        scrollTrigger: {
          trigger: questionEl,
          start: 'top bottom',
          end: 'top 65%',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      // El bloque de la respuesta va visible desde el principio: lo que esconde
      // la frase son las piezas, cada una en su estado de partida. Así no hay
      // nada que encender ni apagar —que es justo el punto: encender el bloque
      // entero en 60px de scroll, mientras las palabras entraban por su cuenta
      // en tiempo real, hacía que la frase apareciera de golpe en vez de
      // escribirse, y que al subir se cortara a media marcha—.
      gsap.set(answerEl, { opacity: 1 })

      // --- Recorrido: el plano se acerca, la pregunta se va y la respuesta se
      // escribe -------------------------------------------------------------
      // La línea de tiempo dura 1, así que las posiciones se leen como
      // fracciones del recorrido. La pregunta aguanta el primer tercio antes de
      // empezar a irse: es el respiro que deja terminar la construcción a quien
      // llega bajando rápido, ya con la sección fijada en pantalla.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: `+=${ZOOM_DISTANCE}`,
            pin: true,
            anticipatePin: 1,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
        .to(mapRef.current, { scale: ZOOM, duration: 1, ease: 'none' }, 0)
        // El relevo lo gobierna el scroll y no la construcción: así vale en los
        // dos sentidos. La pregunta cierra antes de que la respuesta abra, de
        // modo que nunca coinciden en pantalla.
        .to(questionEl, { opacity: 0, duration: QUESTION_EXIT, ease: 'none' }, QUESTION_EXIT_AT)
        .add(write(answerEl, SCROLLED), ANSWER_AT)
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      id="hub"
      // `pt-navbar`: la sección se fija con su borde superior en el de la
      // ventana y la barra le tapa esa franja, así que sin descontarla la frase
      // sale centrada respecto a la sección pero alta respecto a lo que se ve.
      // El plano y los degradados no se mueven: son absolutos, y su `inset-0`
      // se resuelve contra la caja de relleno, así que siguen cubriéndolo todo.
      className="relative grid h-dvh place-items-center overflow-hidden pt-navbar motion-reduce:h-auto motion-reduce:gap-cell motion-reduce:py-section"
    >
      {/* El plano ocupa la sección entera y se acerca con el scroll. Va en su
          propio envoltorio: GSAP le escribe `scale` y no puede compartir
          elemento con el `object-cover` de la imagen. */}
      <div ref={mapRef} aria-hidden="true" className="absolute inset-0 z-0">
        {map}
      </div>

      {/* Degradados de entrada y salida: el plano no arranca ni termina en un
          corte, se funde con el fondo de página. Van fuera del envoltorio que
          escala, o el zoom se los llevaría por delante. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-cell-3 bg-gradient-to-b from-surface to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-cell-3 bg-gradient-to-t from-surface to-transparent"
      />

      {/* Las dos frases comparten celda para poder relevarse en el mismo sitio;
          con reduced-motion sueltan la celda y se apilan en dos filas. */}
      <div ref={questionRef} className="relative z-20 col-start-1 row-start-1 motion-reduce:row-auto">
        {question}
      </div>

      {/* `reveal-init` aquí sólo cubre el hueco hasta que corre GSAP, que lo
          deja visible en el acto: a partir de ahí quien esconde la frase son
          las piezas, no el bloque. */}
      <div
        ref={answerRef}
        className="reveal-init relative z-20 col-start-1 row-start-1 motion-reduce:row-auto"
      >
        {answer}
      </div>
    </section>
  )
}
