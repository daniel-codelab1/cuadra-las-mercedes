'use client'

import { useCallback, useEffect, useRef } from 'react'

import { ScrollTrigger } from '@/lib/animation'

import './ScrollExpand.css'

/**
 * Bloque que se abre con el scroll: una foto recortada en el centro de la
 * pantalla que crece hasta llenarla, con un rótulo que se va y un texto que
 * entra al final.
 *
 * Vendorizado del registro `ScrollExpand-JS-CSS` de React Bits
 * (https://reactbits.dev/animations/scroll-expand). La lógica —`smoothstep`,
 * el cálculo del recorte, el rAF con interpolación— es la del registro. Lo que
 * cambia respecto al original, y por qué:
 *
 *  - **TypeScript** en vez de JSX suelto, que es lo que usa el resto del repo.
 *  - **El medio es un slot** (`media`): el original trae un `<img>` plano, y
 *    aquí las imágenes van por `next/image` (CLAUDE.md). El `transform` del
 *    zoom pasó del medio a un envoltorio, para no competir con los estilos que
 *    `next/image` se escribe a sí mismo.
 *  - **`title` y `scrollHint` aceptan nodos**, no sólo cadenas: así la
 *    tipografía sale de los tokens del proyecto y no de la hoja de estilos del
 *    registro (ver la cabecera de `ScrollExpand.css`).
 *  - **`smoothing` por defecto a 0.** El original interpola la posición con su
 *    propio rAF, pero aquí Lenis ya entrega un scroll interpolado: encadenar
 *    los dos suavizados da sensación de goma. Es el mismo motivo por el que
 *    ScrollTrigger lee de Lenis en vez de suavizar por su cuenta.
 *  - **Refresca ScrollTrigger** tras la primera medición: el componente le
 *    escribe el alto al track, lo que cambia el alto del documento y deja con
 *    posiciones viejas a las secciones fijadas que vengan después.
 *  - **`prefers-reduced-motion`** deja el bloque ya abierto y sin recorrido
 *    reservado, en vez de sólo quitarle el suavizado.
 *  - **El overlay se marca `inert` mientras está apagado.** El original sólo le
 *    animaba la opacidad, que no saca nada del camino: cualquier control dentro
 *    seguiría recibiendo clics y apareciendo al tabular sin verse.
 */

/**
 * Punto del recorrido (0-1) a partir del cual entra `frameDecor`. Tan al final
 * porque su sitio es el marco ya abierto, no el marco creciendo.
 */
const DECOR_AT = 0.9

/**
 * Opacidad del overlay a partir de la cual su contenido pasa a ser
 * interactivo.
 *
 * Hace falta porque el overlay arranca en `opacity: 0` y la opacidad no quita
 * nada del camino: un botón ahí dentro seguiría recibiendo clics y saliendo en
 * el orden de tabulación mientras es invisible, durante casi todo el recorrido.
 * Por debajo de este umbral el bloque va `inert`, que sí lo saca de los tres
 * sitios a la vez —puntero, foco y árbol de accesibilidad—.
 */
const OVERLAY_INTERACTIVE_AT = 0.6

/**
 * Qué parte del `holdDistance` consume la entrada de `holdContent`. El resto
 * del tramo se queda con el contenido ya puesto, para poder leerlo y pulsarlo
 * antes de que la sección se suelte.
 */
const HOLD_IN = 0.5

/** Cuánto sube `holdContent` al entrar, en píxeles. */
const HOLD_RISE = 28

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v)

/**
 * Cuánto tramo de sobra hay tras la apertura, medido en unidades del propio
 * recorrido. Es lo que permite que el avance pase de 1 y quede sitio para
 * animar algo *después* de que el medio esté abierto del todo.
 */
const holdRatio = (c: Config) =>
  Math.max(0, c.holdDistance) / Math.max(0.01, c.scrollDistance)

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1e-6), 0, 1)
  return t * t * (3 - 2 * t)
}

/** Lo que lee el bucle de animación en cada fotograma, siempre al día. */
type Config = {
  startWidth: number
  startHeight: number
  startRadius: number
  endRadius: number
  mediaZoom: number
  scrollDistance: number
  holdDistance: number
  smoothing: number
  overlayScrim: number
  useWindowScroll: boolean
  enabled: boolean
}

