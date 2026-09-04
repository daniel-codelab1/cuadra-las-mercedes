import { getFormatter } from 'next-intl/server'

import type { LegalDocument as Doc } from '@/content/legal'
import type { Locale } from '@/i18n/routing'

/**
 * Pinta un documento legal: titular, fecha de revisión, entradilla y apartados.
 *
 * Es una plantilla compartida por las tres páginas, que sólo se diferencian en
 * el documento que le pasan. Así el día que cambie la maqueta —o haya que
 * añadir un índice, o un enlace de vuelta— se toca en un sitio.
 *
 * La fecha llega en ISO desde el contenido y se formatea aquí con el formateador
 * del idioma activo, que es la regla del proyecto para fechas y números — y en
 * UTC, o una fecha sin hora se desplaza un día según dónde se lea.
 */
export async function LegalDocument({
  doc,
  locale,
  updatedLabel,
}: {
  doc: Doc
  locale: Locale
  /** «Última actualización», ya traducido: es interfaz, no contenido. */
  updatedLabel: string
}) {
  const format = await getFormatter({ locale })

  return (
    <main className="shell py-section">
      {/* `max-w-prose` no es decorativo: una línea de texto legal a todo el
          ancho de la pantalla es ilegible. */}
      <article className="max-w-prose">
        <header>
          <h1 className="font-display text-h1 text-foreground">{doc.title}</h1>

          <p className="mt-cell-half text-label uppercase text-foreground-muted">
            {updatedLabel}{' '}
            <time dateTime={doc.updated}>
              {format.dateTime(new Date(doc.updated), {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                // `timeZone: 'UTC'` es obligatorio y no una preferencia. La
                // fecha del contenido es sólo día, sin hora, y `new Date()` la
                // interpreta como medianoche UTC; formateada en un huso por
                // detrás —Caracas está en UTC−4— sale el día anterior. Con esto
                // se muestra el mismo día en cualquier parte del mundo.
                timeZone: 'UTC',
              })}
            </time>
          </p>

          <p className="mt-cell text-body text-foreground">{doc.intro}</p>
        </header>

        {doc.sections.map((section) => (
          <section key={section.heading} className="mt-cell-2">
            <h2 className="font-display text-h2 text-foreground">{section.heading}</h2>

            {section.paragraphs.map((paragraph, index) => (
              <p key={index} className="mt-cell-half text-body text-foreground-muted">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </article>
    </main>
  )
}
