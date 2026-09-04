# Cuadra Las Mercedes

Rediseño del sitio de Cuadra Las Mercedes. Next.js 16 (App Router) + TypeScript +
Tailwind CSS v3, con GSAP/ScrollTrigger y Lenis para el scroll animado.

## Empezar

```bash
npm install --include=dev   # --include=dev: este equipo tiene NODE_ENV=production a nivel de sistema
npm run dev
```

- <http://localhost:3000> — el sitio en español
- <http://localhost:3000/en> — el sitio en inglés
- <http://localhost:3000/kit> — referencia viva del design system (todos los tokens y componentes, en ambos temas)

```bash
npm run build   # no anteponer NODE_ENV=development: rompe el prerender
npm run lint
npx tsc --noEmit
```

## Dónde está qué

| | |
|---|---|
| Qué construir y cómo | [`CLAUDE.md`](CLAUDE.md) |
| Tokens, componentes, reglas de marca | [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) |
| Estado de las fuentes | [`docs/FONTS.md`](docs/FONTS.md) |
| Idiomas y tema | [`docs/I18N.md`](docs/I18N.md) |
| Secciones del Figma | [`app/[locale]/(site)/_sections/`](app/[locale]/(site)/_sections/) |
| Componentes compartidos | [`components/ui/`](components/ui/) |
| Hooks de scroll | [`lib/animation/`](lib/animation/) |
| Contenido editable | [`content/`](content/) |

## Pendientes conocidos

- Fuentes de marca (Futuru, General Sans): corriendo con fallback de sistema
- **Copy de Historia / Ubicación / Novedades**: hoy es el lorem ipsum del Figma, no texto real
- Imágenes de Historia y Ubicación: placeholders (falta la foto histórica y el mapa)
- Novedades: no se facilitó diseño; la pestaña existe con la misma estructura que las otras dos
- Proyectos: fotos de torres en placeholder; la curva del camino es una aproximación por fórmula, no las alturas exactas del Figma
- Proyectos: falta el hover de las tarjetas (ficha del edificio + enlaces a web/redes)
- Payload CMS: sin montar; el contenido vive tipado en `content/`
- Formulario "Súmate" con Resend + Turnstile: sin implementar
- Traducciones al inglés: primera pasada sin revisar por marca
- Logos de aliados: placeholders en `public/partners/` (hacen falta dos variantes por aliado, clara y oscura)
- **URLs de los aliados**: hoy todas apuntan a `#` en `content/sections/partners.ts`
