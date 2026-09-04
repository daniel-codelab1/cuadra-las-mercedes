'use client'

import { useCallback } from 'react'

import { gsap, useHorizontalPin, type HorizontalPinSetup } from '@/lib/animation'
import { cn } from '@/lib/cn'

/** Vueltas completas que da cada isotipo a lo largo del recorrido. */
const WHEEL_TURNS = 1.5

/**
 * Punto del ancho de la ventana en el que se revela una parada del carril:
 * justo antes de asomar por el borde derecho.
 *
 * Se lee dos veces —en el `start` de cada parada y al repartirlas entre las que
 * ya se ven al fijarse la sección y las que llegan después—, y las dos lecturas
 * tienen que dar lo mismo, así que va en una sola constante.
 */
const REVEAL_AT = 0.88

/** Entrada de una torre: cuánto sube, cuánto tarda y qué la separa de la siguiente. */
const CARD_RISE = 64
const CARD_DURATION = 0.9
const CARD_STAGGER = 0.14

/** Entrada de la cabecera: el titular de apertura y, detrás, el isotipo. */
const HEAD_RISE = 40
const HEAD_DURATION = 0.9
const HEAD_STAGGER = 0.12
const WHEEL_DELAY = 0.2

/**
 * Carril con scroll horizontal de la sección de proyectos.
 *
 * El contenido lo renderiza el servidor y llega como `children`: aquí sólo vive
 * el pin y las animaciones. Los elementos a revelar se marcan con un `data-*` y
 * arrancan con `reveal-init`.
 *
 * Los reveals del carril cuelgan de `containerAnimation`, no del scroll de la
 * página: sin eso, ScrollTrigger mediría el avance vertical y dispararía todas
 * las torres a la vez en cuanto la sección se fijara.
 *
 * Hay cuatro marcas distintas:
 *   data-project        paradas del carril; se revelan al pasar por pantalla
 *   data-project-intro  apertura (pre-título y titular); abre la sección, lo primero
 *   data-project-fixed  capa fija; se revela al entrar la sección
 *   data-project-wheel  capa fija; gira ligado al avance del recorrido
 *
 * El orden de entrada es deliberado: primero el titular, después las torres en
 * cascada. Ver la nota del reparto en `onSetup`.
 */
