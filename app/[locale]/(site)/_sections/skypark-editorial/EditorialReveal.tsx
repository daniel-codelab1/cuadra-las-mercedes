'use client'

import { useEffect, useRef, useState } from 'react'

import { SplitText, gsap, prefersReducedMotion, useGSAP } from '@/lib/animation'

/**
 * Entrada del titular, carácter a carácter.
 *
 * Son los valores del componente `SplitText` de React Bits —cada carácter sube
 * 40px desvaneciéndose, con `power3.out`—, salvo el escalonado: aquel usa un
 * retardo fijo por letra (50ms), pensado para titulares cortos en inglés. Aquí
 * el titular pasa de sesenta caracteres y eso da más de tres segundos sólo de
 * cascada, con los párrafos y las fotos esperando detrás. `amount` reparte el
 * escalonado en un total fijo, así que la cascada dura lo mismo diga lo que
 * diga el titular.
 */
const CHAR_FROM = { opacity: 0, y: 40 }
const CHAR_DURATION = 0.55
const CHAR_SPREAD = 0.45

/**
 * Caída del isotipo: entra desde arriba y aterriza en su sitio.
 *
 * `power2.in` acelera al bajar, que es como cae algo con peso; un `out`
 * frenaría al final y se leería como si flotara. Al llegar se para en seco,
 * sin rebote, que es lo que pega con la estética de bloques.
 *
 * El encendido va aparte y mucho más corto: si compartiera el `power2.in` de la
 * caída, el isotipo pasaría casi todo el trayecto medio transparente y llegaría
 * de golpe. Así aparece pronto y lo que se ve es la caída, no el fundido.
 */
const MARK_DROP = 90
const MARK_DURATION = 0.55
const MARK_FADE = 0.2

/** Los párrafos, detrás del titular. */
const TEXT_DURATION = 0.5
const TEXT_STAGGER = 0.08

/** Y las fotos, ya con todo el texto puesto. */
const MEDIA_DURATION = 0.8
const MEDIA_STAGGER = 0.1

/**
 * Recorte de las fotos: tapadas y descubiertas hacia abajo.
 *
 * Las cuatro posiciones con `%`, ceros incluidos, y siempre por `fromTo` con
 * los dos extremos escritos: GSAP toma la unidad de cada número del valor de
 * llegada, y el navegador colapsa la forma corta al computarla, de modo que
 * leerla del elemento devuelve menos números de los que hacen falta (CLAUDE.md).
 */
const COVERED = 'inset(0% 0% 100% 0%)'
const UNCOVERED = 'inset(0% 0% 0% 0%)'

/**
 * Entrada y salida de la sección editorial.
 *
 * Un solo hilo, en el orden en que se lee: primero el titular carácter a
 * carácter, después los párrafos, y sólo cuando el texto está entero puesto se
 * descubren las fotos de arriba abajo.
 *
 * Se arma al entrar y se desarma al salir, en los dos sentidos
 * (`play reverse play reverse`): la sección se monta cuando aparece y se
 * deshace cuando se va, así que volver a ella la vuelve a montar.
 *
 * **Nada empieza visible.** Todas las piezas salen del servidor con
 * `reveal-init`, y sus valores de partida sólo se aplican cuando GSAP ya está
 * en marcha. Sin eso, entre el pintado y la hidratación se veían las fotos
 * enteras: aparecían, se tapaban al inicializarse el tween y volvían a
 * descubrirse con la animación, que es el doble destape que se notaba.
 *
 * Con `prefers-reduced-motion` no hay entrada: todo queda puesto y a la vista,
 * y el titular ni siquiera se trocea.
 */