export type ScrollExpandProps = {
  /** Ruta del medio, para el `<img>`/`<video>` por defecto. Se ignora con `media`. */
  src?: string
  mediaType?: 'image' | 'video'
  poster?: string
  alt?: string
  /**
   * Sustituye el medio por defecto. Es la vía para pasar un `next/image` con
   * `fill`, que es como van las imágenes en este proyecto.
   */
  media?: React.ReactNode
  /**
   * Contenido que entra **después** de que el medio esté abierto del todo,
   * durante el tramo en el que la sección sigue fijada sin moverse
   * (`holdDistance`).
   *
   * Es lo que `children` no puede hacer: aquellos se descubren a la vez que el
   * recuadro crece, y esto espera a que el recorrido termine. Va ligado al
   * scroll, así que entra al bajar y se va al subir sin lógica aparte.
   */
  holdContent?: React.ReactNode
  /**
   * Capa alineada con el recuadro visible del medio, por delante de él.
   *
   * A diferencia de `children` —que va dentro del recorte y aparece al final—,
   * esto vive fuera de `__frame`, así que no se recorta nunca, y su caja sigue
   * al recuadro mientras se abre. Es el sitio de las esquinas, marcos y demás
   * cromo que tiene que abrazar al medio durante todo el recorrido.
   */
  frameDecor?: React.ReactNode
  /** Rótulo grande sobre la foto; se va conforme el bloque se abre. */
  title?: React.ReactNode
  /** Pista de scroll al pie; desaparece en cuanto empieza el recorrido. */
  scrollHint?: React.ReactNode
  /** Tamaño del recuadro cerrado, en % de la pantalla. */
  startWidth?: number
  startHeight?: number
  /** Radio del recuadro en px, al principio y al final del recorrido. */
  startRadius?: number
  endRadius?: number
  /** Escala del medio cuando el bloque está cerrado; aterriza en 1 al abrirse. */
  mediaZoom?: number
  /** Recorrido y respiro final, en alturas de pantalla. */
  scrollDistance?: number
  holdDistance?: number
  /**
   * Interpolación propia del componente. 0 = pegado al scroll.
   *
   * Déjalo en 0 mientras el recorrido lo marque la página: Lenis ya interpola.
   * Sólo tiene sentido subirlo con un scroll interno (`useWindowScroll` en
   * false), que Lenis no gobierna.
   */
  smoothing?: number
  /** Opacidad máxima del degradado que oscurece la foto al abrirse. */
  overlayScrim?: number
  /** El recorrido lo marca el scroll de la página en vez de uno interno. */
  useWindowScroll?: boolean
  /** En false el bloque se queda abierto del todo, sin escuchar el scroll. */
  enabled?: boolean
  children?: React.ReactNode
} & Omit<React.ComponentPropsWithoutRef<'div'>, 'title' | 'children'>

