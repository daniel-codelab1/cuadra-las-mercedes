# Secciones

Una carpeta por sección del Figma, con su propio `index.tsx`:

```
_sections/
  hero/index.tsx
  historia/index.tsx
  cifras/index.tsx
```

Reglas (ver `CLAUDE.md`):

- Componente **de servidor** por defecto. Sólo se marca `"use client"` la parte
  que inicializa GSAP/ScrollTrigger, y se mantiene lo más pequeña posible.
- El contenido no se hardcodea: viene de `content/sections/<nombre>.ts` (y más
  adelante de Payload, con la misma forma).
- Antes de crear un componente nuevo, revisar `components/ui/` — la mayoría de
  patrones ya existen (`Button`, `BrandMark`, `StatCard`, `SectionTabs`,
  `ScrollNav`, `Footer`).
- Las animaciones de scroll usan los hooks de `lib/animation/`
  (`useScrollReveal`, `useHorizontalPin`, `useParallax`, `useCountUp`), no
  `ScrollTrigger` suelto.
- Un solo color de acento "dueño" por sección (excepción: la fila de stats).