export function EditorialReveal({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'section'>) {
  const sectionRef = useRef<HTMLElement>(null)

  // Trocear antes de que la fuente esté lista mide los caracteres con la
  // tipografía de reserva, y al llegar la definitiva el reparto queda torcido.
  const [fontsReady, setFontsReady] = useState(false)
  useEffect(() => {
    let vivo = true
    void document.fonts.ready.then(() => {
      if (vivo) setFontsReady(true)
    })
    return () => {
      vivo = false
    }
  }, [])

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section || !fontsReady) return

      const pick = (selector: string) =>
        gsap.utils.toArray<HTMLElement>(section.querySelectorAll(selector))

      const mark = section.querySelector<HTMLElement>('[data-mark]')
      const heading = section.querySelector<HTMLElement>('[data-heading]')
      const texts = pick('[data-text]')
      const cta = section.querySelector<HTMLElement>('[data-cta]')
      const medias = pick('[data-media]')

      if (prefersReducedMotion()) {
        gsap.set([mark, heading, ...texts].filter(Boolean), { opacity: 1, y: 0 })
        if (cta) cta.inert = false
        gsap.set(medias, { opacity: 1, clipPath: 'none' })
        return
      }

      // Se trocea por palabras Y por caracteres, no sólo por caracteres.
      //
      // Con `chars` a secas cada letra pasa a ser un `inline-block` y el
      // navegador pierde los límites de palabra: el titular rompía línea a
      // mitad de palabra («es un s / ímbolo del avance de Las Merc / edes»).
      // Añadir `words` envuelve cada palabra en su propia caja, que ya no se
      // puede partir, y los caracteres siguen animándose igual dentro.
      //
      // El troceado tiene que revertirse al limpiar o el marcado se queda
      // partido en `<span>`. `gsap.context` respeta la función que devolvamos.
      const split = heading
        ? new SplitText(heading, {
            type: 'words,chars',
            wordsClass: 'split-word',
            charsClass: 'split-char',
          })
        : null

      // --- Estado de partida, escrito a mano ------------------------------
      // No se deja en manos del `immediateRender` de los `fromTo`: ése depende
      // de cuándo se renderice cada tween por primera vez, y hasta entonces las
      // piezas se quedan como estuvieran. Con el titular eso se veía: los
      // caracteres salían del troceado ya colocados y visibles, y ahí seguían
      // hasta que la línea de tiempo arrancaba.
      //
      // El bloque del titular pasa a visible aquí porque lo que esconde el
      // texto a partir de este punto son los caracteres, no el bloque.
      if (mark) gsap.set(mark, { opacity: 0, y: -MARK_DROP })
      if (heading) gsap.set(heading, { opacity: 1 })
      if (split) gsap.set(split.chars, CHAR_FROM)
      gsap.set(texts, { opacity: 0 })
      // La opacidad no saca nada del camino: un botón a 0 sigue recibiendo
      // clics y saliendo al tabular. Arranca `inert`, que sí lo aparta de los
      // tres sitios a la vez —puntero, foco y árbol de accesibilidad—, y lo
      // suelta el `onToggle` del disparador cuando la sección está montada.
      if (cta) cta.inert = true
      // Las fotos ya pueden encenderse: el recorte las mantiene tapadas.
      gsap.set(medias, { opacity: 1, clipPath: COVERED })

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          end: 'bottom 25%',
          // Se arma al entrar y se desarma al salir, por arriba y por abajo.
          toggleActions: 'play reverse play reverse',
          // El botón sólo es alcanzable mientras la sección está montada. Va
          // aquí y no en la línea de tiempo porque `inert` es una propiedad del
          // elemento, no algo que GSAP pueda interpolar y devolver al rebobinar.
          onToggle: (self) => {
            if (cta) cta.inert = !self.isActive
          },
          invalidateOnRefresh: true,
        },
      })

      if (mark) {
        timeline.fromTo(
          mark,
          { y: -MARK_DROP },
          { y: 0, duration: MARK_DURATION, ease: 'power2.in' },
          0,
        )
        timeline.fromTo(mark, { opacity: 0 }, { opacity: 1, duration: MARK_FADE, ease: 'none' }, 0)
      }

      if (split && split.chars.length > 0) {
        timeline.fromTo(
          split.chars,
          { ...CHAR_FROM },
          {
            opacity: 1,
            y: 0,
            duration: CHAR_DURATION,
            stagger: { amount: CHAR_SPREAD },
            ease: 'power3.out',
          },
          // Justo al aterrizar el isotipo: encadenado, no a la vez.
          mark ? MARK_DURATION : 0,
        )
      }

      if (texts.length > 0) {
        // Un poco montado sobre el final del titular: esperar a la última letra
        // deja un hueco muerto.
        timeline.fromTo(
          texts,
          { opacity: 0 },
          {
            opacity: 1,
            duration: TEXT_DURATION,
            stagger: TEXT_STAGGER,
            ease: 'power2.out',
          },
          '>-0.3',
        )

      }

      if (medias.length > 0) {
        // Sigue detrás del texto, a hueso: eso no se toca, es el encargo. Lo
        // que se recortó para que las fotos no se hagan esperar es lo de
        // delante —la cascada del titular y el fundido de los párrafos—, no
        // este encadenado.
        timeline.fromTo(
          medias,
          // `opacity: 1` va en el valor de partida: las fotos salen del
          // servidor apagadas para que no asomen antes de tiempo, y aquí ya
          // pueden encenderse porque el recorte las mantiene tapadas.
          { clipPath: COVERED, opacity: 1 },
          {
            clipPath: UNCOVERED,
            duration: MEDIA_DURATION,
            stagger: MEDIA_STAGGER,
            ease: 'power3.inOut',
          },
          // A hueso detrás del texto: es el encargo. Las fotos no empiezan a
          // descubrirse hasta que el último párrafo ha terminado.
          '>',
        )
      }

      return () => {
        split?.revert()
      }
    },
    { scope: sectionRef, dependencies: [fontsReady], revertOnUpdate: true },
  )

  return (
    <section ref={sectionRef} className={className} {...props}>
      {children}
    </section>
  )
}
