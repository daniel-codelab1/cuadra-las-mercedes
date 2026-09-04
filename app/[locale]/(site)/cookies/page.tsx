import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { getLegal } from '@/content/legal'
import { assertLocale } from '@/i18n/locale'

import { LegalDocument } from '../_legal/LegalDocument'

const SLUG = 'cookies' as const

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const locale = assertLocale((await params).locale)
  const { title, intro } = getLegal(locale, SLUG)

  return { title, description: intro }
}

export default async function CookiesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = assertLocale((await params).locale)
  // Sin esto la página deja de renderizarse en estático.
  setRequestLocale(locale)

  const t = await getTranslations('Legal')

  return <LegalDocument doc={getLegal(locale, SLUG)} locale={locale} updatedLabel={t('updated')} />
}
