'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { BarChart3, Building2, Compass, MapPin, Menu, Newspaper, X } from 'lucide-react'

import { Button, SocialIcon, ThemeToggle, type SocialNetwork } from '@/components/ui'
import type { CtaLink } from '@/content/types'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { ACCENT_BG } from '@/lib/accents'
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/animation'
import { cn } from '@/lib/cn'

import { LocaleSwitcher } from './LocaleSwitcher'

/**
 * Un ícono por enlace, para la barra inferior. Van por `href` y no por índice:
 * si el contenido cambia de orden, el ícono sigue al destino, no a la
 * posición. `Compass` es el respaldo si algún día se agrega un enlace sin
 * entrada aquí — mejor un ícono genérico que uno vacío.
 */
const LINK_ICON: Record<string, typeof Compass> = {
  '#novedades': Newspaper,
  '#mapa': MapPin,
  '#directorio': Building2,
  '#cifras': BarChart3,
}

/**
 * Colores de las capas que se destapan detrás del panel al abrirse — el mismo
 * recurso de bloques apilados que usa `skypark`/`bulevar` para recortar una
 * foto, aquí en movimiento. Ninguno es el acento "dueño" de ninguna sección
 * activa, así que no compiten con la regla de un acento por sección.
 */
const LAYER_ACCENTS = ['olive', 'navy'] as const

/**
 * Fuera de pantalla, hacia abajo. Va en `vh` y no en `yPercent`/`%` a
 * propósito: esas unidades se miden contra el alto del propio elemento, y el
 * panel tarda un instante en asentar el suyo tras montarse con `fixed
 * inset-0` (se midió, de puro arrancar, hasta el doble del alto real). `vh`
 * se mide contra la ventana, que es estable desde el primer fotograma — el
 * mismo valor cubre tanto la clase de Tailwind del marcado (estado de
 * partida, antes de que GSAP haga nada) como los tweens.
 */
const OFFSCREEN = '100vh'

/** Cuánto se separa una capa (o el panel) de la siguiente, en el timeline de apertura. */
const LAYER_STEP = 0.07
/** A qué fracción del recorrido del panel arrancan sus contenidos. */
const CONTENT_AT_RATIO = 0.35

export type MobileNavProps = {
  locale: Locale
  links: CtaLink[]
  cta: CtaLink
  social: { network: SocialNetwork; href: string; label: string }[]
  labelMenu: string
  labelOpen: string
  labelClose: string
}

/**
 * Navegación móvil (por debajo de `lg`): barra inferior fija con accesos
 * directos + un panel a pantalla completa para todo lo demás.
 *
 * La barra reemplaza al menú hamburguesa de la navbar superior — su botón
 * "Menú" es el único disparador del panel, no hay uno duplicado arriba.
 *
 * La entrada del panel adapta `StaggeredMenu` de React Bits: capas de color
 * sólido que se destapan una tras otra desde abajo, el panel detrás de ellas,
 * y dentro el título de cada enlace subiendo con un leve giro mientras su
 * número se enciende. Se simplificó el ciclo de texto del botón original (no
 * pega con el resto del sitio, que resuelve sus toggles con un simple cambio
 * de ícono, ver `ThemeToggle`) y el cierre al hacer click afuera, que no
 * aplica: el panel ocupa la pantalla entera en cualquier ancho por debajo de
 * `lg`, así que no hay "afuera" donde hacer click.
 *
 * Con `prefers-reduced-motion` no hay capas ni cascada: el panel aparece y
 * desaparece sin desplazamiento.
 */
