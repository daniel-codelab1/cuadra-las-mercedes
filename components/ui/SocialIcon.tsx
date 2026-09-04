import { Globe } from 'lucide-react'

import { cn } from '@/lib/cn'

export type SocialNetwork = 'website' | 'instagram' | 'linkedin'

export type SocialIconProps = {
  network: SocialNetwork
  className?: string
}

/**
 * Iconos de los enlaces públicos de un proyecto o aliado.
 *
 * El de web sale de Lucide, como el resto de la interfaz. Los de Instagram y
 * LinkedIn van dibujados a mano por la misma razón que `Flag`: Lucide dejó de
 * publicar marcas comerciales, así que no existen en la librería
 * (DESIGN_SYSTEM.md §7). Son los glifos oficiales simplificados, con el trazo
 * al mismo grosor que `Arrow` para que convivan en la misma fila.
 *
 * Van en `currentColor`, de modo que el color lo pone quien los usa.
 */
export function SocialIcon({ network, className }: SocialIconProps) {
  const classes = cn('size-5', className)

  if (network === 'website') {
    return <Globe aria-hidden="true" strokeWidth={2} className={classes} />
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="square"
      aria-hidden="true"
      className={classes}
    >
      {network === 'instagram' ? (
        <>
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <circle cx="12" cy="12" r="4" />
          <path d="M17 7h.01" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M4.5 9v11" />
          <path d="M4.5 4.5v.01" strokeLinecap="round" />
          <path d="M10 20V9" />
          <path d="M10 13.5a4.5 4.5 0 0 1 9 0V20" />
        </>
      )}
    </svg>
  )
}
