import type { CSSProperties } from 'react'

/**
 * Geometría de la composición, medida sobre la grilla guía de Figma
 * (DESIGN_SYSTEM.md §5): 20 celdas cuadradas de ancho, 10 de alto.
 *
 * Todas las piezas se posicionan en celdas y no en `vw`/`vh`, que es lo que
 * mantiene las proporciones del Figma intactas: al estrecharse la ventana la
 * composición entera encoge en bloque, sin que unas piezas se muevan respecto
 * de otras. `SkyparkFloors` redefine `--cell` para la sección de modo que la celda
 * también encoja en ventanas bajas y la composición nunca se recorte.
 */
export const COMPOSITION_COLUMNS = 20
export const COMPOSITION_ROWS = 10

/**
 * Tipografía de la sección, también en celdas.
 *
 * Son los tokens de DESIGN_SYSTEM.md §3 (`text-body` = 17px, `text-h2` = 30px)
 * expresados sobre la celda de 72px del Figma. El tamaño tiene que encoger con
 * la celda: si se queda fijo mientras el collage se achica, el párrafo se sale
 * del panel y termina pisando a la foto de detalle. Las clases `text-*` se
 * siguen aplicando —de ellas salen interlineado, tracking y peso—; lo único
 * que se sobrescribe es el tamaño.
 */
export const TYPE = {
  body: 17 / 72,
  title: 30 / 72,
  /** Aire entre el titular y el párrafo (20px sobre la celda de 72). */
  gap: 20 / 72,
} as const

export type CellBox = {
  /** Columna de inicio (0 = borde izquierdo de la composición). */
  x: number
  /** Fila de inicio (0 = borde superior). */
  y: number
  /** Omite `w`/`h` para que esa dimensión la fije el contenido del bloque. */
  w?: number
  h?: number
}

/** Un número de celdas, como longitud CSS. */
export const cells = (n: number) => `calc(var(--cell) * ${n})`

/** Traduce una caja de la grilla guía a los `position: absolute` que la pintan. */
export function cellBox({ x, y, w, h }: CellBox): CSSProperties {
  return {
    left: cells(x),
    top: cells(y),
    ...(w === undefined ? null : { width: cells(w) }),
    ...(h === undefined ? null : { height: cells(h) }),
  }
}

/**
 * Cajas de la composición. Los valores salen de medir la referencia sobre la
 * grilla: es una guía, no una retícula estricta — la foto y el panel la rompen
 * a propósito (DESIGN_SYSTEM.md §5).
 */
export const BOXES = {
  /** Panel de color. Sangra hasta el borde derecho de la ventana. */
  panel: { x: 7, y: 1, h: 8 },
  /** La foto del piso: un solo bloque grande, por delante del panel. */
  photo: { x: 4, y: 2, w: 12, h: 8 },
  /**
   * Rectángulo del color del panel sobre la esquina superior derecha de la
   * foto: es lo que despeja el sitio del texto. Al ser del mismo color se lee
   * como si el panel mordiera la foto, no como un parche.
   */
  photoCorner: { x: 13.5, y: 1, w: 3, h: 5.5 },
  /**
   * Muesca blanca sobre la esquina inferior izquierda de la foto: despeja el
   * párrafo fijo de abajo.
   */
  photoNotch: { x: 3.5, y: 7, w: 3, h: 3 },
  /** Titular + párrafo, sobre el panel de color, a una celda del borde. */
  text: { x: 14.35, y: 2.1, w: 5 },
  /** Párrafo fijo de abajo a la izquierda. */
  footnote: { x: 0, y: 8.2, w: 5 },
  /** Flechas de navegación manual: las dimensiona el propio `ScrollNav`. */
  nav: { x: 0, y: 6.45 },
} as const satisfies Record<string, CellBox>
