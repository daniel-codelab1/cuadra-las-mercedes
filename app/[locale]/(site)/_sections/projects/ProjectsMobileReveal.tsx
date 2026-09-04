'use client'

import { useScrollReveal } from '@/lib/animation'

/**
 * Envoltorio cliente de la versión móvil de `projects`: sólo sostiene la ref
 * del reveal estándar del sitio (`data-reveal` + `reveal-init`), igual que
 * `PartnersReveal`. No es una coreografía a medida — a diferencia del carril
 * pinneado de escritorio, aquí no hace falta: es contenido normal en el flujo
 * de la página, así que entra como cualquier otra sección bajo el pliegue.
 */
export function ProjectsMobileReveal({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const ref = useScrollReveal<HTMLDivElement>()

  return (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  )
}
