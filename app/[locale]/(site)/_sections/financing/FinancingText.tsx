'use client'

import { gsap, prefersReducedMotion, useGSAP, useScrollEmphasis } from '@/lib/animation'

/** El isotipo que rueda hasta su sitio al entrar la sección. */
const MARK = '[data-financing-mark]'

/** Lo que tarda el isotipo en llegar rodando, en segundos. */
const ROLL_DURATION = 1.2

/**
 * Tope de vueltas. La cuenta física sale de una por cada circunferencia
 * recorrida, pero en pantallas anchas eso se dispara y el isotipo pasa de rodar
 * a ser un borrón.
 */
const MAX_TURNS = 3

/**
 * Envoltorio cliente de la sección de financiamiento: sostiene las refs del pin
 * y del barrido, y la entrada rodada del isotipo. El texto llega ya partido en
 * palabras desde el servidor, así que nada de contenido viaja al bundle.
 *
 * Si algún día vuelve a hacer falta cromo suelto —una invitación a bajar, un
 * indicador—, va como **hermano** de `contentRef` y no dentro: lo que cuelgue
 * del contenido lo barre la búsqueda de palabras a oscurecer y acabaría
 * animándose como si fuera texto. El isotipo sí va dentro, porque es parte de
 * la columna, pero no lleva `data-emphasis` y el barrido no lo ve.
 */
export function FinancingText({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'section'>) {
  const { sectionRef, contentRef } = useScrollEmphasis<HTMLElement, HTMLDivElement>()

  useGSAP(
    () => {
      const section = sectionRef.current
      const mark = section?.querySelector<HTMLElement>(MARK)
      if (!section || !mark) return

      // Sin movimiento el isotipo aparece puesto: `reveal-init` ya lo deja
      // visible bajo reduced-motion, así que no hay nada que hacer.
      if (prefersReducedMotion()) return

      // Se mide con `offsetLeft` y no con `getBoundingClientRect`: el rect
      // incluye el `x` que escribe GSAP, así que al recalcular en un refresh la
      // distancia saldría contaminada por la posición de la propia animación.
      // `offsetLeft` es la posición de layout y no la toca ningún transform; la
      // sección ocupa el ancho de la ventana, de modo que ya está medida contra
      // el borde izquierdo de la pantalla.
      const travel = () => mark.offsetLeft + mark.offsetWidth

      // Rodar de verdad es girar una vuelta por cada circunferencia recorrida.
      // Se redondea a vueltas enteras a propósito: el isotipo es un patrón de
      // bloques y tiene que aterrizar derecho, no a 228°. Y nunca menos de una,
      // o en pantallas estrechas el recorrido es tan corto que no llega a
      // parecer que rueda.
      const turns = () =>
        Math.min(MAX_TURNS, Math.max(1, Math.round(travel() / (Math.PI * mark.offsetWidth))))

      gsap.fromTo(
        mark,
        // Giro negativo para que, avanzando hacia la derecha, ruede en el
        // sentido de las agujas del reloj. Llega a 0 —derecho— en vez de salir
        // de 0, que es lo que deja el estado final limpio.
        { x: () => -travel(), rotation: () => -turns() * 360, opacity: 1 },
        {
          x: 0,
          rotation: 0,
          duration: ROLL_DURATION,
          // El mismo ease gobierna avance y giro, así que el isotipo frena sin
          // patinar: si fueran distintos, se vería girar más de lo que avanza.
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            // Con la sección ya bien entrada en pantalla: está centrada
            // verticalmente, así que más arriba el isotipo aún no se ve y la
            // entrada se gastaría fuera de cuadro.
            start: 'top 60%',
            once: true,
            invalidateOnRefresh: true,
          },
        },
      )
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className={className} {...props}>
      <div ref={contentRef} className="shell flex h-full items-center">
        {children}
      </div>
    </section>
  )
}
