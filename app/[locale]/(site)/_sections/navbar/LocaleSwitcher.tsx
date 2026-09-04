'use client'

import { useTransition } from 'react'
import { useTranslations } from 'next-intl'

import { Flag } from '@/components/ui'
import { usePathname, useRouter } from '@/i18n/navigation'
import { LOCALE_FLAGS, LOCALE_LABELS, routing, type Locale } from '@/i18n/routing'
import { cn } from '@/lib/cn'

/**
 * Selector de idioma de la barra. Con dos idiomas no hace falta un desplegable:
 * el botón muestra la bandera del idioma activo y alterna al otro.
 *
 * `usePathname` de `@/i18n/navigation` devuelve la ruta **sin** el prefijo de
 * idioma, así que cambiar de idioma conserva la página en la que estás.
 */
export function LocaleSwitcher({ locale, className }: { locale: Locale; className?: string }) {
  const t = useTranslations('Locale')
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const target = routing.locales.find((candidate) => candidate !== locale) ?? locale

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(() => router.replace(pathname, { locale: target }))
      }}
      aria-label={t('switchTo', { language: LOCALE_LABELS[target] })}
      title={t('current', { language: LOCALE_LABELS[locale] })}
      className={cn(
        'grid h-14 w-cell-mark place-items-center transition-opacity hover:opacity-70 disabled:opacity-50',
        className,
      )}
    >
      <Flag country={LOCALE_FLAGS[locale]} title={LOCALE_LABELS[locale]} />
    </button>
  )
}
