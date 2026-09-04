'use client'

import { useEffect, useRef } from 'react'

import { prefersReducedMotion } from '@/lib/animation'
import { cn } from '@/lib/cn'

export type BackgroundVideoProps = {
  src: string
  /** Fotograma de respaldo: se pinta mientras carga y se queda con reduced-motion. */
  poster?: string
  /** Describe el vídeo; va a `aria-label` porque `<video>` no tiene `alt`. */
  alt: string
  className?: string
}

/**
 * Vídeo decorativo que llena su caja, en bucle y sin sonido.
 *
 * No lleva `autoPlay`: la reproducción se arranca desde aquí, y sólo cuando
 * toca. Dos motivos, los dos con consecuencias reales:
 *
 *  - **`prefers-reduced-motion`.** Un bucle rodando sin parar es justo lo que
 *    desactiva quien pide menos movimiento. Con el atributo puesto no hay forma
 *    de impedirlo —CSS no pausa un vídeo—, así que se arranca por código y en
 *    ese caso no se arranca: se queda el póster.
 *  - **Peso.** Un vídeo pesa lo que pesa, y estas secciones están a media
 *    página. Reproducir sólo cuando está a la vista evita descargarlo y
 *    decodificarlo mientras el visitante sigue arriba, y lo pausa al salir en
 *    vez de dejarlo girando fuera de pantalla.
 *
 * El marcado servido y el hidratado son el mismo, así que no hay desajuste de
 * hidratación ni parpadeo: lo único que cambia es si se llama a `play()`.
 */
export function BackgroundVideo({ src, poster, alt, className }: BackgroundVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video || prefersReducedMotion()) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // El navegador puede rechazar la reproducción (ahorro de datos, por
          // ejemplo). Es una promesa rechazada que no rompe nada: se queda el
          // póster, que para eso está.
          void video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      // Un poco de margen para que arranque justo antes de asomar y no se vea
      // el primer fotograma congelado.
      { rootMargin: '200px' },
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      aria-label={alt}
      muted
      loop
      playsInline
      preload="metadata"
      className={cn('size-full object-cover', className)}
    />
  )
}