export function ScrollExpand({
  src = '',
  mediaType = 'image',
  poster = '',
  alt = '',
  media,
  holdContent,
  frameDecor,
  title,
  scrollHint,
  startWidth = 42,
  startHeight = 58,
  startRadius = 0,
  endRadius = 0,
  mediaZoom = 1.35,
  scrollDistance = 1.2,
  holdDistance = 0.35,
  smoothing = 0,
  overlayScrim = 0.45,
  useWindowScroll = false,
  enabled = true,
  children,
  className = '',
  style,
  ...rest
}: ScrollExpandProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const scrimRef = useRef<HTMLDivElement>(null)
  const decorRef = useRef<HTMLDivElement>(null)
  const holdRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)

  /**
   * La configuración viva que lee el bucle de animación.
   *
   * El registro la escribía durante el render (`propsRef.current = {...}`), que
   * es de las cosas que React pide no hacer y que la regla `react-hooks/refs`
   * corta. Se sincroniza en un efecto sin dependencias —corre en cada render— y
   * declarado ANTES del efecto que monta el bucle, de modo que la ref ya está
   * al día cuando aquél la lee. El valor inicial es el del primer render, así
   * que la primera medición tampoco ve un objeto vacío.
   */
  const config: Config = {
    startWidth,
    startHeight,
    startRadius,
    endRadius,
    mediaZoom,
    scrollDistance,
    holdDistance,
    smoothing,
    overlayScrim,
    useWindowScroll,
    enabled,
  }

  const propsRef = useRef<Config>(config)

  useEffect(() => {
    propsRef.current = config
  })

  /**
   * Pinta el estado del bloque para un avance `raw` del recorrido.
   *
   * `raw` va de 0 a `1 + holdRatio`: el tramo 0-1 es la apertura, y lo que pasa
   * de 1 es el `holdDistance`, donde el medio ya está abierto y la sección
   * sigue fijada. Se lleva sin cortar para derivar los dos avances de un único
   * valor interpolado, en vez de suavizar dos por separado.
   */
  const applyProgress = useCallback((raw: number) => {
    const frame = frameRef.current
    const mediaEl = mediaRef.current
    if (!frame || !mediaEl) return
    const c = propsRef.current

    const p = clamp(raw, 0, 1)
    const hold = clamp((raw - 1) / (holdRatio(c) || 1), 0, 1)

    const e = smoothstep(0, 1, p)

    const w = c.startWidth + (100 - c.startWidth) * e
    const h = c.startHeight + (100 - c.startHeight) * e
    const ix = Math.max(0, (100 - w) / 2)
    const iy = Math.max(0, (100 - h) / 2)
    const r = c.startRadius + (c.endRadius - c.startRadius) * e
    frame.style.clipPath = `inset(${iy}% ${ix}% ${iy}% ${ix}% round ${r}px)`

    // El mismo recorte, publicado como variables para quien necesite alinearse
    // con el recuadro visible sin estar dentro de él (`frameDecor`). Van en el
    // escenario y no en el marco: lo que cuelgue del marco se lo come el
    // `clip-path`, que es justo lo que hay que evitar aquí.
    if (stageRef.current) {
      stageRef.current.style.setProperty('--se-inset-x', `${ix}%`)
      stageRef.current.style.setProperty('--se-inset-y', `${iy}%`)
    }

    mediaEl.style.transform = `scale(${c.mediaZoom + (1 - c.mediaZoom) * e})`

    if (scrimRef.current) scrimRef.current.style.opacity = `${c.overlayScrim * e}`

    if (titleRef.current) {
      const out = smoothstep(0.4, 0.88, p)
      titleRef.current.style.opacity = `${1 - out}`
      titleRef.current.style.transform = `translate3d(0, ${-28 * out}px, 0) scale(${1 + 0.06 * out})`
    }

    if (hintRef.current) {
      const gone = smoothstep(0, 0.12, p)
      hintRef.current.style.opacity = `${1 - gone}`
      hintRef.current.style.transform = `translate3d(0, ${8 * gone}px, 0)`
    }

    if (overlayRef.current) {
      const inn = smoothstep(0.68, 1, p)
      overlayRef.current.style.opacity = `${inn}`
      overlayRef.current.style.transform = `translate3d(0, ${18 * (1 - inn)}px, 0)`
      overlayRef.current.inert = inn < OVERLAY_INTERACTIVE_AT
    }

    // El cromo del marco entra al final, con el medio ya descubierto del todo:
    // durante el recorrido el recuadro está creciendo y unos bloques pegados a
    // sus esquinas competirían con ese movimiento. Se queda puesto durante el
    // `holdDistance`, que es el tramo en el que el avance ya está a 1.
    if (decorRef.current) {
      decorRef.current.style.opacity = `${smoothstep(DECOR_AT, 1, p)}`
    }

    // Sube al entrar y baja al salir. Al ir ligado al scroll, la salida es la
    // misma animación al revés: no hay estado que mantener ni que revertir.
    if (holdRef.current) {
      const h = smoothstep(0, HOLD_IN, hold)
      holdRef.current.style.opacity = `${h}`
      holdRef.current.style.transform = `translate3d(0, ${HOLD_RISE * (1 - h)}px, 0)`
      holdRef.current.inert = h < OVERLAY_INTERACTIVE_AT
    }
  }, [])

  useEffect(() => {
    const root = rootRef.current
    const track = trackRef.current
    const stage = stageRef.current
    if (!root || !track || !stage) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    let current = 0
    let target = 0
    let stageH = 0
    let running = false

    const measure = () => {
      const c = propsRef.current
      stageH = c.useWindowScroll ? window.innerHeight : root.clientHeight
      if (stageH <= 0) return
      stage.style.height = `${stageH}px`
      track.style.height = `${stageH * (1 + Math.max(0, c.scrollDistance) + Math.max(0, c.holdDistance))}px`
    }

    const readProgress = () => {
      const c = propsRef.current
      // El techo ya no es 1: por encima está el tramo del `holdDistance`, que
      // es donde entra `holdContent`.
      const techo = 1 + holdRatio(c)
      if (!c.enabled) return techo
      const span = stageH * Math.max(0.01, c.scrollDistance)
      const recorrido = c.useWindowScroll
        ? -track.getBoundingClientRect().top
        : root.scrollTop
      return clamp(recorrido / span, 0, techo)
    }

    // Sin movimiento: el bloque se queda abierto y el track no reserva
    // recorrido, así que no deja un tramo muerto de scroll por delante.
    //
    // Aquí sí se refresca a mano, y es el único sitio: con `reduced-motion` el
    // proveedor de scroll no llega a montar Lenis y se salta su refresco, así
    // que nadie más va a recolocar los disparadores tras cambiar el alto.
    if (reduceMotion) {
      measure()
      track.style.height = stage.style.height
      // El tope del recorrido, no 1: si no, `holdContent` se quedaría apagado.
      applyProgress(1 + holdRatio(propsRef.current))
      ScrollTrigger.refresh()
      return
    }

    const tick = () => {
      const c = propsRef.current
      const k = c.smoothing <= 0 ? 1 : 1 - Math.exp(-1 / (60 * c.smoothing))
      current += (target - current) * k
      if (Math.abs(target - current) < 0.0004) {
        current = target
        running = false
      }
      applyProgress(current)
      raf = running ? requestAnimationFrame(tick) : 0
    }

    const kick = () => {
      if (running) return
      running = true
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const onScroll = () => {
      target = readProgress()
      if (propsRef.current.smoothing <= 0) {
        current = target
        applyProgress(current)
        return
      }
      kick()
    }

    const onResize = () => {
      measure()
      target = readProgress()
      current = target
      applyProgress(current)
    }

    // Sólo medir. El refresco de ScrollTrigger que hacía falta después de
    // cambiar el alto del track lo da `SmoothScrollProvider`: React ejecuta los
    // efectos de los hijos antes que los del padre, así que el suyo llega
    // siempre detrás de este y cubre el cambio.
    //
    // Refrescar también aquí costaba una pasada completa por todos los
    // disparadores de la página —volver a medir, montar y desmontar pines— que
    // se tiraba a la basura un instante después. En una traza de carga, esa
    // pasada de más era una parte grande del `forced reflow` que hacía que las
    // animaciones de entrada se sintieran a tirones.
    measure()
    target = readProgress()
    current = target
    applyProgress(current)

    const scroller: EventTarget = useWindowScroll ? window : root
    scroller.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    const ro = new ResizeObserver(onResize)
    ro.observe(root)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      scroller.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      ro.disconnect()
    }
  }, [applyProgress, useWindowScroll])

  const defaultMedia =
    mediaType === 'video' ? (
      <video src={src} poster={poster} autoPlay muted loop playsInline />
    ) : (
      // Respaldo del registro para cuando no se pasa `media`. En este proyecto
      // no se usa —las imágenes van siempre por `next/image` a través de la
      // prop `media`—, pero se conserva para que el componente siga
      // respondiendo a `src` como documenta React Bits.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} draggable={false} />
    )

  return (
    <div
      ref={rootRef}
      className={`scroll-expand ${useWindowScroll ? '' : 'scroll-expand--scroller'} ${className}`.trim()}
      style={style}
      {...rest}
    >
      <div ref={trackRef} className="scroll-expand__track">
        <div ref={stageRef} className="scroll-expand__stage">
          <div ref={frameRef} className="scroll-expand__frame">
            <div ref={mediaRef} className="scroll-expand__media">
              {media ?? defaultMedia}
            </div>

            <div ref={scrimRef} className="scroll-expand__scrim" />

            {children || holdContent ? (
              <div ref={overlayRef} className="scroll-expand__overlay">
                {children}

                {holdContent ? (
                  <div ref={holdRef} className="scroll-expand__hold">
                    {holdContent}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          {frameDecor ? (
            <div ref={decorRef} aria-hidden="true" className="scroll-expand__decor">
              {frameDecor}
            </div>
          ) : null}

          {title ? (
            <div ref={titleRef} className="scroll-expand__title">
              {title}
            </div>
          ) : null}

          {scrollHint ? (
            <div ref={hintRef} className="scroll-expand__hint">
              {scrollHint}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
