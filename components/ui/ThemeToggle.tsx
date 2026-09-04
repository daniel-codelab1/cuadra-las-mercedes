'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useTranslations } from 'next-intl'

import { cn } from '@/lib/cn'

/**
 * Toggle claro/oscuro.
 *
 * No usa el patrón `mounted` con `useEffect`: next-themes escribe la clase de
 * tema en `<html>` con un script inline antes de la hidratación, así que basta
 * con renderizar ambos iconos y dejar que CSS elija cuál se ve. Así no hay
 * desajuste de hidratación, ni parpadeo, ni un render extra.
 *
 * `resolvedTheme` sólo se lee dentro del handler, nunca durante el render: allí
 * ya está montado y devuelve el tema real (importa porque con `enableSystem`
 * el valor de `theme` puede ser `'system'`).
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const t = useTranslations('Theme')

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      aria-label={t('toggle')}
      className={cn(
        'grid h-14 w-cell-mark place-items-center text-foreground transition-colors hover:text-brand-orange',
        className,
      )}
    >
      <Moon aria-hidden="true" className="block size-5 dark:hidden" />
      <Sun aria-hidden="true" className="hidden size-5 dark:block" />
    </button>
  )
}