export function MobileNav({ locale, links, cta, social, labelMenu, labelOpen, labelClose }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  const layersRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const openTlRef = useRef<gsap.core.Timeline | null>(null)
  const closeTweenRef = useRef<gsap.core.Tween | null>(null)

  // Estado de partida: coincide con la clase `translate-y-[100vh]` que ya
  // trae el marcado, así que el primer pintado no salta al montar GSAP.
  useGSAP(() => {
    const panel = panelRef.current
    const layers = layersRef.current
    if (!panel) return
    gsap.set([panel, ...(layers ? Array.from(layers.children) : [])], { y: OFFSCREEN })
  }, [])

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current
    const layers = layersRef.current ? Array.from(layersRef.current.children) : []
    if (!panel) return null

    openTlRef.current?.kill()
    closeTweenRef.current?.kill()

    const labels = Array.from(panel.querySelectorAll<HTMLElement>('[data-menu-item-label]'))
    const indexes = Array.from(panel.querySelectorAll<HTMLElement>('[data-menu-item-index]'))
    const items = Array.from(panel.querySelectorAll<HTMLElement>('[data-menu-item]'))

    gsap.set(labels, { yPercent: 130, rotate: 6 })
    gsap.set(indexes, { opacity: 0 })
    gsap.set(items, { opacity: 0, y: 20 })

    const tl = gsap.timeline({ paused: true })

    layers.forEach((layer, index) => {
      tl.fromTo(layer, { y: OFFSCREEN }, { y: 0, duration: 0.5, ease: 'power4.out' }, index * LAYER_STEP)
    })

    const panelAt = layers.length ? (layers.length - 1) * LAYER_STEP + 0.08 : 0
    const panelDuration = 0.65
    tl.fromTo(panel, { y: OFFSCREEN }, { y: 0, duration: panelDuration, ease: 'power4.out' }, panelAt)

    const contentAt = panelAt + panelDuration * CONTENT_AT_RATIO

    if (labels.length) {
      tl.to(
        labels,
        { yPercent: 0, rotate: 0, duration: 0.9, ease: 'power4.out', stagger: 0.08 },
        contentAt,
      )
    }
    if (indexes.length) {
      tl.to(indexes, { opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.08 }, contentAt + 0.1)
    }
    if (items.length) {
      tl.to(items, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.07 }, contentAt + 0.15)
    }

    openTlRef.current = tl
    return tl
  }, [])

  const playOpen = useCallback(() => {
    const tl = buildOpenTimeline()
    tl?.play(0)
  }, [buildOpenTimeline])

  const playClose = useCallback(() => {
    openTlRef.current?.kill()
    openTlRef.current = null

    const panel = panelRef.current
    const layers = layersRef.current ? Array.from(layersRef.current.children) : []
    if (!panel) return

    closeTweenRef.current?.kill()
    closeTweenRef.current = gsap.to([...layers, panel], {
      y: OFFSCREEN,
      duration: 0.35,
      ease: 'power3.in',
      overwrite: 'auto',
    })
  }, [])

  const setOpenState = useCallback(
    (next: boolean) => {
      setOpen(next)

      if (prefersReducedMotion()) {
        const panel = panelRef.current
        if (!panel) return
        gsap.set(panel, { y: next ? 0 : OFFSCREEN })
        if (next) {
          gsap.set(panel.querySelectorAll('[data-menu-item-label]'), { yPercent: 0, rotate: 0 })
          gsap.set(panel.querySelectorAll('[data-menu-item-index]'), { opacity: 1 })
          gsap.set(panel.querySelectorAll('[data-menu-item]'), { opacity: 1, y: 0 })
        }
        return
      }

      if (next) playOpen()
      else playClose()
    },
    [playOpen, playClose],
  )

  const toggle = useCallback(() => setOpenState(!open), [open, setOpenState])
  const close = useCallback(() => setOpenState(false), [setOpenState])

  // Con el panel abierto el fondo no debe poder desplazarse.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, close])

  // Fuera del árbol de tabulación y del foco mientras está fuera de pantalla —
  // el mismo papel que `inert` cumple en `ScrollExpand`/`HubZoom` con su overlay.
  useEffect(() => {
    if (panelRef.current) panelRef.current.inert = !open
  }, [open])

  return (
    <>
      <nav
        aria-label={labelMenu}
        className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-foreground/10 bg-surface lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {links.map((link) => {
          const Icon = LINK_ICON[link.href] ?? Compass
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center justify-center gap-1 py-2 text-foreground transition-colors hover:text-brand-orange"
            >
              <Icon aria-hidden="true" className="size-5" />
              <span className="text-xs normal-case">{link.label}</span>
            </Link>
          )
        })}

        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? labelClose : labelOpen}
          className="flex flex-col items-center justify-center gap-1 py-2 text-foreground transition-colors hover:text-brand-orange"
        >
          <span className={cn('transition-transform duration-300', open && 'rotate-90')}>
            {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
          </span>
          <span className="text-xs normal-case">{labelMenu}</span>
        </button>
      </nav>

      {/* Capas de color detrás del panel — sólo decorativas, quedan tapadas
          por el panel en cuanto éste llega a su sitio. */}
      <div ref={layersRef} aria-hidden="true" className="fixed inset-0 z-40 lg:hidden">
        {LAYER_ACCENTS.map((accent) => (
          <div key={accent} className={cn('absolute inset-0 translate-y-[100vh]', ACCENT_BG[accent])} />
        ))}
      </div>

      <div
        id="menu-movil"
        ref={panelRef}
        aria-hidden={!open}
        className="fixed inset-0 z-40 flex translate-y-[100vh] flex-col overflow-y-auto bg-surface pb-28 pt-20 lg:hidden"
      >
        <ul className="flex flex-col px-cell">
          {links.map((link, index) => (
            // `overflow-hidden`: el título entra deslizándose desde abajo de
            // su propia fila — sin recortar la fila, se vería asomar antes de
            // tiempo por debajo del hilo divisorio.
            <li key={link.href} className="overflow-hidden border-b border-foreground/10">
              <Link
                href={link.href}
                onClick={close}
                className="group flex items-baseline justify-between py-4"
              >
                <span
                  data-menu-item-label
                  className="inline-block font-display text-h1 text-foreground transition-colors group-hover:text-brand-coral"
                >
                  {link.label}
                </span>
                <span data-menu-item-index className="shrink-0 text-label text-brand-coral">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div data-menu-item className="mt-8 px-cell">
          <Button href={cta.href} withArrow={false} onClick={close}>
            {cta.label}
          </Button>
        </div>

        <div data-menu-item className="mt-auto flex items-center justify-between px-cell pt-10">
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <LocaleSwitcher locale={locale} />
          </div>

          <ul className="flex items-center gap-3">
            {social.map((item) => (
              <li key={item.network}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={item.label}
                  className="grid size-9 place-items-center border border-foreground/25 text-foreground transition-colors hover:border-brand-orange hover:text-brand-orange"
                >
                  <SocialIcon network={item.network} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
