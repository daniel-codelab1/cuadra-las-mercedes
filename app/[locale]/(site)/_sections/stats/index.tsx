import { Arrow, CountUp, StatCard } from '@/components/ui'
import { getStats } from '@/content/sections/stats'
import type { Locale } from '@/i18n/routing'

import { StatsReveal } from './StatsReveal'

/**
 * El contador arranca en cuanto la cifra asoma por abajo, que es justo cuando
 * el reveal de la sección la está haciendo aparecer: así nunca se ve un cero
 * quieto esperando su turno.
 */
const COUNT_START = 'top 100%'

/**
 * Las Mercedes en números (sección "Cifras" del Figma).
 *
 * Antetítulo con la flecha navy —el acento dueño de la sección— y fila de
 * cuatro cifras. Es la excepción documentada a "un acento por sección": cada
 * tarjeta subraya con el suyo (DESIGN_SYSTEM.md §2).
 *
 * Todo el contenido es de servidor; el envoltorio cliente sólo aporta las dos
 * animaciones de entrada.
 */
export function Stats({ locale }: { locale: Locale }) {
  const { title, stats } = getStats(locale)

  return (
    <StatsReveal id="cifras" aria-labelledby="cifras-titulo" className="px-cell py-section">
      <div className="flex items-center mb-cell-2 lg:mb-0 gap-4">
        <span
          data-reveal
          className="reveal-init grid size-10 shrink-0 place-items-center bg-brand-navy"
        >
          <Arrow direction="down" className="size-4 text-white" />
        </span>

        <h2 id="cifras-titulo" data-reveal className="reveal-init text-lg lg:text-2xl font-bold text-foreground">
          {title}
        </h2>
      </div>

      {/* Media celda entre columnas, como en el Figma; una celda entre filas,
          que es cuando la fila se parte en dos y las tarjetas se apilan. */}
      <div className="mt-cell grid gap-x-cell-half gap-y-cell sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.id}
            animated
            accent={stat.accent}
            label={stat.label}
            description={stat.description}
            value={
              <CountUp
                to={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                decimals={stat.decimals}
                locale="en-US"
                start={COUNT_START}
              />
            }
          />
        ))}
      </div>
    </StatsReveal>
  )
}
