'use client'

import Image from 'next/image'

import type { Partner } from '@/content/types'
import { useMarquee } from '@/lib/animation'
import { cn } from '@/lib/cn'
import { isVector } from '@/lib/media'

/**
 * Caja en la que se dibuja cada logo, en rem. `scale` de cada aliado la
 * multiplica: es la caja lo que crece o encoge, no un `transform`, para que la
 * fila siga reservando el espacio que ocupa cada logo.
 */
const LOGO_BOX = { height: 4, width: 10 }

export type LogoMarqueeProps = {
  partners: Partner[]
  /** Píxeles por segundo. Constante aunque crezca el número de logos. */
  speed?: number
  className?: string
}

/**
 * Carrusel infinito de logos de aliados (DESIGN_SYSTEM.md §4).
 *
 * La lista se pinta dos veces: la animación recorre exactamente la mitad del
 * track, de modo que el ciclo cierra sin salto visible. La segunda copia es
 * decorativa y queda fuera del árbol de accesibilidad, para que un lector de
 * pantalla no lea cada aliado dos veces ni el tabulador pase por enlaces
 * duplicados.
 *
 * Se detiene al pasar el ratón o al enfocar con teclado: los logos son enlaces
 * y no hay forma cómoda de hacer clic en un objetivo en movimiento.
 */
export function LogoMarquee({ partners, speed = 55, className }: LogoMarqueeProps) {
  const { containerRef, trackRef, pause, resume } = useMarquee<HTMLDivElement, HTMLDivElement>({
    speed,
  })

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocusCapture={pause}
      onBlurCapture={resume}
    >
      <div ref={trackRef} className="flex w-max items-center">
        <PartnerRow partners={partners} />
        <PartnerRow partners={partners} duplicate />
      </div>
    </div>
  )
}

function PartnerRow({ partners, duplicate = false }: { partners: Partner[]; duplicate?: boolean }) {
  return (
    <ul
      className="flex w-max items-center"
      aria-hidden={duplicate || undefined}
      inert={duplicate || undefined}
    >
      {partners.map((partner) => (
        <li key={partner.name} className="shrink-0 px-cell">
          <a
            href={partner.href}
            target="_blank"
            rel="noreferrer noopener"
            className="block transition-opacity hover:opacity-60 focus-visible:opacity-60"
          >
            <PartnerLogo partner={partner} />
          </a>
        </li>
      ))}
    </ul>
  )
}

/**
 * Cada aliado tiene dos assets, no uno con un filtro CSS: varios logos usan una
 * versión monocromática blanca en tema oscuro que no es el mismo archivo
 * invertido (DESIGN_SYSTEM.md §6). Se pintan los dos y CSS elige.
 *
 * El `alt` va en la imagen y no como `aria-label` del enlace: la variante
 * oculta se pinta con `display:none`, que la saca del árbol de accesibilidad,
 * así que sólo se anuncia el `alt` de la visible y ese es el nombre del enlace.
 */
function PartnerLogo({ partner }: { partner: Partner }) {
  return (
    <>
      <Logo media={partner.logoLight} scale={partner.scale} className="dark:hidden" />
      <Logo media={partner.logoDark} scale={partner.scale} className="hidden dark:block" />
    </>
  )
}

/**
 * Cada logo se dibuja dentro de una caja y `object-contain` decide si lo limita
 * el ancho o el alto. Eso ya iguala bastante logos apaisados (Cittapp, Binian)
 * con otros casi cuadrados (Baruta), pero no del todo: el ajuste fino lo pone
 * el `scale` que trae cada aliado desde el contenido.
 */
function Logo({
  media,
  scale = 1,
  className,
}: {
  media: Partner['logoLight']
  scale?: number
  className?: string
}) {
  return (
    <Image
      src={media.url}
      alt={media.alt}
      width={media.width}
      height={media.height}
      unoptimized={isVector(media.url)}
      sizes="200px"
      style={{ height: `${LOGO_BOX.height * scale}rem`, width: `${LOGO_BOX.width * scale}rem` }}
      className={cn('object-contain', className)}
    />
  )
}
