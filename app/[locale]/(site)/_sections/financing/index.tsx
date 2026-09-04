import { Fragment } from 'react'

import { BrandMark, CircularText } from '@/components/ui'
import { getFinancing } from '@/content/sections/financing'
import type { Locale } from '@/i18n/routing'
import { ACCENT_EMPHASIS_TO } from '@/lib/accents'
import { cn } from '@/lib/cn'

import { FinancingText } from './FinancingText'

/**
 * Diámetro del anillo de marca. Más grande que la celda del isotipo al que
 * sustituye (72px): con las veinte letras de "CUADRA*LAS*MERCEDES*" repartidas
 * en la circunferencia, por debajo de esto no hay sitio para leerlas.
 */
const RING_SIZE = 200

/**
 * Financiamiento (sección 6 del Figma).
 *
 * La sección se fija y el texto se va oscureciendo palabra a palabra con el
 * scroll; cuando termina, suelta el pin y la página continúa. Es el uso
 * documentado de `foreground-muted` dentro de un mismo titular
 * (DESIGN_SYSTEM.md §6).
 *
 * El sello de la esquina es el anillo de marca girando (`CircularText`), y la
 * columna la abre el isotipo de bloques.
 *
 * **La sección ya no tiene un acento dueño único** (DESIGN_SYSTEM.md §2 la daba
 * como `orange`): el isotipo va en `steel-blue`, los separadores del anillo en
 * `coral`, y dentro de la frase hay tramos que llegan a `olive` y a
 * `steel-blue`. Es una excepción pedida, como la fila de cifras; anotarlo aquí
 * para que no se "corrija" por error al repasar la regla.
 */
export function Financing({ locale }: { locale: Locale }) {
  const { text, ring } = getFinancing(locale)

  // Se aplana en el servidor: el HTML sale con la frase entera y legible, cada
  // palabra ya con su color de llegada, y el cliente sólo la recorre para
  // encenderlas. Los espacios entre tramos no cuentan —se normalizan aquí—, de
  // modo que el contenido puede escribirse sin cuidar dónde queda cada espacio.
  const words = text.flatMap((segment) =>
    segment.text
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => ({ word, accent: segment.accent })),
  )

  return (
    <FinancingText
      id="financiamiento"
      // `h-dvh` sólo desde `lg`, que es donde `useScrollEmphasis` fija la
      // sección: por debajo de eso no hay pin (ver su cabecera) y forzar el
      // alto de viewport recortaría el párrafo contra `overflow-hidden` en
      // vez de dejarlo fluir. `overflow-hidden` se queda siempre: también
      // recorta el arranque de la entrada rodada del isotipo, que empieza
      // desplazado fuera de la sección por la izquierda.
      className="relative overflow-hidden py-section lg:h-dvh lg:py-0"
    >
      {/* `flex-col` hasta `lg`: en fila, el anillo (200px fijos) y el párrafo
          no caben lado a lado por debajo de ese ancho y quedan montados uno
          sobre el otro. Apilados no compiten por ancho — el anillo cae debajo,
          pegado al borde derecho con `self-end` para conservar su papel de
          sello de esquina aun sin la fila que lo llevaba ahí. */}
      <div className="flex w-full flex-col items-start gap-cell lg:flex-row lg:justify-between lg:gap-cell-2">
        <div className="max-w-full lg:max-w-[62%]">
          {/* Isotipo de bloques abriendo la columna. Va en su propio bloque y
              no como hermano del párrafo dentro de la fila: así el ancho
              máximo lo fija la columna una sola vez y los dos quedan
              alineados a la izquierda.

              El envoltorio no es decorativo: `BrandMark` no propaga props, de
              modo que un `data-*` puesto encima se perdería sin que TypeScript
              dijera nada (CLAUDE.md). El `w-fit` tampoco: la entrada mide el
              ancho de este elemento para saber cuánto tiene que rodar, y sin él
              ocuparía toda la columna.

              Dimensionado por clase y no con `size={BRANDMARK_CELL_SIZE}`
              (72px fijos): `size-cell-mark` es la misma celda fluida con piso
              de 44px que usa el isotipo de `skypark-editorial`, más chica que
              los 72px fijos en cualquier pantalla por debajo del ancho
              completo de la grilla. La entrada rodada no depende del número:
              mide `offsetWidth` del elemento ya pintado. */}
          <span data-financing-mark className="reveal-init mb-cell lg:mb-cell-half block w-fit">
            <BrandMark shape="E" color="steel-blue" className="size-cell-mark" />
          </span>

          {/* `text-h1` y no `text-5xl` (48px fijos): el mismo tamaño de
              titular de sección que usa `skypark-editorial`, fluido con la
              ventana en vez de fijo. */}
          <p className="font-display text-h1 font-bold text-foreground">
            {words.map(({ word, accent }, index) => (
              <Fragment key={index}>
                {index > 0 ? ' ' : null}
                <span
                  data-emphasis
                  className={cn('emphasis-word', accent && ACCENT_EMPHASIS_TO[accent])}
                >
                  {word}
                </span>
              </Fragment>
            ))}
          </p>
        </div>

        {/* Sustituye al isotipo: mismo papel de sello de marca en la esquina,
            girando. Los separadores van en `coral`, el acento dueño de la
            sección, que es el color que tenía el isotipo.

            `self-end`: pegado al borde derecho también apilado, que es lo que
            lee como "sello de esquina" sin la fila que antes lo llevaba ahí.
            `scale-75 origin-right`: a 200px fijos el anillo pesa casi la mitad
            del ancho de un teléfono; encogerlo con `scale` dejó el cálculo de
            letra del componente intacto —es geometría interna al `size`, no
            algo que recalcular por breakpoint (ver cabecera de CircularText)—
            y `origin-right` lo encoge hacia esa esquina en vez de hacia el
            centro de su caja, que dejaría un hueco entre el anillo y el borde. */}
        <div className="origin-right scale-75 self-end lg:scale-100">
          <CircularText text={ring} accent="coral" size={RING_SIZE} />
        </div>
      </div>
    </FinancingText>
  )
}
