'use client'

import { ThemeProvider } from 'next-themes'

import { SmoothScrollProvider } from '@/lib/animation'

/**
 * Único client component que envuelve toda la app. Las secciones siguen siendo
 * componentes de servidor: sólo el subárbol que necesita GSAP/Lenis o el tema
 * se marca `"use client"`.
 *
 * `defaultTheme="system"` + `enableSystem`: en la primera visita se respeta la
 * preferencia del sistema operativo, y el toggle la sobrescribe a partir de ahí.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SmoothScrollProvider>{children}</SmoothScrollProvider>
    </ThemeProvider>
  )
}
