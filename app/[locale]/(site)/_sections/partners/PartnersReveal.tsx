'use client'

import { useScrollReveal } from '@/lib/animation'

/**
 * Envoltorio cliente de la sección de aliados: sólo sostiene la ref del reveal.
 *
 * Es el patrón estándar del sitio (`useScrollReveal` sobre los hijos marcados
 * con `data-reveal`), no una animación a medida — esta sección está bajo el
 * pliegue, así que entra al llegar a ella y no al cargar la página.
 */
export function PartnersReveal({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'section'>) {
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section ref={ref} className={className} {...props}>
      {children}
    </section>
  )
}
