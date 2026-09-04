import { setRequestLocale } from 'next-intl/server'

import { Footer } from '@/components/ui'
import { getSite } from '@/content/site'
import { assertLocale } from '@/i18n/locale'

import { Navbar } from './_sections/navbar'

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const locale = assertLocale((await params).locale)
  setRequestLocale(locale)

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar locale={locale} />
      <div className="flex-1">{children}</div>
      {/* `pb-28` deja sitio para la barra de navegación inferior de móvil
          (`MobileNav`, fija en `bottom-0`), que si no taparía el pie de
          página. Sólo hace falta por debajo de `lg`, que es donde esa barra
          existe. */}
      <Footer
        locale={locale}
        description={getSite(locale).footerDescription}
        className="pb-28 lg:pb-0"
      />
    </div>
  )
}
