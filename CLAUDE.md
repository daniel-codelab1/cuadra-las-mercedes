# CLAUDE.md — Cuadra Las Mercedes

Este archivo orienta a Claude Code en este repositorio. Léelo completo antes de generar cualquier sección nueva.

## Qué es este proyecto

Rediseño total (desde cero) del sitio web de **Cuadra Las Mercedes**, la marca de renovación urbana/comercial de la zona Las Mercedes en Caracas, Venezuela. El sitio anterior vivía en `www.cuadralasmercedes.com` sobre Vercel; este rebuild reemplaza ese sitio por completo, manteniendo el mismo hosting.

El diseño fuente es un Figma que se está trasladando **sección por sección**, mediante capturas/exports que se le pasan a Claude Code una por una. Cada sección debe respetar `DESIGN_SYSTEM.md` (tokens de color, tipografía y componentes) para que el resultado final sea consistente aunque se construya de forma incremental.

## Stack técnico (decidido)

- **Framework**: Next.js 16 (App Router) + TypeScript + React 19
  - El plan original decía Next 15; al montar el proyecto (ago 2026) el estable era 16 y se tomó ese. Mismo App Router, mismas convenciones.
- **Iconos**: [Lucide](https://lucide.dev) (`lucide-react`). Las flechas, siempre vía `components/ui/Arrow.tsx`
- **Estilos**: Tailwind CSS v3 — todos los tokens de `DESIGN_SYSTEM.md` están mapeados en `tailwind.config.ts` (colores, tamaños de fuente, espaciados); no usar valores hardcodeados sueltos en los componentes
- **Animación de scroll**: GSAP + `ScrollTrigger`, con **Lenis** como smooth-scroll wrapper para sincronizar scroll nativo con las animaciones
  - Scroll vertical: reveals (fade + translateY), parallax de imágenes, contadores animados en las stat cards
  - Scroll horizontal: `pin: true` + tween horizontal para el carrusel de proyectos ("+500 proyectos en desarrollo")
- **CMS**: Payload CMS (self-hosted, TypeScript) con Postgres. **Todavía no montado**: el contenido vive en `content/`, tipado con las mismas formas que tendrán las colecciones. Ver "Contenido" abajo.
- **Idiomas**: español (por defecto, sin prefijo de URL) e inglés (`/en`), con **next-intl**. Ver `docs/I18N.md`
- **Tema claro/oscuro**: `next-themes` con estrategia `class` sobre `<html>` + `darkMode: 'class'` en Tailwind, `defaultTheme="system"`. Ver reglas de qué cambia por tema vs. qué es fijo de marca en `DESIGN_SYSTEM.md`, sección 6
- **Hosting**: Vercel (continuidad con el sitio actual)
- **Formularios**: Server Actions de Next.js + Resend para envío de correo; Cloudflare Turnstile como antispam en el formulario de "Súmate" *(pendiente de implementar)*

## Estructura del repo

```
proxy.ts                detección de idioma (en Next 16 esto era middleware.ts)
i18n/
  routing.ts            idiomas, idioma por defecto, estrategia de prefijo
  navigation.ts         Link/useRouter con prefijo de idioma automático
  request.ts            catálogo de mensajes por petición
  locale.ts             assertLocale(): valida el segmento [locale]
messages/               es.json / en.json — cadenas de INTERFAZ (no contenido)
app/
  providers.tsx         next-themes + SmoothScrollProvider (único client wrapper global)
  fonts.ts              carga de Futuru / General Sans (ver docs/FONTS.md)
  globals.css           CSS variables de tema, --cell, .shell, cubo del botón
  [locale]/
    layout.tsx          raíz: <html lang>, metadata + hreflang, Providers
    (site)/
      layout.tsx        shell del sitio público: Navbar + Footer
      page.tsx          home: aquí se montan las secciones
      _sections/        una carpeta por sección del Figma
        navbar/         barra superior (+ MobileMenu y LocaleSwitcher, cliente)
        hero/           hero (+ HeroReveal, cliente: secuencia de entrada)
      partners/       aliados (+ PartnersReveal, cliente: reveal al hacer scroll)
      history/        tabs Historia/Ubicación/Novedades (+ HistoryTabs, cliente)
      projects/       camino horizontal fijado (+ ProjectsScroll, cliente)
      financing/      texto que se oscurece con el scroll (+ FinancingText, cliente)
      skypark/        pisos fijados: foto + panel de color (+ SkyparkFloors, cliente; layout.ts, geometría en celdas)
      stats/          fila de cifras (+ StatsReveal, cliente: entrada + trazo de los subrayados)
      hub/            plano que se acerca con el scroll (+ HubZoom, cliente: entrada palabra a palabra + zoom fijado)
    kit/page.tsx        referencia viva del design system (/kit)
components/ui/          componentes compartidos (Button, BrandMark, StatCard, …)
content/                CONTENIDO editable tipado y por idioma (futuro Payload)
lib/
  accents.ts            mapas accent -> clase Tailwind (único lugar con clases brand-* literales)
  cn.ts                 clsx + tailwind-merge (con los tokens de fontSize declarados)
  animation/            gsap.ts, SmoothScrollProvider, hooks de scroll
docs/FONTS.md           estado y activación de las fuentes de marca
docs/I18N.md            idiomas y tema: reglas al añadir secciones
```

## Cómo trabajar sección por sección

1. Recibirás una captura o export de Figma de una sección específica (ej. "Hero", "Historia", "Cifras"), junto con **indicaciones puntuales de cómo debe comportarse esa sección y cómo debe animarse al hacer scroll** — estas indicaciones las da el usuario sección por sección a medida que se construye el sitio, no están pre-definidas en este documento. Este `CLAUDE.md` y `DESIGN_SYSTEM.md` cubren la infraestructura reutilizable (tokens, componentes base, hooks de animación); el comportamiento específico de cada sección es una instrucción aparte que se te da en el momento.
2. Antes de codear: identifica qué componentes de `components/ui/` ya existen y aplican (`Button`, `StatCard`, `SectionTabs`, `BrandMark`, `ScrollNav`…). **Reutiliza, no dupliques** — si una sección necesita un botón, es el mismo componente `Button` con una prop `accent`, no un botón nuevo por sección.
3. Si la sección introduce un patrón visual nuevo que se repite (o es probable que se repita), agrégalo como componente en `components/ui/` **y** documéntalo en `DESIGN_SYSTEM.md` §4, antes de implementarlo.
4. Todo color, tamaño de fuente o espaciado debe salir de los tokens de `tailwind.config.ts` — si un valor no está en `DESIGN_SYSTEM.md`, pregunta antes de inventarlo.
5. Cada sección es un componente de servidor por defecto; solo se marca `"use client"` el componente que efectivamente inicializa GSAP/ScrollTrigger (mantener los client components lo más chicos y aislados posible).
6. Las animaciones de scroll van en los hooks de `lib/animation/` (`useScrollReveal`, `useHorizontalPin`, `useParallax`, `useCountUp`, `useMarquee`, `useScrollEmphasis`, `useElevator`, `useDrawLine`) para no repetir la lógica de `ScrollTrigger` en cada sección — cuando una instrucción de animación puntual encaje en un patrón ya cubierto por un hook existente, reutilízalo en vez de escribir `ScrollTrigger` suelto de nuevo. Todos los hooks respetan `prefers-reduced-motion`.
7. Verifica la sección en `/kit` y en ambos temas antes de darla por terminada.

## Convenciones de código

- Componentes de sección en `app/(site)/_sections/<nombre-seccion>/`, con su propio `index.tsx`
- Componentes de UI compartidos (botones, tabs, stat card, brand mark) en `components/ui/`, exportados desde su `index.ts`
- Contenido editable (textos, cifras, imágenes, logos de aliados) **no se hardcodea en el JSX**: va en `content/sections/<nombre>.ts`, tipado con las formas de `content/types.ts`. Cuando montemos Payload, esas formas se convierten en las colecciones/globals y los componentes de sección no cambian
- Nombres de archivos y componentes en inglés; contenido/copys en español (el sitio es en español)
- Imágenes optimizadas con `next/image`, nunca `<img>` plano
- Los acentos de marca se pasan como prop (`accent="navy"`) y se resuelven por `lib/accents.ts`; **nunca** construir clases dinámicas tipo `` `bg-brand-${accent}` `` (Tailwind no las genera)
- Al añadir un token nuevo a `fontSize` o a `spacing` en `tailwind.config.ts`, **añádelo también a `lib/cn.ts`** (lista `font-size` o `theme.spacing`). Si no, `tailwind-merge` no lo reconoce y lo descarta silenciosamente en cualquier componente que use `cn()`: le pasó a `text-label` en `Button` (lo tomó por un color de texto) y a `gap-cell-half` en `ScrollNav` (no lo tomó por un `gap`, así que no pisaba al `gap-px` por defecto)
- Texto con negritas: modelarlo como `RichText` (array de segmentos) en `content/` y pintarlo con `<RichText>`; nunca `dangerouslySetInnerHTML`
- **Idiomas** (detalle completo en `docs/I18N.md`): enlaces internos con `Link` de `@/i18n/navigation`, nunca `next/link`; `assertLocale()` en cada layout y página de `[locale]` (nunca `as Locale`); `setRequestLocale(locale)` para no perder el render estático; fechas y números en crudo en `content/` y formateados con `getFormatter()`
- El contenido va en `content/` tipado con `Localized<T>`; las cadenas de interfaz (ARIA, "Abrir menú", copyright) van en `messages/*.json`. Toda clave nueva, en **los dos** catálogos

## Cosas a no hacer

- No recrear el logotipo ni el isotipo de bloques como texto con web font — son SVG/imagen de marca (ver sección 1 y 7 de `DESIGN_SYSTEM.md`)
- No mezclar más de un color de acento secundario dentro de la misma sección (excepto en la fila de stats, que es la excepción documentada)
- No romper el patrón de "un color de acento dueño por sección" al agregar secciones nuevas sin verificarlo primero contra el Figma
- No poner los `brand-*` detrás de una CSS variable de tema — son fijos en claro y oscuro; solo `surface`/`foreground` cambian por tema (ver `DESIGN_SYSTEM.md`, sección 6)
- No asumir que un logo de aliado sirve para ambos temas con un simple filtro CSS — varios necesitan un asset monocromático aparte para fondo oscuro (por eso `Partner` tiene `logoLight` y `logoDark`)
- No importar `gsap/ScrollTrigger` directamente: siempre desde `lib/animation` para que el plugin se registre una sola vez y del lado del cliente
- No usar barras invertidas de escape en el `matcher` de `proxy.ts`: al pasar por el fuente puede perderse una y el regex queda mal en silencio (`\.` → `.`, que excluye todas las rutas). Usar `[.]`
- No fijar `variant="black"` en `Logotype` sobre una superficie themeable: desaparece en oscuro. Usar `variant="auto"` (por defecto) salvo en el footer, que es negro siempre
- No poner `data-*` de animación directamente en un componente de `components/ui/` que no propague props (`BrandMark`, `SectionTabs`…): TypeScript **no avisa** —los atributos con guion se exceptúan en JSX— pero el atributo se pierde y el elemento se queda en `reveal-init`, invisible para siempre. Envolverlo en un `span`/`div`
- No importar flechas de Lucide sueltas en una sección: van por `components/ui/Arrow.tsx`, que fija grosor y remate recto. El remate redondeado por defecto de Lucide desentona con la estética de bloques
- No dejar ceros sin unidad en un `clip-path: inset(...)` que anime GSAP (`useDrawLine`, los destacados de `hub`): GSAP toma la unidad de cada número del valor de **llegada**, así que `inset(0 50% 0 50%)` → `inset(0 0% 0 0)` pinta `inset(0 25% 0 25)` a mitad de camino. Un `25` sin unidad no es un `<length-percentage>` válido, el navegador descarta la declaración entera y el recorte pasa a `none`: el elemento se ve **completo** durante toda la animación y sólo los fotogramas 0 y 1 salen bien —parece que aparece de golpe—. Poner `%` en las cuatro posiciones, ceros incluidos

## Notas del entorno de desarrollo

Este equipo tiene `NODE_ENV=production` definido a nivel de sistema, lo que hace que `npm install` omita las devDependencies. Si faltan paquetes tras un install, correr:

```
npm install --include=dev
```

**No forzar `NODE_ENV=development` para `next build`.** Con esa variable puesta, el build falla al prerenderizar `/_global-error` (`Cannot read properties of null (reading 'useContext')`) porque React se resuelve en modo mixto. `next build` ya fija `NODE_ENV=production` por su cuenta; hay que dejarlo. La variable sólo hace falta en `npm install`, y para eso está `--include=dev`.

El bloque de reglas de agente que aparece al final de este archivo lo escribe `next dev` automáticamente. Borrarlo sólo consigue que se vuelva a crear; commitearlo junto al resto deja el árbol limpio. No escribas sus marcadores de apertura/cierre en el cuerpo del documento: el generador los detecta y reescribe el texto que los rodea.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
