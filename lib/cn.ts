import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * tailwind-merge no conoce nuestra escala tipográfica: al ver `text-label`
 * junto a `text-white` asume que ambos son color de texto y descarta el
 * primero, dejando el botón con el tamaño por defecto. Hay que declararle los
 * tokens propios de `tailwind.config.ts` para que los clasifique como
 * tamaño de fuente.
 *
 * Lo mismo pasa con la escala de espaciado propia (`cell`, `cell-2`, …): sin
 * declararla, `gap-cell-half` no se reconoce como un `gap` y no pisa al
 * `gap-px` que trae el componente por defecto — el conflicto se resuelve mal y
 * la clase de quien llama se pierde en silencio.
 *
 * Regla: todo token nuevo de `fontSize` o de `spacing` en la config debe
 * añadirse aquí.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: [
        'cell',
        'cell-half',
        'cell-2',
        'cell-3',
        'cell-4',
        'cell-5',
        'cell-mark-half',
        'cell-mark',
        'cell-mark-2',
        'cell-mark-3',
        'section',
        'navbar',
      ],
    },
    classGroups: {
      'font-size': [
        { text: ['display', 'h1', 'h2', 'body', 'label', 'eyebrow', 'statement', 'stat'] },
      ],
    },
  },
})

/** Une clases condicionales y resuelve conflictos de Tailwind. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
