'use client'

import { useState } from 'react'

import {
  Arrow,
  BrandMark,
  Button,
  CountUp,
  Logotype,
  ScrollNav,
  SectionTabs,
  StatCard,
  ThemeToggle,
} from '@/components/ui'
import { ACCENTS, ACCENT_BG, ACCENT_BG_DARK } from '@/lib/accents'

/**
 * Referencia viva del design system: sirve para contrastar tokens y componentes
 * contra el Figma sin abrir una sección real. No es una ruta del sitio público.
 */
export default function KitPage() {
  const [tab, setTab] = useState('historia')

  return (
    <main className="shell space-y-20 py-20">
      <header className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-label uppercase text-foreground-muted">Referencia interna</p>
          <h1 className="font-display text-h1 text-foreground">Design System</h1>
        </div>
        <ThemeToggle />
      </header>

      <Block title="Colores de marca" note="Fijos en claro y oscuro. La variante dark es sólo estado (hover, pressed, texto sobre el color).">
        <div className="grid grid-cols-2 gap-px sm:grid-cols-4">
          {ACCENTS.map((accent) => (
            <div key={accent}>
              <div className={`h-24 ${ACCENT_BG[accent]}`} />
              <div className={`h-8 ${ACCENT_BG_DARK[accent]}`} />
              <p className="mt-2 text-label uppercase text-foreground">{accent}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Neutros y tema" note="surface / foreground cambian por tema; los grises de tabs son fijos.">
        <div className="grid grid-cols-2 gap-px sm:grid-cols-4">
          <Swatch className="bg-black" label="black · #0A0A0A" />
          <Swatch className="bg-white" label="white · #FFFFFF" bordered />
          <Swatch className="bg-gray-400" label="gray.400 · #C7C7C7" />
          <Swatch className="bg-gray-600" label="gray.600 · #9A9A9A" />
          <Swatch className="bg-surface" label="surface (tema)" bordered />
          <Swatch className="bg-foreground" label="foreground (tema)" />
          <Swatch className="bg-foreground-muted" label="foreground-muted (tema)" />
        </div>
      </Block>

      <Block title="Tipografía" note="Fallback de sistema hasta cargar Futuru y General Sans (docs/FONTS.md).">
        <div className="space-y-6">
          <p className="font-display text-display text-foreground">LAS MERCEDES</p>
          <p className="font-display text-h1 text-foreground">Titular de sección</p>
          <p className="font-display text-h2 text-foreground">Torre Skypark</p>
          <p className="max-w-2xl text-body text-foreground">
            Párrafo de cuerpo en General Sans. Más de 500 proyectos en desarrollo en la
            zona de Las Mercedes, con nuevas construcciones que comprenden usos
            residenciales, comerciales y de oficinas.
          </p>
          <p className="text-label uppercase text-foreground-muted">Caracas, Venezuela</p>
          <p className="font-display text-stat text-foreground">+$400M</p>
        </div>
      </Block>

      <Block title="Botones" note="Un solo elemento interactivo. Al pasar el ratón, la etiqueta cambia a la variante -dark y la caja de la flecha gira sobre su eje Y como un cubo, descubriendo una cara del mismo color nuevo.">
        <div className="flex flex-wrap items-start gap-6">
          <Button accent="orange">Súmate</Button>
          <Button accent="steel-blue">Descubre más</Button>
          <Button accent="teal-dark">Conoce más</Button>
          <Button accent="navy" withArrow={false}>
            Sin flecha
          </Button>
        </div>
      </Block>

      <Block title="BrandMark" note="Un solo asset máscara; el color lo pone el contenedor.">
        <div className="flex flex-wrap gap-4">
          {ACCENTS.map((accent) => (
            <BrandMark key={accent} color={accent} size={72} />
          ))}
        </div>
      </Block>

      <Block title="SectionTabs">
        <SectionTabs
          label="Ejemplo de tabs"
          value={tab}
          onValueChange={setTab}
          tabs={[
            { id: 'historia', label: 'Historia' },
            { id: 'ubicacion', label: 'Ubicación' },
            { id: 'novedades', label: 'Novedades' },
          ]}
        />
      </Block>

      <Block title="StatCard" note="Única excepción a un acento por sección: cada tarjeta lleva el suyo.">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            accent="navy"
            value={<CountUp to={400} prefix="+$" suffix="M" />}
            label="Inversión"
            description="Capital comprometido en desarrollos de la zona."
          />
          <StatCard
            accent="olive"
            value={<CountUp to={5} prefix="+$" suffix="M" />}
            label="Ticket promedio"
            description="Valor medio por unidad en desarrollo."
          />
          <StatCard
            accent="coral"
            value={<CountUp to={1.5} decimals={1} prefix="+" suffix="M" />}
            label="Metros cuadrados"
            description="Superficie total proyectada."
          />
          <StatCard
            accent="steel-blue"
            value={<CountUp to={40} prefix="+" suffix="K" />}
            label="Personas"
            description="Población que circula por la zona."
          />
        </div>
      </Block>

      <Block title="ScrollNav y flechas">
        <div className="flex items-start gap-10">
          <ScrollNav onPrev={() => {}} onNext={() => {}} prevDisabled />
          <div className="flex gap-px">
            {(['right', 'down', 'left', 'up'] as const).map((direction) => (
              <span key={direction} className="grid size-14 place-items-center bg-black text-white">
                <Arrow direction={direction} className="size-5" />
              </span>
            ))}
          </div>
        </div>
      </Block>

      <Block title="Grilla guía 20×20" note="1 celda = var(--cell). Referencia de proporción, no un grid CSS.">
        <div className="flex flex-wrap items-end gap-px">
          <div className="size-cell bg-brand-olive" />
          <div className="h-cell w-cell-2 bg-brand-steel-blue" />
          <div className="h-cell-2 w-cell-3 bg-brand-navy" />
          <div className="h-cell w-cell-5 bg-brand-coral-light" />
        </div>
      </Block>

      <Block title="Logotipo" note="Placeholders hasta el export de Figma.">
        <div className="flex flex-wrap items-center gap-8">
          <Logotype variant="black" height={48} />
          <span className="bg-black p-6">
            <Logotype variant="white" height={48} />
          </span>
        </div>
      </Block>
    </main>
  )
}

function Block({
  title,
  note,
  children,
}: {
  title: string
  note?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-display text-h2 text-foreground">{title}</h2>
        {note ? <p className="mt-1 max-w-2xl text-body text-foreground-muted">{note}</p> : null}
      </div>
      {children}
    </section>
  )
}

function Swatch({
  className,
  label,
  bordered = false,
}: {
  className: string
  label: string
  bordered?: boolean
}) {
  return (
    <div>
      <div className={`h-24 ${className} ${bordered ? 'border border-gray-400' : ''}`} />
      <p className="mt-2 text-label uppercase text-foreground">{label}</p>
    </div>
  )
}
