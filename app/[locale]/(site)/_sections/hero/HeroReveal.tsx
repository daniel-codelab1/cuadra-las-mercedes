'use client'

import { useRef } from 'react'

import { gsap, prefersReducedMotion, useGSAP } from '@/lib/animation'

/**
 * Secuencia de entrada del hero.
 *
 * Sólo orquesta: el marcado y los textos los pone el componente de servidor y
 * llegan como `children`, así que nada de contenido viaja al bundle de cliente.
 * Los elementos se marcan con `data-hero` y arrancan con la clase
 * `reveal-init`.
 *
 * Orden pedido en el diseño:
 *   1. el antetítulo
 *   2. la flecha dentro de su caja de color
 *   3. el titular, escrito carácter a carácter
 *   4. el resto (labels, filete, párrafo, CTA) y la columna de medios
 *   5. la fila de debajo de la imagen: fecha de inicio + pie de foto
 */
export function HeroReveal({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      // `reveal-init` ya deja todo visible bajo reduced-motion, y el cursor de
      // escritura se queda oculto por su clase `hidden`: no hay nada que hacer.
      if (prefersReducedMotion()) return

      // `gsap.utils.toArray` no hereda el scope de useGSAP (el scope sólo
      // alcanza al texto de selector que se pasa a los métodos de GSAP), así
      // que aquí se consulta contra la raíz a mano.
      const chars = Array.from(
        root.current?.querySelectorAll<HTMLElement>('[data-hero="char"]') ?? [],
      )

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
      })

      // 1. El antetítulo.
      tl.addLabel('eyebrow')
        .fromTo(
          '[data-hero="eyebrow"]',
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.7 },
          'eyebrow',
        )

        // 2. La caja de la flecha entra girando ligeramente sobre sí misma.
        .addLabel('arrow', '-=0.15')
        .fromTo(
          '[data-hero="arrow"]',
          { opacity: 0, scale: 0.5, rotate: -25 },
          { opacity: 1, scale: 1, rotate: 0, duration: 0.5, ease: 'back.out(2)' },
          'arrow',
        )

        // 3. Tecleo del titular: sin ease y con un paso fijo por carácter, que
        //    es lo que hace que se lea como escritura y no como un fundido.
        //    El cursor se muestra y se oculta con `display` y no con opacidad:
        //    su parpadeo es una animación CSS sobre `opacity`, que ganaría a
        //    cualquier valor que GSAP escribiera en línea.
        .addLabel('type', '-=0.05')
        .set('[data-hero="caret"]', { display: 'inline-block' }, 'type')
        .to(chars, { opacity: 1, duration: 0.001, stagger: 0.055, ease: 'none' }, 'type')
        .set('[data-hero="caret"]', { display: 'none' }, '>+=0.7')

        // 4. El resto entra escalonado, solapando el final del tecleo.
        .addLabel('rest', `-=${Math.min(chars.length * 0.055, 0.9)}`)
        .fromTo(
          '[data-hero="rule"]',
          { opacity: 1, scaleX: 0 },
          { scaleX: 1, duration: 0.8, ease: 'power2.inOut' },
          'rest',
        )
        .fromTo(
          '[data-hero="item"]',
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.75, stagger: 0.12 },
          'rest+=0.1',
        )
        .fromTo(
          '[data-hero="media"]',
          { opacity: 0, y: 34, scale: 1.03 },
          { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power2.out' },
          'eyebrow+=0.15',
        )
        .fromTo(
          '[data-hero="patch"]',
          { opacity: 0, scale: 0.85 },
          { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.6)' },
          'rest',
        )

        // La fila de debajo de la imagen (fecha de inicio + pie de foto) entra
        // como una unidad, después del resto: es lo último que se lee.
        .fromTo(
          '[data-hero="meta"]',
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 },
          'rest+=0.3',
        )
    },
    { scope: root },
  )

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  )
}
