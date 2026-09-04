/**
 * Colores de acento de marca (DESIGN_SYSTEM.md §2).
 *
 * Tailwind no puede generar clases desde strings dinámicos, así que cada acento
 * necesita su clase escrita literalmente. Estos mapas son el único lugar del
 * código donde eso ocurre: los componentes reciben `accent="navy"` y consultan
 * aquí, nunca construyen `bg-brand-${accent}`.
 */

export const ACCENTS = [
  'orange',
  'terracotta',
  'coral-light',
  'coral',
  'steel-blue',
  'navy',
  'olive',
  'teal-dark',
] as const

export type Accent = (typeof ACCENTS)[number]

/** Fondo sólido + estado hover (usa la variante "dark" del token). */
export const ACCENT_BG: Record<Accent, string> = {
  orange: 'bg-brand-orange',
  terracotta: 'bg-brand-terracotta',
  'coral-light': 'bg-brand-coral-light',
  coral: 'bg-brand-coral',
  'steel-blue': 'bg-brand-steel-blue',
  navy: 'bg-brand-navy',
  olive: 'bg-brand-olive',
  'teal-dark': 'bg-brand-teal-dark',
}

export const ACCENT_BG_HOVER: Record<Accent, string> = {
  orange: 'hover:bg-brand-orange-dark',
  terracotta: 'hover:bg-brand-terracotta-dark',
  'coral-light': 'hover:bg-brand-coral-light-dark',
  coral: 'hover:bg-brand-coral-dark',
  'steel-blue': 'hover:bg-brand-steel-blue-dark',
  navy: 'hover:bg-brand-navy-dark',
  olive: 'hover:bg-brand-olive-dark',
  'teal-dark': 'hover:bg-brand-teal-dark-dark',
}

/**
 * Variante "dark" activada al hacer hover sobre un ancestro con `group`.
 * La necesita `Button`: el hover ocurre sobre el `<a>`/`<button>` contenedor,
 * pero el color lo pintan los `<span>` de dentro.
 */
export const ACCENT_BG_GROUP_HOVER_DARK: Record<Accent, string> = {
  orange: 'group-hover:bg-brand-orange-dark',
  terracotta: 'group-hover:bg-brand-terracotta-dark',
  'coral-light': 'group-hover:bg-brand-coral-light-dark',
  coral: 'group-hover:bg-brand-coral-dark',
  'steel-blue': 'group-hover:bg-brand-steel-blue-dark',
  navy: 'group-hover:bg-brand-navy-dark',
  olive: 'group-hover:bg-brand-olive-dark',
  'teal-dark': 'group-hover:bg-brand-teal-dark-dark',
}

/** Variante "dark" del token como fondo sólido (estado pressed, sombras). */
export const ACCENT_BG_DARK: Record<Accent, string> = {
  orange: 'bg-brand-orange-dark',
  terracotta: 'bg-brand-terracotta-dark',
  'coral-light': 'bg-brand-coral-light-dark',
  coral: 'bg-brand-coral-dark',
  'steel-blue': 'bg-brand-steel-blue-dark',
  navy: 'bg-brand-navy-dark',
  olive: 'bg-brand-olive-dark',
  'teal-dark': 'bg-brand-teal-dark-dark',
}

export const ACCENT_TEXT: Record<Accent, string> = {
  orange: 'text-brand-orange',
  terracotta: 'text-brand-terracotta',
  'coral-light': 'text-brand-coral-light',
  coral: 'text-brand-coral',
  'steel-blue': 'text-brand-steel-blue',
  navy: 'text-brand-navy',
  olive: 'text-brand-olive',
  'teal-dark': 'text-brand-teal-dark',
}

/**
 * Color al que llega el barrido de énfasis (`.emphasis-word`, sección
 * `financing`): escribe `--emphasis-to`, que es el extremo del `color-mix`.
 *
 * Se escribe con `theme()` y no con el hex suelto para que el valor siga
 * saliendo de `tailwind.config.ts`. El `.DEFAULT` es obligatorio: los `brand.*`
 * son objetos con variante `dark`, y sin él `theme()` devolvería el objeto.
 */
export const ACCENT_EMPHASIS_TO: Record<Accent, string> = {
  orange: '[--emphasis-to:theme(colors.brand.orange.DEFAULT)]',
  terracotta: '[--emphasis-to:theme(colors.brand.terracotta.DEFAULT)]',
  'coral-light': '[--emphasis-to:theme(colors.brand.coral-light.DEFAULT)]',
  coral: '[--emphasis-to:theme(colors.brand.coral.DEFAULT)]',
  'steel-blue': '[--emphasis-to:theme(colors.brand.steel-blue.DEFAULT)]',
  navy: '[--emphasis-to:theme(colors.brand.navy.DEFAULT)]',
  olive: '[--emphasis-to:theme(colors.brand.olive.DEFAULT)]',
  'teal-dark': '[--emphasis-to:theme(colors.brand.teal-dark.DEFAULT)]',
}

export const ACCENT_BORDER: Record<Accent, string> = {
  orange: 'border-brand-orange',
  terracotta: 'border-brand-terracotta',
  'coral-light': 'border-brand-coral-light',
  coral: 'border-brand-coral',
  'steel-blue': 'border-brand-steel-blue',
  navy: 'border-brand-navy',
  olive: 'border-brand-olive',
  'teal-dark': 'border-brand-teal-dark',
}
