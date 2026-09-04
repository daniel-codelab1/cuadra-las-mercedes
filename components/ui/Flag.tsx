import { cn } from '@/lib/cn'

export type FlagCountry = 'VE' | 'GB'

// Arco de 8 estrellas sobre la franja azul, calculado sobre un lienzo de 60×30.
const VE_STARS = [
  [17.7, 18.4],
  [20.0, 16.4],
  [23.4, 14.9],
  [27.0, 14.1],
  [33.0, 14.1],
  [36.6, 14.9],
  [40.0, 16.4],
  [42.3, 18.4],
] as const

/**
 * Banderas del selector de idioma, recortadas en círculo.
 *
 * Son ilustraciones, no iconos de sistema: van como SVG en línea y no pasan por
 * `Arrow`. El lienzo es 60×30 (proporción real 2:1) y se recorta al círculo con
 * `preserveAspectRatio="slice"`, para no deformar la bandera.
 */
export function Flag({
  country,
  title,
  className,
}: {
  country: FlagCountry
  title: string
  className?: string
}) {
  return (
    <span
      role="img"
      aria-label={title}
      className={cn('block size-7 shrink-0 overflow-hidden rounded-full', className)}
    >
      <svg
        viewBox="0 0 60 30"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        className="size-full"
      >
        {country === 'VE' ? <Venezuela /> : <UnitedKingdom />}
      </svg>
    </span>
  )
}

function Venezuela() {
  return (
    <>
      <rect x="0" y="0" width="60" height="10" fill="#FFCE00" />
      <rect x="0" y="10" width="60" height="10" fill="#00247D" />
      <rect x="0" y="20" width="60" height="10" fill="#CF142B" />
      <g fill="#FFFFFF">
        {VE_STARS.map(([x, y]) => (
          <polygon
            key={`${x}-${y}`}
            points="0,-1.6 0.38,-0.52 1.52,-0.49 0.61,0.2 0.94,1.29 0,0.64 -0.94,1.29 -0.61,0.2 -1.52,-0.49 -0.38,-0.52"
            transform={`translate(${x} ${y})`}
          />
        ))}
      </g>
    </>
  )
}

function UnitedKingdom() {
  return (
    <>
      <clipPath id="flag-gb-quarters">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <rect x="0" y="0" width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" strokeWidth="6" />
      <path
        d="M0,0 L60,30 M60,0 L0,30"
        clipPath="url(#flag-gb-quarters)"
        stroke="#C8102E"
        strokeWidth="4"
      />
      <path d="M30,0 v30 M0,15 h60" stroke="#FFFFFF" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </>
  )
}
