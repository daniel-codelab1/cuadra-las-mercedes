import { setRequestLocale } from 'next-intl/server'

import { assertLocale } from '@/i18n/locale'

import { Bulevar } from './_sections/bulevar'
import { CurvedMarquee } from './_sections/curved-marquee'
import { News } from './_sections/news'
import { Hero } from './_sections/hero'
import { Hub } from './_sections/hub'
import { Financing } from './_sections/financing'
import { Partners } from './_sections/partners'
import { Projects } from './_sections/projects'
import { SkyparkEditorial } from './_sections/skypark-editorial'
import { Stats } from './_sections/stats'

/**
 * Home. Las secciones se montan aquí, una por una, a medida que llegan del
 * Figma. Cada una vive en `app/[locale]/(site)/_sections/<nombre>/index.tsx` y
 * es un componente de servidor salvo la parte que inicializa GSAP.
 */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = assertLocale((await params).locale)
  setRequestLocale(locale)

  return (
    <main>
      <Hero locale={locale} />
      <News locale={locale} />
      <Bulevar locale={locale} />
      <Projects locale={locale} />
      <Financing locale={locale} />
      <CurvedMarquee locale={locale} />
      {/* De las tres versiones de Skypark sólo se monta la editorial. Las
          otras dos siguen en el repo, desmontadas:

            _sections/skypark/          el ascensor por pisos, la original
            _sections/skypark-columns/  las tres columnas que se abren y cierran

          Recuperar cualquiera es volver a importarla y añadir su línea aquí. */}
      <SkyparkEditorial locale={locale} />
      <Stats locale={locale} />
      <Hub locale={locale} />
      {/* `_sections/history/` (las pestañas Historia / Ubicación / Novedades)
          queda desmontada por ahora. Sigue completa en el repo: recuperarla es
          volver a importarla y añadir aquí `<History locale={locale} />`.

          Al desmontarla, el ancla `#historia` se quedó sin destino, así que los
          enlaces que apuntaban a ella se retiraron de la barra y del pie, y el
          CTA del hero pasó a `#novedades`. Al volver a montarla hay que
          reponerlos (`content/sections/{navigation,footer,hero}.ts`). */}
      <Partners locale={locale} />
    </main>
  )
}
