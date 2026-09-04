import { Fragment } from 'react'

import type { RichText as RichTextValue } from '@/content/types'

/**
 * Pinta un texto con tramos en negrita (`content/types.ts`).
 * Devuelve contenido en línea: el llamante decide el elemento contenedor.
 */
export function RichText({ value }: { value: RichTextValue }) {
  return (
    <>
      {value.map((segment, index) =>
        segment.bold ? (
          <strong key={index} className="font-bold">
            {segment.text}
          </strong>
        ) : (
          <Fragment key={index}>{segment.text}</Fragment>
        ),
      )}
    </>
  )
}

/** Versión en texto plano, para `alt`, `aria-label` o metadatos. */
export function richTextToPlain(value: RichTextValue) {
  return value.map((segment) => segment.text).join('')
}
