import { createNavigation } from 'next-intl/navigation'

import { routing } from './routing'

/**
 * Envoltorios de la navegación de Next que añaden el prefijo de idioma solos.
 *
 * **Usar siempre estos en lugar de `next/link` y `next/navigation`** para
 * enlaces internos: con `next/link` un enlace desde `/en` perdería el idioma.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