export function ProjectsScroll({
  children,
  overlay,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'section'> & {
  /**
   * Contenido que se queda quieto mientras el carril se desplaza. Va fuera del
   * track, dentro de la sección fijada, así que el `transform` del track no le
   * afecta.
   */
  overlay?: React.ReactNode
}) {
  const onSetup = useCallback(({ tween, section, track }: HorizontalPinSetup) => {
    const find = (root: HTMLElement, selector: string) =>
      gsap.utils.toArray<HTMLElement>(root.querySelectorAll(selector))

    const items = find(track, '[data-project]')
    // El titular viaja en el carril, pero su reveal no depende de él; la capa
    // fija ni siquiera está dentro del track. Los dos se buscan desde la sección.
    const intro = find(section, '[data-project-intro]')
    const fixed = find(section, '[data-project-fixed]')

    // Sin tween (reduced-motion) no hay recorrido que seguir: se muestra todo.
    if (!tween) {
      gsap.set([...items, ...intro, ...fixed], { opacity: 1, y: 0 })
      return
    }

    // --- Cabecera --------------------------------------------------------
    // El titular de apertura abre la sección y el isotipo entra detrás. Los dos
    // están en la banda superior, que ya se ve mientras la sección sube, así
    // que cuelgan del scroll vertical de la página: para cuando el carril se
    // fija, el titular ya está leído.
    if (intro.length > 0 || fixed.length > 0) {
      const head = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top 70%', once: true },
      })

      if (intro.length > 0) {
        // Con `stagger`, porque la apertura son dos piezas apiladas —el
        // pre-título y el titular— y entrando a la vez se leen como un bloque.
        // Escalonadas, la pregunta llega antes que la respuesta, que es el
        // orden en que se leen.
        head.fromTo(
          intro,
          { opacity: 0, y: HEAD_RISE },
          {
            opacity: 1,
            y: 0,
            duration: HEAD_DURATION,
            stagger: HEAD_STAGGER,
            ease: 'power3.out',
          },
          0,
        )
      }

      if (fixed.length > 0) {
        head.fromTo(
          fixed,
          { opacity: 0, y: HEAD_RISE },
          {
            opacity: 1,
            y: 0,
            duration: HEAD_DURATION,
            stagger: HEAD_STAGGER,
            ease: 'power3.out',
          },
          WHEEL_DELAY,
        )
      }
    }

    // Los isotipos giran como ruedas a lo largo de todo el recorrido. No pueden
    // usar `containerAnimation` porque no viven dentro del track, así que su
    // ScrollTrigger replica el rango del pin: mismo trigger, mismo start y el
    // mismo recorrido calculado, para que giro y desplazamiento vayan a la par.
    const wheels = find(section, '[data-project-wheel]')

    if (wheels.length > 0) {
      const distance = () => Math.max(0, track.scrollWidth - section.offsetWidth)

      gsap.to(wheels, {
        rotation: WHEEL_TURNS * 360,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
    }

    if (items.length === 0) return

    // --- Paradas ---------------------------------------------------------
    // Las paradas se reparten en dos grupos según dónde caigan con el carril en
    // reposo, y no es un refinamiento: las que ya están dentro de la pantalla al
    // fijarse la sección tienen su disparador POR DETRÁS del comienzo del
    // recorrido, así que ScrollTrigger las da por pasadas y las suelta todas en
    // el mismo fotograma. De ahí que el primer tramo del carril apareciera de
    // golpe en vez de una torre tras otra.
    //
    // Ese primer grupo entra en una sola cascada, ya con la sección casi puesta;
    // el resto sí puede colgar del avance horizontal, porque su disparador queda
    // por delante y el carril las va trayendo de una en una.
    //
    // El reparto se mide una vez, con el carril en reposo: medir contra el borde
    // del track y no contra la ventana lo hace independiente de por dónde ande
    // la página. Un cambio de tamaño de ventana puede mover la frontera, pero
    // para entonces la cascada ya se ha visto.
    const trackLeft = track.getBoundingClientRect().left
    const edge = section.offsetWidth * REVEAL_AT

    const onScreen: HTMLElement[] = []
    const arriving: HTMLElement[] = []

    items.forEach((item) => {
      const left = item.getBoundingClientRect().left - trackLeft
      ;(left < edge ? onScreen : arriving).push(item)
    })

    if (onScreen.length > 0) {
      gsap.fromTo(
        onScreen,
        { opacity: 0, y: CARD_RISE },
        {
          opacity: 1,
          y: 0,
          duration: CARD_DURATION,
          stagger: CARD_STAGGER,
          ease: 'power3.out',
          // Más abajo que la cabecera a propósito: da tiempo a leer el titular,
          // y además las torres van en la banda inferior, que hasta aquí no
          // asoma. Revelarlas antes sería hacerlo fuera de pantalla.
          scrollTrigger: { trigger: section, start: 'top 20%', once: true },
        },
      )
    }

    arriving.forEach((item) => {
      gsap.fromTo(
        item,
        { opacity: 0, y: CARD_RISE },
        {
          opacity: 1,
          y: 0,
          duration: CARD_DURATION,
          ease: 'power3.out',
          scrollTrigger: {
            containerAnimation: tween,
            trigger: item,
            // Coordenadas horizontales: el borde izquierdo del elemento contra
            // el ancho de la ventana. En un containerAnimation no se puede usar
            // `pin` ni `snap`.
            start: `left ${REVEAL_AT * 100}%`,
            toggleActions: 'play none none reverse',
          },
        },
      )
    })
  }, [])

  const { sectionRef, trackRef } = useHorizontalPin<HTMLElement, HTMLDivElement>({
    scrub: 1,
    onSetup,
  })

  return (
    <section
      ref={sectionRef}
      className={cn(
        // Con reduced-motion no hay pin, así que el carril pasa a recorrerse
        // con scroll horizontal nativo y la sección deja de ocupar la pantalla.
        'relative h-dvh motion-safe:overflow-hidden motion-reduce:h-auto motion-reduce:overflow-x-auto',
        className,
      )}
      {...props}
    >
      {overlay ? (
        // `pointer-events-none` para que la capa no bloquee el hover de las
        // tarjetas que pasan por debajo.
        <div className="pointer-events-none absolute inset-0 z-10">{overlay}</div>
      ) : null}

      <div ref={trackRef} className="flex h-full w-max items-stretch">
        {children}
      </div>
    </section>
  )
}
