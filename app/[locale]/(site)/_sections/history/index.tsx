import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import { BRANDMARK_CELL_SIZE, Button, RichText } from '@/components/ui'
import { getHistory, type HistoryTab } from '@/content/sections/history'
import type { Locale } from '@/i18n/routing'
import { isVector } from '@/lib/media'

import { HistoryTabs } from './HistoryTabs'



/**
 * Historia / Ubicación / Novedades (sección 4 del Figma).
 *
 * Acento dueño: `teal-dark`, que es el que el Figma usa para el isotipo de esta
 * sección y para su CTA (DESIGN_SYSTEM.md §2).
 *
 * Los paneles se renderizan en el servidor y se le pasan ya montados al
 * componente cliente, que sólo lleva el estado de la pestaña y la animación:
 * así el texto y las imágenes no viajan al bundle de cliente.
 */
export async function History({ locale }: { locale: Locale }) {
  const { intro, tabs } = getHistory(locale)
  const t = await getTranslations('History')

  return (
    <section id="historia" className="px-cell py-cell">
      <HistoryTabs
        tablistLabel={t('tablist')}
        intro={intro}
        cubeSize={BRANDMARK_CELL_SIZE}
        tabs={tabs.map(({ id, label }) => ({ id, label }))}
        // Una cara por pestaña. La forma alterna E/M porque son las dos
        // orientaciones del patrón; el color sale del contenido.
        faces={tabs.map((tab, index) => ({
          shape: index % 2 === 0 ? ('E' as const) : ('M' as const),
          color: tab.accent,
        }))}
        panels={tabs.map((tab) => (
          <HistoryPanel key={tab.id} tab={tab} />
        ))}
      />
    </section>
  )
}

function HistoryPanel({ tab }: { tab: HistoryTab }) {
  return (
    <div>
      {/*
        Alto tope de 450px, y por debajo de ese punto la banda mantiene su
        proporción. La imagen se recorta con `object-cover` en vez de imponer su
        propia altura: las fuentes tienen proporciones distintas (la foto
        histórica es 4:3, el mapa será apaisado) y, como los tres paneles se
        apilan en la misma celda, una más alta que las demás dejaría un hueco
        muerto bajo las otras dos.
      */}
      <div className="relative aspect-[8/3] max-h-[480px] w-full overflow-hidden">
        <Image
          src={tab.media.url}
          alt={tab.media.alt}
          fill
          unoptimized={isVector(tab.media.url)}
          sizes="(min-width: 1024px) 90vw, 100vw"
          className="object-cover"
        />

        {/*
          Escalones blancos que recortan la esquina inferior derecha, el mismo
          recurso de collage del hero. Decorativos.
        */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-cell right-0 h-cell w-cell bg-surface"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-0 h-cell w-cell-2 bg-surface"
        />
      </div>

      <div className="mt-cell grid gap-cell md:grid-cols-2 md:gap-cell-2">
        <div className="space-y-5">
          {tab.columnLeft.map((paragraph, index) => (
            <p key={index} className="text-body text-foreground">
              <RichText value={paragraph} />
            </p>
          ))}
        </div>

        <div className="space-y-5">
          {tab.columnRight.map((paragraph, index) => (
            <p key={index} className="text-body text-foreground">
              <RichText value={paragraph} />
            </p>
          ))}

          <Button href={tab.cta.href} accent="teal-dark">
            {tab.cta.label}
          </Button>
        </div>
      </div>
    </div>
  )
}
