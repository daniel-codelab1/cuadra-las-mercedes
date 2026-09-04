# Fuentes

El sitio usa dos familias (`DESIGN_SYSTEM.md` §3):

| Rol | Familia | Estado |
|---|---|---|
| Display / titulares | **Futuru** | ⚠️ Pendiente confirmar licencia y si se puede auto-hospedar |
| Cuerpo, nav, labels, stats | **General Sans** | Fontshare — licencia gratuita, self-hostable |

## Estado actual

`app/globals.css` define `--font-display` y `--font-body` con un fallback de
sistema, así que el sitio compila y se ve razonable sin los archivos. Los
tamaños y el tracking ya son los del design system, sólo cambia la forma de las
letras.

## Activar las fuentes reales

1. Conseguir los `.woff2` y dejarlos en `public/fonts/`:

   - General Sans: descargar de [fontshare.com/fonts/general-sans](https://www.fontshare.com/fonts/general-sans)
     → `GeneralSans-Regular.woff2`, `GeneralSans-Medium.woff2`, `GeneralSans-Bold.woff2`
   - Futuru: del proveedor/licencia que corresponda → `Futuru-Bold.woff2`, `Futuru-Black.woff2`

2. En `app/fonts.ts`, descomentar el bloque de activación y borrar la línea
   `export const fontVariables = ''`.

Eso es todo: `next/font/local` redefine las mismas variables CSS que ya usa
`tailwind.config.ts`, así que **ningún componente cambia**.

## Pendiente de confirmar en Figma

- Peso exacto por caso de uso: ¿Futuru Bold o Black en el hero? ¿General Sans
  Regular o Medium en nav vs. párrafo?
- Si Futuru es comercial y sus términos permiten el hosting propio en Vercel. Si
  no, hay que elegir sustituto y actualizar `DESIGN_SYSTEM.md`.
