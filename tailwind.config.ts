import type { Config } from 'tailwindcss'

/**
 * Fuente de verdad de los tokens de DESIGN_SYSTEM.md.
 *
 * Regla: ningún componente hardcodea un hex, un tamaño de fuente ni un
 * espaciado. Si un valor no está aquí, no está en el design system todavía.
 *
 * - `brand.*` son colores de MARCA: mismo hex en tema claro y oscuro,
 *   nunca detrás de una CSS variable de tema (DESIGN_SYSTEM.md §6).
 * - `surface` / `foreground` son colores de TEMA: resuelven vía CSS variable
 *   en app/globals.css.
 */
const config: Config = {
  darkMode: 'class',
  content: {
    // `relative: true` resuelve los globs respecto a ESTE archivo y no respecto
    // a process.cwd(). `next build`/`next dev` corren con la raíz del proyecto
    // como cwd, así que ahí da igual; pero sin esto, cualquier herramienta
    // lanzada desde otro directorio (el CLI de Tailwind, un script de CI) no
    // encuentra ni un archivo y emite sólo el preflight, sin una sola utilidad.
    relative: true,
    files: [
      './app/**/*.{ts,tsx}',
      './components/**/*.{ts,tsx}',
      './content/**/*.{ts,tsx}',
      './lib/**/*.{ts,tsx}',
    ],
  },
  theme: {
    extend: {
      colors: {
        // --- Neutros (§2) ---
        black: '#0A0A0A',
        white: '#FFFFFF',
        gray: {
          400: '#C7C7C7', // tabs/labels inactivos — mismo valor en ambos temas
          600: '#9A9A9A', // texto secundario sobre blanco (confirmar en Figma)
        },

        // --- Marca (§2): fijos en claro y oscuro ---
        brand: {
          orange: { DEFAULT: '#FF8D10', dark: '#E07400' },
          terracotta: { DEFAULT: '#D85829', dark: '#AC4520' },
          'coral-light': { DEFAULT: '#EA807C', dark: '#E25450' },
          coral: { DEFAULT: '#D93928', dark: '#AD2D1F' },
          'steel-blue': { DEFAULT: '#5CA1B7', dark: '#44869C' },
          navy: { DEFAULT: '#1D3560', dark: '#13223F' },
          olive: { DEFAULT: '#89891B', dark: '#555511' },
          'teal-dark': { DEFAULT: '#004538', dark: '#002921' },
        },

        // --- Tema (§6): resueltos por CSS variable ---
        surface: {
          DEFAULT: 'var(--surface)',
          // El negro absoluto del tema oscuro, escrito como valor y no como
          // variable: el footer es una franja de marca y no cambia con el tema
          // (§6), así que necesita ese hex fijo en los dos temas.
          dark: '#000000',
        },
        foreground: {
          DEFAULT: 'var(--text)',
          muted: 'var(--text-muted)',
        },
      },

      fontFamily: {
        // Futuru = display/titulares · General Sans = cuerpo, nav, labels, stats
        display: ['var(--font-display)'],
        sans: ['var(--font-body)'],
      },

      fontSize: {
        // Los máximos del clamp son los tamaños de Figma en desktop (§3).
        display: [
          'clamp(2.75rem, 7.5vw, 5.5rem)',
          { lineHeight: '0.95', letterSpacing: '-0.02em', fontWeight: '700' },
        ],
        h1: [
          'clamp(2rem, 4vw, 2.75rem)',
          { lineHeight: '1.05', letterSpacing: '-0.015em', fontWeight: '700' },
        ],
        h2: [
          'clamp(1.5rem, 2.6vw, 1.875rem)',
          { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '700' },
        ],
        body: ['1.0625rem', { lineHeight: '1.6' }],
        label: [
          '0.8125rem',
          { lineHeight: '1.2', letterSpacing: '0.08em', fontWeight: '500' },
        ],
        // Pre-título sobre el titular de una sección. Es el mismo tratamiento
        // que `label` —versalitas, mismo tracking y peso— pero al tamaño con el
        // que se lee encima de un titular. Existía de hecho antes que como
        // token: el hero lo conseguía apilando `text-label text-lg`, que son dos
        // tamaños peleándose por la misma propiedad.
        eyebrow: [
          '1.125rem',
          { lineHeight: '1.3', letterSpacing: '0.08em', fontWeight: '500' },
        ],
        // Remate de sección: la frase que tiene que calar. Más grande que un
        // titular de sección (`h1`) y por debajo del display del hero.
        statement: [
          'clamp(2.25rem, 4.6vw, 4rem)',
          { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' },
        ],
        stat: [
          'clamp(2.25rem, 5vw, 3.25rem)',
          { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '700' },
        ],
      },

      spacing: {
        // 1 celda de la grilla guía 20×20 de Figma (§5). Sirve para dimensionar
        // bloques cuadrados en proporción, NO para montar un grid CSS literal.
        cell: 'var(--cell)',
        'cell-half': 'calc(var(--cell) / 2)',
        'cell-2': 'calc(var(--cell) * 2)',
        'cell-3': 'calc(var(--cell) * 3)',
        'cell-4': 'calc(var(--cell) * 4)',
        'cell-5': 'calc(var(--cell) * 5)',
        // Piso de 44px para las muescas de marca y los botones de icono — ver
        // el comentario de `--cell-mark` en globals.css. Sólo hay pieza de
        // hasta 3 celdas en el escalón del hero; añadir `cell-mark-4/5` si
        // hace falta una mayor.
        'cell-mark-half': 'calc(var(--cell-mark) / 2)',
        'cell-mark': 'var(--cell-mark)',
        'cell-mark-2': 'calc(var(--cell-mark) * 2)',
        'cell-mark-3': 'calc(var(--cell-mark) * 3)',
        // Aire vertical entre secciones ("mucho whitespace", §5)
        section: 'clamp(5rem, 12vw, 10rem)',
        // Alto de la barra fija: `h-16` del contenido más el hilo inferior.
        // Lo necesita cualquier sección fijada a pantalla completa, porque la
        // barra se le superpone y le come ese trozo por arriba.
        navbar: 'calc(4rem + 1px)',
      },

      maxWidth: {
        shell: 'var(--shell)',
      },

      borderRadius: {
        // La estética es de esquinas rectas; radio mínimo sólo donde el Figma
        // lo muestre explícitamente.
        none: '0',
        min: '2px',
      },
    },
  },
  plugins: [],
}

export default config
