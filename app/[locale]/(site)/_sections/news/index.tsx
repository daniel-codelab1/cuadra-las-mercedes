import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import { Button, Rail } from '@/components/ui'
import { getNews, type NewsItem } from '@/content/sections/news'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { ACCENT_BG } from '@/lib/accents'
import { cn } from '@/lib/cn'
import { isVector } from '@/lib/media'

import { NewsReveal } from './NewsReveal'

/**
 * Novedades: un carril de tarjetas con las últimas publicaciones.
 *
 * Cada tarjeta es foto, una franja del color de acento de esa noticia, titular
 * y una línea de contexto. La franja es lo que distingue una tarjeta de otra de
 * un vistazo, y por eso el color viaja en el contenido y no se calcula aquí.
 *
 * El carril y sus flechas son de cliente; las tarjetas se montan en el servidor
 * y se le pasan como hijas, así que el contenido no viaja al bundle. Lo mismo
 * con `NewsReveal`, que sólo sostiene la línea de tiempo de entrada.
 */
export async function News({ locale }: { locale: Locale }) {
  const { title, cta, items } = getNews(locale)
  const t = await getTranslations('News')

  return (
    <NewsReveal id="novedades" className="px-cell pb-cell pt-section">
      {/* Titular a la izquierda y flechas a la derecha, como la referencia. El
          carril cuelga del mismo bloque para que las flechas y las tarjetas
          compartan estado sin subirlo a la sección. */}
      <Rail
        labelPrev={t('previous')}
        labelNext={t('next')}
        heading={
          <h2
            data-news-title
            className="reveal-init max-w-[18ch] font-display text-h1 text-foreground"
          >
            {title}
          </h2>
        }
      >
        {items.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </Rail>

      {/* El `data-*` va en el envoltorio y no en `Button`: los componentes de
          `components/ui` no propagan atributos sueltos y el marcador se
          perdería en silencio, dejando el botón invisible para siempre. */}
      <div data-news-cta className="reveal-init mt-cell">
        <Button href={cta.href} accent="orange">
          {cta.label}
        </Button>
      </div>
    </NewsReveal>
  )
}

/**
 * Una parada del carril.
 *
 * `snap-start` la engancha al borde izquierdo al soltarla, de modo que el
 * carril nunca se queda a medio camino entre dos tarjetas.
 */
function Card({ item }: { item: NewsItem }) {
  return (
    <article className="w-[min(78vw,33rem)] shrink-0 snap-start">
      <Link href={item.href} className="group block">
        {/* Foto y franja se destapan juntas: son una sola pieza gráfica, y
            barrerlas por separado partiría el barrido en dos. `draw-init` es
            el mismo recorte de partida que usa `useDrawLine` (tapado del todo
            desde la derecha, `inset(0% 100% 0% 0%)`): no hace falta una clase
            propia para este arranque. */}
        <div data-news-media className="draw-init">
          <div className="relative aspect-[5/4] overflow-hidden">
            <Image
              src={item.image.url}
              alt={item.image.alt}
              fill
              unoptimized={isVector(item.image.url)}
              sizes="(min-width: 1024px) 33rem, 78vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Muescas escalonadas mordiendo la esquina superior derecha: una de
                dos celdas de ancho por una de alto pegada arriba, y otra de 1×1
                justo debajo. Es el mismo escalón que el bulevar, en espejo.

                Van dentro de la caja de la foto, que recorta, así que la imagen
                puede ampliarse en hover por debajo sin desbordarlas. */}
            <span aria-hidden="true" className="absolute right-0 top-0 h-cell-mark w-cell-mark-2 bg-surface" />
            <span aria-hidden="true" className="absolute right-0 top-cell-mark size-cell-mark bg-surface" />
          </div>

          {/* La franja de color, bajo la foto. */}
          <div className={cn('h-3 w-full', ACCENT_BG[item.accent])} />
        </div>

        <div data-news-body className="reveal-init">
          <h3 className="mt-cell-half font-display text-h2 text-foreground">{item.title}</h3>

          <p className="mt-2 text-sm lg:text-body text-foreground lg:text-foreground-muted">{item.summary}</p>
        </div>
      </Link>
    </article>
  )
}
