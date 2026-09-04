import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import { getFooter } from '@/content/sections/footer'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { cn } from '@/lib/cn'

import { Button } from './Button'
import { HoverMark } from './HoverMark'
import { SocialIcon } from './SocialIcon'

export type FooterProps = {
  locale: Locale
  description?: string
  className?: string
}

/**
 * Ancho del rótulo, en unidades de ventana.
 *
 * Medido y no tanteado, con la misma pila tipográfica que usan los titulares de
 * sección (`font-display`). A 1352px de ventana el cuerpo que llena el ancho
 * son 136px, o sea 10vw.
 *
 * **Hay que medir lo que se PINTA, no lo que está escrito.** El texto va en el
 * contenido como «Cuadra Las Mercedes» pero el CSS lo pasa a versalitas, y las
 * mayúsculas son bastante más anchas: medir la cadena tal cual daba 1361px
 * cuando lo pintado ocupaba 1556. Y el `tracking-tight` tampoco entra solo en
 * `measureText`, hay que sumarlo aparte. Con las dos cosas mal, el rótulo se
 * salía 204px y se leía «CUADRA LAS MERCED».
 *
 * **Está atado a dos cosas, y las dos pueden moverse:**
 *
 *  - **El texto.** Con «Todo Cuadra» el valor era 19,5vw: once caracteres
 *    frente a diecinueve. Cambiar el rótulo obliga a volver a medir.
 *  - **La tipografía.** Hoy `--font-display` cae a la sans del sistema porque
 *    Futuru no está en `public/fonts/`. Al instalarla cambian los anchos de los
 *    glifos y este número deja de valer.
 */
const WORDMARK_VW = 10

/** El isotipo vertical que abre la fila de columnas. */
const ICON = { src: '/brand/iconografia-clm-1.png', width: 108, height: 498 }

/**
 * Franja de marca fija (DESIGN_SYSTEM.md §6): fondo negro absoluto y texto
 * blanco en AMBOS temas. No usa `surface`/`foreground` a propósito — no es una
 * superficie themeable, así que los acentos de marca se leen igual siempre.
 *
 * Tres bandas: la retícula de enlaces, la fila de acción y contacto, y el
 * rótulo gigante al pie.
 *
 * **Sobre el rótulo**: va escrito con la fuente de marca y no con el asset del
 * logotipo. Es una excepción pedida a la regla del manual —el logotipo es
 * imagen, no texto— porque los archivos entregados miden 120×44 y 462×174, y a
 * ancho de pantalla habría que escalarlos entre 3× y 12×. Hasta que exista un
 * SVG del logotipo, escribirlo es lo único que da un rótulo nítido.
 */
export async function Footer({ locale, description, className }: FooterProps) {
  const t = await getTranslations('Footer')
  const { columns, cta, social, wordmark } = getFooter(locale)
  const year = new Date().getFullYear()

  return (
    <footer className={cn('overflow-hidden border-t border-white bg-surface-dark text-white', className)}>
      {/* `px-cell` y no `.shell`: la retícula ocupa el ancho de la página con
          una celda de aire a cada lado, en vez de ceñirse a la grilla de
          1440px y quedar centrada. */}
      <div className="px-cell pt-section">
        {/* --- Banda 1: retícula de enlaces -------------------------------
            La fila de 5 pistas (isotipo + 3 columnas + acción) sólo cabe sin
            pisarse a partir de `lg`: a 768px, `auto` de la columna de acción
            pide los ~320px de `max-w-xs` de la descripción y las 3 columnas de
            enlaces colapsan sobre ella. Entre `sm` y `lg` los enlaces pasan a
            su propia rejilla de 3 (`lg:contents` la disuelve en `lg`, así que
            sus `<nav>` vuelven a ser hijos directos de la fila grande) y la
            acción baja a su propia fila con `flex-col` en vez de compartir
            pista con ellas. Por debajo de `sm` sigue apilado en una columna,
            como ya estaba. */}
        <div className="flex flex-col gap-cell lg:grid lg:grid-cols-[auto_repeat(3,minmax(0,1fr))_auto] lg:items-start">
          {/* El isotipo abre la fila. Es la máscara de bloques blancos sobre
              transparente, así que sobre el negro del pie se ve tal cual, sin
              el contenedor de color que necesita `BrandMark` en superficies
              claras. Decorativo: no aporta nada que no diga ya el rótulo. Sólo
              tiene sitio en la fila grande, de ahí que aparezca con ella. */}
          <Image
            src={ICON.src}
            alt=""
            width={ICON.width}
            height={ICON.height}
            className="hidden h-cell-4 w-auto self-start lg:mr-cell lg:block"
          />

          <div className="grid gap-cell sm:grid-cols-3 lg:contents">
            {columns.map((column, index) => (
              <nav
                key={column.title}
                aria-label={column.title}
                // Filete a la izquierda salvo en la primera: separa las
                // columnas sin cajas, el recurso de la referencia de Retool y
                // el que menos ruido mete en una estética de bloques. Activo
                // ya desde `sm`, que es donde empiezan a ir lado a lado.
                className={cn(index > 0 && 'sm:border-l sm:border-white/15 sm:pl-cell')}
              >
                <h2 className="text-eyebrow uppercase text-white">{column.title}</h2>

                <ul className="mt-cell-half mb-cell lg:mb-o flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-body text-white/70 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          {/* La acción: en su propia fila hasta `lg`, columna a la derecha en
              adelante. */}
          <div className="flex flex-col items-start gap-cell lg:gap-cell-half lg:border-l lg:border-white/15 lg:pl-cell">
            {description ? (
              <p className="max-w-xs text-body text-white/70">{description}</p>
            ) : null}

            <Button href={cta.href} accent="orange">
              {cta.label}
            </Button>
          </div>
        </div>

        {/* --- Banda 2: redes y copyright --------------------------------- */}
        <div className="mt-cell-2 flex flex-col gap-cell-half border-t border-white/15 pt-cell-2 lg:pt-cell-half sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex items-center gap-4 mb-cell-2 lg:mb-0">
            {social.map((item) => (
              <li key={item.network}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={t(item.network)}
                  className="grid size-9 place-items-center border border-white/25 text-white/70 transition-colors hover:border-white hover:text-white"
                >
                  <SocialIcon network={item.network} />
                </a>
              </li>
            ))}
          </ul>

          <p className="text-label uppercase text-white/50">{t('copyright', { year })}</p>
        </div>
      </div>

      {/* --- Banda 3: el rótulo, sangrando de borde a borde ---------------
          Fuera de `.shell` a propósito: tiene que tocar los dos bordes.

          `leading-[0.72]` con el bloque recortado por abajo es lo que corta el
          rótulo contra el filo de la página, como en las referencias. El
          `select-none` evita que se seleccione al arrastrar sobre el anillo. */}
      <div className="mt-cell-2 select-none">
        {/* El isotipo persigue al cursor por encima del rótulo. Va envuelto y
            no dentro del `<p>` porque necesita un contenedor posicionado del
            que medir la posición del puntero. */}
        <HoverMark color="terracotta">
          <p
            aria-hidden="true"
            className="whitespace-nowrap text-center font-display font-bold uppercase leading-[0.72] tracking-tight text-white"
            style={{ fontSize: `clamp(3rem, ${WORDMARK_VW}vw, 18rem)` }}
          >
            {wordmark}
          </p>
        </HoverMark>
      </div>
    </footer>
  )
}
