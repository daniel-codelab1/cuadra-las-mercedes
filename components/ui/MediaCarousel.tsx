'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

import type { MediaSlide } from '@/content/types'
import { prefersReducedMotion } from '@/lib/animation'
import { cn } from '@/lib/cn'
import { isVector } from '@/lib/media'

export type MediaCarouselProps = {
  slides: MediaSlide[]
  /** Milisegundos por diapositiva de imagen. El vídeo avanza al terminar. */
  interval?: number
  /** `sizes` de next/image. Ajústalo al ancho real del hueco en cada sección. */
  sizes?: string
  /** Marca la primera imagen como LCP. Actívalo sólo en el hero. */
  priority?: boolean
  className?: string
}

/**
 * Carrusel de medios que admite foto y vídeo en la misma secuencia
 * (DESIGN_SYSTEM.md §4).
 *
 * - Las imágenes avanzan solas cada `interval`; los vídeos avanzan cuando
 *   terminan, así que nunca se cortan a mitad.
 * - Se pausa al pasar el ratón o al enfocar con teclado, y con
 *   `prefers-reduced-motion` no avanza solo: queda en manos de la paginación.
 * - Sólo la diapositiva activa es visible para lectores de pantalla.
 */
export function MediaCarousel({
  slides,
  interval = 6000,
  sizes = '100vw',
  priority = false,
  className,
}: MediaCarouselProps) {
  const t = useTranslations('Carousel')
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const count = slides.length
  const current = slides[index]

  const goTo = useCallback((next: number) => setIndex(((next % count) + count) % count), [count])
  const next = useCallback(() => goTo(index + 1), [goTo, index])

  useEffect(() => {
    if (count < 2 || paused) return
    // El vídeo manda: avanza en su `onEnded`, no por temporizador.
    if (current.type === 'video') return
    if (prefersReducedMotion()) return

    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % count), interval)
    return () => window.clearTimeout(timer)
  }, [count, paused, current, interval, index])

  // Al volver a una diapositiva de vídeo hay que rebobinarla: el elemento se
  // reutiliza entre pasadas y se habría quedado en su último frame.
  useEffect(() => {
    const video = videoRef.current
    if (!video || current.type !== 'video') return
    video.currentTime = 0
    void video.play().catch(() => {
      // Autoplay bloqueado (p. ej. sin `muted` efectivo): seguimos de largo.
      next()
    })
  }, [current, next])

  return (
    <div
      className={cn('relative overflow-hidden bg-foreground/5', className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      aria-roledescription={t('roleDescription')}
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          className={cn(
            'absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none',
            i === index ? 'opacity-100' : 'opacity-0',
          )}
          aria-hidden={i !== index}
          inert={i !== index}
        >
          {slide.type === 'image' ? (
            <Image
              src={slide.image.url}
              alt={slide.image.alt}
              fill
              sizes={sizes}
              priority={priority && i === 0}
              unoptimized={isVector(slide.image.url)}
              className="object-cover"
            />
          ) : (
            <video
              ref={i === index ? videoRef : null}
              src={slide.src}
              poster={slide.poster?.url}
              aria-label={slide.alt}
              muted
              playsInline
              preload="metadata"
              onEnded={next}
              className="size-full object-cover"
            />
          )}
        </div>
      ))}

      {count > 1 ? (
        // Paginación con cuadrados (uno relleno = activo), el mismo lenguaje
        // que el carrusel de proyectos. Sin ella el carrusel no tendría forma
        // de pausarse ni de navegarse con teclado.
        <div className="absolute bottom-4 right-4 z-10 flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={t('goToSlide', { current: i + 1, total: count })}
              aria-current={i === index}
              className={cn(
                'size-2.5 shadow-[0_0_0_1px_rgba(0,0,0,0.25)] transition-colors',
                i === index ? 'bg-white' : 'bg-white/40 hover:bg-white/70',
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
