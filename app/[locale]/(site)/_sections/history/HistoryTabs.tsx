'use client'

import { useState } from 'react'

import {
  BrandMarkCube,
  SectionTabs,
  type BrandMarkCubeFace,
  type SectionTab,
} from '@/components/ui'
import { useElevator, useScrollReveal } from '@/lib/animation'

export type HistoryTabsProps = {
  tabs: SectionTab[]
  /** Una cara de cubo por pestaña, en el mismo orden. */
  faces: BrandMarkCubeFace[]
  /** Un panel por pestaña, en el mismo orden. Llegan renderizados del servidor. */
  panels: React.ReactNode[]
  tablistLabel: string
  intro: string
  cubeSize: number
}

const PANEL_ID = (tabId: string) => `panel-${tabId}`

/**
 * Cabecera de dos columnas + paneles con transición de ascensor.
 *
 * Los paneles se apilan en una misma celda de grid, de modo que el contenedor
 * mide siempre lo que el panel más alto: al cambiar de pestaña no hay salto de
 * layout, que es justo lo que rompería la ilusión del ascensor.
 *
 * La transición entre paneles la lleva `useElevator`, el mismo hook que usa la
 * sección de Torre Skypark.
 *
 * Convive con dos animaciones que no se pisan: el reveal de entrada actúa sobre
 * los elementos marcados `data-reveal` (incluida la pila entera), y el ascensor
 * sobre los hijos de la pila.
 */
export function HistoryTabs({
  tabs,
  faces,
  panels,
  tablistLabel,
  intro,
  cubeSize,
}: HistoryTabsProps) {
  const [active, setActive] = useState(0)
  const stack = useElevator<HTMLDivElement>(active)
  const reveal = useScrollReveal<HTMLDivElement>()

  return (
    <div ref={reveal}>
      <div className="flex flex-col gap-cell md:flex-row md:items-start md:justify-between md:gap-cell-2">
        <div className="max-w-sm">
          <span data-reveal className="reveal-init block">
            <BrandMarkCube faces={faces} step={active} size={cubeSize} />
          </span>
          <p data-reveal className="reveal-init mt-8 text-lg font-normal text-body text-foreground">
            {intro}
          </p>
        </div>

        {/*
          El `data-reveal` va en el envoltorio y no en `SectionTabs`: el
          componente no propaga props sueltas, así que el atributo se perdería
          y los tabs se quedarían en `reveal-init` (invisibles) para siempre.
        */}
        <div data-reveal className="reveal-init">
          <SectionTabs
            label={tablistLabel}
            size="display"
            tabs={tabs}
            value={tabs[active].id}
            onValueChange={(id) => setActive(tabs.findIndex((tab) => tab.id === id))}
            panelId={PANEL_ID}
            className="md:justify-end"
          />
        </div>
      </div>

      {/*
        `grid` + todos los hijos en la misma celda: se superponen y el alto lo
        marca el panel más alto. `overflow-hidden` recorta a los que están
        fuera de cuadro durante el desplazamiento.
      */}
      <div data-reveal className="reveal-init mt-cell">
        <div ref={stack} className="grid overflow-hidden">
          {panels.map((panel, index) => (
            <div
              key={tabs[index].id}
              id={PANEL_ID(tabs[index].id)}
              role="tabpanel"
              aria-labelledby={`tab-${tabs[index].id}`}
              aria-hidden={index !== active}
              inert={index !== active}
              className="col-start-1 row-start-1"
            >
              {panel}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
