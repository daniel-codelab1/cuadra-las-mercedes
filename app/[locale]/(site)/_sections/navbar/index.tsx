import { getTranslations } from 'next-intl/server'

import { Button, Logotype, ThemeToggle } from '@/components/ui'
import { getFooter } from '@/content/sections/footer'
import { getNavigation } from '@/content/sections/navigation'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'

import { LocaleSwitcher } from './LocaleSwitcher'
import { MobileNav } from './MobileNav'

/**
 * Barra superior fija (sección 1 del Figma) + navegación inferior en móvil.
 *
 * El bloque naranja del CTA ocupa el alto completo de la barra y se apoya en el
 * hilo inferior — por eso el contenedor es `items-stretch` y no `items-center`.
 *
 * El selector de idioma y el de tema van a la derecha del CTA. El de tema no
 * está en el Figma aprobado: se añadió a petición, ver resumen de la sección.
 * Por debajo de `lg` se ocultan aquí arriba: viven dentro del panel de
 * `MobileNav`, que es también quien reemplaza al menú hamburguesa — no hay
 * disparador duplicado en la barra superior.
 *
 * Los enlaces sociales del panel móvil son los mismos del pie
 * (`getFooter(locale).social`): un solo lugar donde se editan.
 */
export async function Navbar({ locale }: { locale: Locale }) {
  const { links, cta } = getNavigation(locale)
  const { social } = getFooter(locale)
  const t = await getTranslations('Nav')
  const tFooter = await getTranslations('Footer')

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-foreground/10 bg-surface">
        <div className="mx-auto flex h-16 items-stretch pl-cell">
          <Link href="/" aria-label={t('home')} className="flex items-center">
            <Logotype height={40} priority />
          </Link>

          <nav aria-label={t('primary')} className="ml-cell-2 hidden items-center gap-7 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-body text-foreground transition-colors hover:text-brand-orange"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-stretch">
            <Button href={cta.href} withArrow={false} className="h-full">
              {cta.label}
            </Button>

            <div className="hidden items-center lg:flex">
              <LocaleSwitcher locale={locale} />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <MobileNav
        locale={locale}
        links={links}
        cta={cta}
        social={social.map((item) => ({ ...item, label: tFooter(item.network) }))}
        labelMenu={t('menu')}
        labelOpen={t('openMenu')}
        labelClose={t('closeMenu')}
      />
    </>
  )
}
