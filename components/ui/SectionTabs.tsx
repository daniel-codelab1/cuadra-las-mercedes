'use client'

import { cn } from '@/lib/cn'

export type SectionTab = {
  id: string
  label: string
}

export type SectionTabsProps = {
  tabs: SectionTab[]
  value: string
  onValueChange: (id: string) => void
  className?: string
  /** Etiqueta accesible del grupo (ej. "Secciones de Historia"). */
  label: string
  /**
   * `label` es el tamaño pequeño en versalitas; `display` el titular grande de
   * la sección de Historia. Misma estructura, sólo cambia la escala.
   */
  size?: 'label' | 'display'
  /** `id` del panel que controla cada pestaña, para enlazarlas con `aria-controls`. */
  panelId?: (tabId: string) => string
}

const SIZES = {
  label: {
    list: 'gap-3',
    item: 'gap-3',
    tab: 'text-label uppercase',
    separator: 'text-gray-400',
  },
  display: {
    list: 'gap-x-4 gap-y-1',
    item: 'gap-x-4',
    tab: 'font-display text-h1',
    separator: 'font-display text-h1 text-gray-400',
  },
} as const

/**
 * Tabs de sección: lista horizontal separada por "/" (DESIGN_SYSTEM.md §4).
 *
 * El ítem activo usa `foreground` (negro en claro, blanco en oscuro); los
 * inactivos usan `gray-400`, que es fijo en ambos temas por decisión de marca.
 */
export function SectionTabs({
  tabs,
  value,
  onValueChange,
  className,
  label,
  size = 'label',
  panelId = (tabId) => `panel-${tabId}`,
}: SectionTabsProps) {
  const styles = SIZES[size]

  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn('flex flex-wrap items-center', styles.list, className)}
    >
      {tabs.map((tab, index) => (
        <div key={tab.id} className={cn('flex items-center', styles.item)}>
          {index > 0 ? (
            <span aria-hidden="true" className={styles.separator}>
              /
            </span>
          ) : null}
          <button
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={value === tab.id}
            aria-controls={panelId(tab.id)}
            onClick={() => onValueChange(tab.id)}
            className={cn(
              'transition-colors',
              styles.tab,
              value === tab.id
                ? 'font-bold text-foreground'
                : 'text-gray-400 hover:text-foreground-muted',
            )}
          >
            {tab.label}
          </button>
        </div>
      ))}
    </div>
  )
}
