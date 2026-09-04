import type { Metadata, Viewport } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'

import { assertLocale } from '@/i18n/locale'
import { routing } from '@/i18n/routing'

import { fontVariables } from '../fonts'
import { Providers } from '../providers'
import '../globals.css'

const SITE_URL = 'https://www.cuadralasmercedes.com'

/** Ruta pública de cada idioma. El español no lleva prefijo (`localePrefix: 'as-needed'`). */
const LOCALE_PATHS: Record<string, string> = { es: '/', en: '/en' }

/** Prerrenderiza los dos idiomas en build en vez de resolverlos por petición. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Metadata' })

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t('title'), template: `%s · ${t('title')}` },
    description: t('description'),
    alternates: {
      canonical: LOCALE_PATHS[locale] ?? '/',
      // hreflang: le dice a los buscadores que estas URLs son la misma página
      // en distintos idiomas, en vez de contenido duplicado.
      languages: { es: '/', en: '/en', 'x-default': '/' },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'en' ? 'en_US' : 'es_VE',
      alternateLocale: locale === 'en' ? 'es_VE' : 'en_US',
      siteName: 'Cuadra Las Mercedes',
    },
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  // `[locale]` es en la práctica un catch-all: cualquier ruta desconocida cae
  // aquí, así que hay que rechazar los valores que no son un idioma real.
  const locale = assertLocale((await params).locale)

  // Permite el renderizado estático: sin esto, leer el idioma marcaría la
  // página como dinámica.
  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    // suppressHydrationWarning: next-themes escribe la clase de tema en <html>
    // antes de la hidratación, así que servidor y cliente difieren a propósito.
    <html lang={locale} suppressHydrationWarning className={fontVariables}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
