# Design System — Cuadra Las Mercedes

> Extraído por inspección visual del Figma (export PDF, ago 2026) y por indicaciones directas del manual de marca. Los valores de color están muestreados en píxel a partir del render; **verificar contra el panel Inspect de Figma antes de darlos por definitivos**.
>
> **Implementación:** los tokens de este documento viven en [`tailwind.config.ts`](tailwind.config.ts) y en las CSS variables de [`app/globals.css`](app/globals.css). Ese par de archivos es la fuente de verdad ejecutable; este documento es la explicación de por qué.

## 1. Concepto de marca

Cuadra Las Mercedes es la identidad de un proyecto de renovación urbana/comercial en Caracas. El lenguaje visual juega con la idea de "cuadra" (manzana urbana / grid de ciudad):

- El **isotipo** es un patrón de bloques tipo pixel-art / planta urbana (una "E" fragmentada en cuadrados), que **cambia de color según la sección** en la que aparece (verde oscuro en Historia, naranja en Cifras, coral en Proyectos). Trátalo como un componente `<BrandMark color="..." />`, no como un ícono fijo.
- El **logotipo** ("CUADRALAS MERCEDES") usa letras recortadas/interrumpidas por líneas blancas horizontales — es un lockup de marca, no una fuente reutilizable. Se implementa como SVG/imagen de marca, nunca como texto con web font.
- Estética general: alto contraste blanco/negro, bloques de color sólido a modo de "parches" (como planos urbanos), fotografía real de la zona y renders 3D de torres.

## 2. Paleta de color

Paleta oficial del manual de marca de Cuadra Las Mercedes: 8 colores base, cada uno con una variante "dark" para estados hover/pressed, sombras o texto sobre el propio color. Los nombres de token son descriptivos (no oficiales del manual); mantenerlos así en Tailwind config.

### Neutros
| Token | Clase Tailwind | Hex | Uso |
|---|---|---|---|
| `color.black` | `black` | `#0A0A0A` | Texto principal, footer, logotipo |
| `color.white` | `white` | `#FFFFFF` | Fondos, texto sobre oscuro |
| `color.gray.400` | `gray-400` | `#C7C7C7` | Tabs/labels inactivos (ej. "Ubicación / Novedades" sin seleccionar) |
| `color.gray.600` | `gray-600` | `#9A9A9A` | Texto secundario sobre blanco (aprox., confirmar) |

### Colores de marca (base + dark)
| Token | Clase Tailwind | Base | Dark | Uso observado |
|---|---|---|---|---|
| `color.brand.orange` | `brand-orange` | `#FF8D10` | `#E07400` | CTA principal ("Súmate", "Descubre más"), highlight de texto ("Prime Business Hub") |
| `color.brand.terracotta` | `brand-terracotta` | `#D85829` | `#AC4520` | Variante cálida de apoyo al naranja; disponible para fotografía/overlays, aún sin uso confirmado en el sitio |
| `color.brand.coral-light` | `brand-coral-light` | `#EA807C` | `#E25450` | Tinte suave de coral, para fondos/hover donde el coral pleno sea muy fuerte; subrayado de stat "+40K" |
| `color.brand.coral` | `brand-coral` | `#D93928` | `#AD2D1F` | Ícono de flecha del hero, flechas de navegación arriba/abajo, subrayado de stat "+1.5M" |
| `color.brand.steel-blue` | `brand-steel-blue` | `#5CA1B7` | `#44869C` | Botón "Descubre más" (sección Proyectos), bloque decorativo del hero, subrayado de stat "+$400M" |
| `color.brand.navy` | `brand-navy` | `#1D3560` | `#13223F` | Card "Torre Nest", caja de la flecha de "Las Mercedes 2026 en números" |
| `color.brand.olive` | `brand-olive` | `#89891B` | `#555511` | Bloque "Inicio del Proyecto", flecha de bloque logos, subrayado de stat "+$5M" (el bloque del hero usa un **tinte claro** de este color, ver nota abajo) |
| `color.brand.teal-dark` | `brand-teal-dark` | `#004538` | `#002921` | Bloque destacado "Torre Skypark", ícono de sección Historia |

La variante dark es el sufijo `-dark` de la clase: `bg-brand-navy` / `bg-brand-navy-dark`.

> Nota de reconciliación: el muestreo por píxel de la primera pasada dio `#AEB646` para el bloque "Inicio del Proyecto" y `#70ACC0` para el bloque steel-blue del hero — ambos son tintes/variaciones de opacidad de `color.brand.olive` y `color.brand.steel-blue` respectivamente (probablemente el bloque real usa el color base con una opacidad reducida sobre fondo blanco, o una foto de fondo debajo). Usar siempre los hex oficiales de esta tabla como fuente de verdad; si un bloque específico necesita verse más claro, aplicar opacidad/tint en CSS en vez de definir un color nuevo.

**Regla de uso:** cada bloque/sección del sitio tiene un color de marca "dueño" (olive para historia temprana, teal-dark para hitos de proyecto, navy para data/cifras, coral para llamados a la acción secundarios, orange reservado para CTAs). No usar más de 2-3 colores de marca distintos en una misma vista, salvo en la fila de 4 stats, donde cada tarjeta tiene su propio color de subrayado a propósito. Las variantes "dark" no se usan como color de sección nuevo — solo como estado (hover, texto sobre el color base, sombra).

> **Excepción documentada — Hero.** El diseño aprobado del hero usa cuatro acentos a la vez: `coral` (caja de la flecha del antetítulo), `olive` (bloque "Inicio del Proyecto"), `steel-blue` (parche sobre la foto) y `orange` (CTA). Es intencional y viene del Figma; no "corregirlo" hacia un solo acento. Junto con la fila de stats, son las dos únicas excepciones a la regla de arriba.

**En código:** los componentes reciben una prop `accent: Accent` y resuelven la clase por los mapas de [`lib/accents.ts`](lib/accents.ts). Tailwind no puede generar clases desde strings dinámicos, así que ese archivo es el único lugar donde las clases `bg-brand-*` se escriben literalmente. Nunca construir `` `bg-brand-${accent}` `` en un componente.

## 3. Tipografía

Fuentes oficiales del manual de marca:

- **Futuru** — fuente de titulares/display. Coincide con lo observado visualmente: geométrica, muy bold, terminales ligeramente redondeadas, tracking apretado (ver "LAS MERCEDES", "¡Más de 500 proyectos...!").
- **General Sans** — fuente de cuerpo de texto, nav, labels y stats. Es una fuente de Fontshare (licencia gratuita, self-hostable), coincide con la sans geométrica neutra observada en párrafos y navegación.

**Pendiente:** confirmar en Figma qué pesos exactos de cada familia se usan por caso (ej. Futuru Bold vs. Black para el hero; General Sans Regular vs. Medium para nav vs. párrafo), y si Futuru es una fuente comercial con licencia propia (verificar términos de uso/hosting) o está disponible en Google Fonts/Fontshare. Cargar ambas con `next/font` (local si es licencia comercial, o vía proveedor si está disponible) para evitar layout shift y bloqueo de render.

**Estado en código:** las familias se referencian por CSS variable (`--font-display`, `--font-body`), hoy con fallback de sistema. Activarlas es editar sólo [`app/fonts.ts`](app/fonts.ts) — paso a paso en [`docs/FONTS.md`](docs/FONTS.md).

### Escala tipográfica (a confirmar tamaños reales en Figma)
Los tokens son fluidos: el **máximo del clamp** es el tamaño de Figma en desktop, y el mínimo evita que los titulares desborden en móvil.

| Token | Clase | Fuente | Tamaño | Uso |
|---|---|---|---|---|
| `text.display` | `text-display` | Futuru | `clamp(44px, 7.5vw, 88px)`, bold | Titular hero ("LAS MERCEDES") |
| `text.h1` | `text-h1` | Futuru | `clamp(32px, 4vw, 44px)`, bold | Titulares de sección |
| `text.h2` | `text-h2` | Futuru | `clamp(24px, 2.6vw, 30px)`, bold | Subtítulos ("Historia", "Torre Skypark") |
| `text.body` | `text-body` | General Sans | 17px, regular | Párrafos |
| `text.label` | `text-label` | General Sans | 13px, uppercase, medium, `0.08em` | Etiquetas y pies ("CARACAS, VENEZUELA", "MUNICIPIO BARUTA", "20 Pisos") |
| `text.eyebrow` | `text-eyebrow` | General Sans | 18px, uppercase, medium, `0.08em` | Pre-título sobre el titular de una sección ("¿POR QUÉ EN LAS MERCEDES?", "ALGO NUEVO ACABA DE LLEGAR A"). Mismo tratamiento que `label`, al tamaño que pide ir encima de un titular |
| `text.statement` | `text-statement` | Futuru | `clamp(36px, 4.6vw, 64px)`, bold | Remate de sección: la frase que tiene que calar ("¿Es o no es Las Mercedes el **Prime Business Hub** de Caracas?"). Entre el display del hero y un titular de sección |
| `text.stat` | `text-stat` | Futuru | `clamp(36px, 5vw, 52px)`, bold | Cifras destacadas ("+$400M") |

La familia se aplica aparte: `font-display` (Futuru) o `font-sans` (General Sans, por defecto en `body`).

## 4. Componentes recurrentes identificados

Todos viven en [`components/ui/`](components/ui/) y se exportan desde `components/ui/index.ts`.

- **Botón** (`Button`): fondo del color de acento, texto blanco, bold, esquinas rectas, con un bloque cuadrado adyacente que solo contiene una flecha `→` (mismo color de fondo, separado por un hilo por el que se ve el fondo de página). `accent="orange"` es el CTA principal ("Descubre más", "Conoce más", "Súmate"); cualquier otro acento da el botón secundario de la sección. Es **un solo elemento interactivo**: los dos bloques son `<span>` dentro del mismo `<a>`/`<button>`.
  - **Hover (comportamiento de marca, aplica a todos los botones):** la etiqueta pasa a la variante `-dark` del acento y el cuadrado de la flecha **gira sobre su eje Y** descubriendo una segunda cara ya pintada de ese mismo color nuevo. La sensación buscada es la de un cubo girando, no la de una tarjeta que se voltea: por eso las caras llevan `translateZ` de medio lado y el contenedor `perspective`. La mecánica está en las clases `.cube*` de `app/globals.css`; `Button` sólo fija `--cube` = alto del botón.
  - Con `prefers-reduced-motion` no hay giro: la cara frontal se queda plana y cambia de color, de modo que el hover sigue comunicando.
- **Tabs de sección** (`SectionTabs`): lista horizontal separada por "/", ítem activo en `foreground` bold, ítems inactivos en `gray-400`. Dos escalas con la misma estructura: `size="label"` (versalitas pequeñas) y `size="display"` (el titular grande de "Historia / Ubicación / Novedades"). Emite `role="tablist"`/`role="tab"` y se enlaza con los paneles por `aria-controls`.
- **Tarjeta de cifra** (`StatCard`): número grande bold + línea divisoria + label bold + descripción en gris. Ver fila "+$400M / +$5M / +1.5M / +40K". Para animar la cifra, pasar `value={<CountUp to={400} prefix="+$" suffix="M" />}`: `StatCard` sigue siendo componente de servidor y sólo el número es cliente.
  - **El divisor son dos tramos**, no una línea: primero un trozo sólido del color de acento de la tarjeta (un tercio del ancho) y después el punteado en `gray-400` hasta el final. Es lo que permite dibujarlo por partes al hacer scroll.
  - `animated` marca las partes de la tarjeta para que las anime la sección que la contiene (`data-reveal` en los textos, `data-draw` en los dos tramos). Va **apagado por defecto**: las clases `*-init` dejan el contenido invisible hasta que GSAP lo anima, así que una tarjeta suelta —la del kit— no debe llevarlas.
- **Trazo de líneas por scroll** (`lib/animation/useDrawLine.ts`): dibuja de izquierda a derecha los elementos marcados con `data-draw`, encadenados y a velocidad constante en px/s, de modo que varios tramos se leen como un solo camino recorriendo la fila. Recorta con `clip-path` en vez de animar ancho o `scaleX`: escalar deformaría el punteado y animar el ancho recalcularía el layout en cada frame. El estado inicial lo pone la clase `.draw-init` (mismo papel que `.reveal-init`).
- **Contador animado** (`CountUp`): renderiza el valor final en el HTML del servidor y lo anima al entrar en viewport. Sin JS o con `prefers-reduced-motion` se ve la cifra correcta igual.
- **Anillo de marca** (`CircularText`): el nombre de la marca dispuesto en círculo, girando sobre su eje. Hace de sello en la esquina de una sección, en el papel que en otras ocupa el isotipo (`BrandMark`). Los separadores entre palabras (`*`) se pintan con el acento dueño de la sección y el resto de letras en `foreground`, de modo que el anillo cambia de color al cambiar de sección sin tocar el componente. El texto es contenido y viaja en `content/` con sus separadores incluidos.
  - Gira con GSAP, no con `motion`: el registro de React Bits del que viene depende de esa librería, y el sitio ya tiene GSAP cargado en todas las páginas. El hover cambia el `timeScale` del giro en curso —acelera desde donde está— en vez de relanzar el tween, que es lo que hacía el original.
  - El tamaño de letra sale del diámetro y no de la escala tipográfica de §3: es geometría del círculo, y si no acompaña al diámetro las letras se solapan o dejan hueco. El techo lo marca el hueco por carácter, `2π·radio / N`.
  - Los separadores se pintan bastante más grandes que las letras, y su tamaño va en `em` —múltiplo del cuerpo base— para que los dos se muevan juntos al cambiar el diámetro. Mezclar dos cuerpos en el mismo anillo obliga a `line-height: 1`: con la altura de línea por defecto cada glifo baja media interlínea, esa media crece con el cuerpo, y el separador grande se descolgaría hacia el centro.
  - Lleva `role="img"` y `aria-label`: sin eso un lector de pantalla deletrea el anillo letra a letra, asteriscos incluidos. Con `prefers-reduced-motion` se queda quieto.
- **Carrusel de medios** (`MediaCarousel`): bloque de imagen que admite foto y vídeo en la misma secuencia. Las fotos avanzan por temporizador; los vídeos avanzan al terminar, para no cortarlos. Se pausa con el ratón encima o al enfocar con teclado, y con `prefers-reduced-motion` no avanza solo. Lleva paginación de cuadrados (uno relleno = activo) abajo a la derecha — es lo que da forma de pausar y navegar; si el Figma la quiere fuera, hay que resolver antes esa accesibilidad. Es el bloque principal de la columna derecha del hero.
- **Carrusel infinito de logos** (`LogoMarquee`): marquesina horizontal de logos de aliados, cada uno enlazado. La lista se pinta dos veces y la animación recorre medio track, de modo que el ciclo cierra sin salto; la copia va `aria-hidden` + `inert` para no duplicar lectura ni tabulación. Se detiene al pasar el ratón o al enfocar con teclado, porque los logos son enlaces. La velocidad es en px/s y no una duración fija: al sumar aliados desde el CMS crece el recorrido, no la velocidad. Motor en `lib/animation/useMarquee.ts`.
- **Texto con énfasis por scroll** (sección `financing`, motor en `lib/animation/useScrollEmphasis.ts`): la sección se fija y el texto pasa de `foreground-muted` a `foreground` palabra a palabra según avanza el scroll; al terminar suelta el pin. Es el uso documentado del gris atenuado dentro de un mismo titular (§6).
  - Se anima la variable `--emphasis` de cada palabra, no su `color`: el valor final lo resuelve `color-mix` sobre las variables de tema, así que el efecto vale igual en claro y en oscuro sin fijar ningún hex.
  - `@property --emphasis` (globals.css) es obligatorio: GSAP lee el valor de partida con `getComputedStyle`, y una custom property sin registrar computa a cadena vacía.
- **Barra de navegación** (`Navbar`, en `app/(site)/_sections/navbar/`): fija arriba, fondo `surface`, hilo inferior, logotipo a la izquierda, enlaces al centro y a la derecha el CTA naranja a alto completo de la barra + el indicador de región. Por debajo de `lg` los enlaces pasan a `MobileMenu` (panel a pantalla completa).
- **Texto con negritas** (`RichText`): pinta un `RichText` (array de segmentos `{ text, bold }`) sin `dangerouslySetInnerHTML`. Es la forma en que viajan los párrafos con tramos destacados del hero.
- **Camino horizontal de proyectos** (sección `projects`): fotos de edificios en una fila que dibuja una curva. Construido con `useHorizontalPin`.
  - **Cada parada es un proyecto**: su foto y, encima, la ficha de color sólido (navy/orange) con nombre, pisos, estado, uso y los enlaces a web, Instagram y LinkedIn. La ficha se descubre al pasar el ratón **o al enfocar con teclado** (`group-focus-within`): lleva enlaces dentro, y unos enlaces que sólo aparecen con el ratón son inalcanzables tabulando.
  - El número de pisos viaja en crudo en `content/` y el rótulo ("20 Pisos") lo pone el catálogo de mensajes, con plural ICU. El estado y el uso sí son contenido traducible.
  - Todo el contenido de la sección —titular de apertura, torres, párrafo, CTA y titular de cierre— viaja en el mismo carril. Es lo que hace que el texto de cierre aparezca **al final** del recorrido.
  - **Los reveals cuelgan de `containerAnimation`, no del scroll de la página.** Sin eso ScrollTrigger mide el avance vertical y dispara todas las torres a la vez en cuanto la sección se fija. `useHorizontalPin` expone el tween por su callback `onSetup` justo para esto.
  - En un ScrollTrigger con `containerAnimation` no se puede usar `pin` ni `snap`, y `start`/`end` se expresan en horizontal (`'left 88%'`).
  - El tween horizontal **debe** llevar `ease: 'none'`, o la posición deja de corresponderse con la del scroll.
  - La curva la calcula una función de arco sobre el índice, y el desplazamiento va en un envoltorio aparte del elemento que anima el reveal: compartir elemento haría que GSAP sobrescribiera el arco al animar `y`.
- **Composición de Skypark** (sección `skypark`): panel de color sólido que sangra hasta el borde derecho, con la textura de bloques de marca en banda vertical sobre su lado derecho; encima, una sola foto por piso; y sobre la foto, dos rectángulos que le recortan las esquinas — uno del color del panel arriba a la derecha (despeja el titular) y uno en `surface` abajo a la izquierda (despeja el párrafo fijo). Texto blanco.
  - **Toda la composición se mide en celdas** (`_sections/skypark/layout.ts`), no en `vw`/`vh`: así encoge en bloque y las proporciones del Figma se mantienen. La sección redefine `--cell` para que la celda también dependa del alto de la ventana y la composición nunca se recorte dentro del pin.
  - Por lo mismo, el tamaño de texto de la sección va en celdas: son los tokens de §3 expresados sobre la celda de 72px. Si se dejan fijos, en ventanas bajas el párrafo se sale del panel y pisa a la foto.
  - El rectángulo del color del panel no puede colgar del panel: éste crea su propio contexto de apilado y el rectángulo tiene que quedar por delante de la foto. Va suelto, con el mismo `transition-colors`.
- **Plano que se acerca** (sección `hub`): el plano catastral de la zona de fondo, a opacidad baja, y una frase centrada con un tramo sobre un bloque de color. La sección se fija y el scroll gobierna a la vez el acercamiento del plano (+30%) y el relevo de las dos frases: la pregunta se va y aparece la respuesta, como si se bajara sobre la ciudad.
  - Las dos frases se escriben **pieza a pieza**: cada palabra por separado y el tramo destacado entero. Pero con relojes distintos: la pregunta corre sola al asomar su bloque, antes del pin, y la respuesta la escribe el scroll, anidada en la misma línea de tiempo que gobierna el acercamiento. Encender el bloque entero de la respuesta con un `fromTo` de opacidad aparte, mientras sus palabras entraban en tiempo real, hacía que la frase apareciera de golpe en vez de escribirse; lo que la esconde son las piezas, no el bloque.
  - El paso entre palabras tiene que ser **mayor que la duración de cada una**: si se solapan, media frase está en fundido a la vez y se lee como un fade del bloque entero en vez de palabras entrando una tras otra.
  - Dos grados de énfasis para el tramo destacado, los dos por `clip-path`: barrido de izquierda a derecha (`.draw-init`) y, en el remate, el bloque abriéndose desde el centro y aterrizando desde un tamaño mayor (`.burst-init`).
  - Degradados de `surface` a transparente arriba y abajo: el plano no arranca ni termina en un corte. Van fuera del envoltorio que escala, o el zoom se los llevaría por delante.
  - El plano es decoración: `alt` vacío, y en tema oscuro se invierte para quedar en líneas blancas a baja opacidad sobre negro (§6).
- **Isotipo como cubo** (`BrandMarkCube`): el isotipo montado sobre las caras de un cubo. Gira un cuarto de vuelta por cada incremento de `step`, así que se engancha al estado de la sección — en Historia, a la pestaña activa.
  - **Una cara por estado.** Un cubo tiene cuatro caras alrededor del eje Y (`BRANDMARK_CUBE_MAX_FACES`), y hay que declararlas todas: si sobran estados, el cubo gira hacia una posición vacía y el isotipo desaparece (con `backface-visibility: hidden` no se ve el reverso de otra cara).
  - **Cada cara lleva su propio color**, así que el cambio de color al cambiar de estado *es* el giro descubriendo otra cara, no un repintado de fondo.
  - La forma alterna entre las dos orientaciones del patrón (`E` vertical, `M` horizontal).
  - A diferencia del cubo de `Button`, el giro lo lleva GSAP y no CSS, porque lo dispara React: por eso usa `.cube` sin `.cube-hover`.
  - La máscara va anclada arriba a la izquierda (`object-left-top`), no centrada: el patrón arranca desde el extremo del bloque de color.
- **Marca de sección recolorable** (`BrandMark`): el isotipo de bloques pixelados, cambia de color según el acento de la sección — ver construcción técnica (contenedor de color + PNG máscara) en la sección 7.
- **Flechas de navegación vertical** (`ScrollNav`): par de botones cuadrados apilados (↑ / ↓) en `brand-coral`, usados como control manual de navegación entre bloques de una sección — combinar con `ScrollTrigger` para (des)activar según la posición de scroll. Dos tamaños: `md` (56px, el del kit) y `sm` (media celda de la grilla), que es el del Figma cuando las flechas acompañan a un bloque de texto y tienen que encoger con él. La separación entre los dos botones la pone quien lo usa (`className="gap-…"`); por defecto es un hilo.
- **Flecha** (`Arrow`): la flecha del sistema, en 4 direcciones. Envuelve a **Lucide** para fijar grosor y remate del trazo en un solo sitio.
- **Logotipo** (`Logotype`): lockup de marca en variante `black` (fondo claro) y `white` (fondo oscuro), ya con los assets reales. Con `variant="auto"` (por defecto) pinta las dos y deja que CSS elija según el tema — que es como hay que usarlo sobre cualquier superficie themeable; fijar la variante sólo donde el fondo no cambia (el footer).
- **Bandera** (`Flag`): ilustración circular de Venezuela / Reino Unido para el selector de idioma. El español usa la bandera venezolana, no la española: el sitio es de un proyecto en Caracas.
- **Iconos de enlaces** (`SocialIcon`): web, Instagram y LinkedIn para las fichas de proyecto. El de web sale de Lucide; los dos de marca van dibujados a mano, porque Lucide dejó de publicar marcas comerciales y ya no existen en la librería (misma excepción que `Flag`, ver §7).
- **Footer** (`Footer`): fondo negro absoluto, logotipo centrado en blanco, texto descriptivo centrado, línea divisoria fina, copyright.

## 5. Espaciado y grid

- **Grilla base**: 20 columnas × 20 filas, celdas 1:1 (cuadradas). Es la grilla guía de Figma (ver captura de referencia), no un grid CSS literal — sirve para definir posición y tamaño de bloques con consistencia, pero **no es estricta**: varios elementos la rompen levemente (fotos que se solapan con la celda de al lado, bloques de color que sangran fuera de su casilla) siempre que el resultado se vea intencional y prolijo.
- **Cómo traducirla a código**: no forzar un grid de 20 columnas en CSS. En su lugar, la variable `--cell` = `min(100vw, 1440px) / 20` expone 1 celda como unidad de espaciado de Tailwind: `size-cell` (bloque de 1 celda), `w-cell-2`, `h-cell-3`, `px-cell`… Con eso las proporciones salen del Figma y el ajuste fino se hace a ojo, igual que en el diseño original.
- **`.shell`**: contenedor maestro (`max-w-shell` = 1440px, centrado, `px-cell`). Toda sección cuelga de ahí salvo las que sangran a bleed completo a propósito.
- Mucho whitespace en blanco puro entre secciones: `py-section` = `clamp(80px, 12vw, 160px)`.
- Los bloques de color se usan como "parches" que rompen el grid (se solapan ligeramente con fotos), no como contenedores perfectamente alineados — es intencional, no corregir en el rebuild.
- Fotografías en composición tipo collage (varias fotos de distinto tamaño superpuestas) en el hero y en la sección de "Torre Skypark".

## 6. Modo claro / oscuro

El sitio tiene versión clara y oscura (confirmado con el segundo export de Figma, mismo layout en fondo negro). Comparé ambas versiones pixel a pixel para separar qué es un **tema** (cambia) de qué es **marca** (fijo):

### Qué cambia entre temas
| Token | Clase Tailwind | Claro | Oscuro |
|---|---|---|---|
| `color.surface.base` | `surface` | `#FFFFFF` | `#000000` |
| `color.text.base` | `foreground` | `#0A0A0A` | `#FFFFFF` |
| `color.text.muted` | `foreground-muted` | `#9A9A9A` (confirmar) | `#B5B5B5` (confirmar) — usado en el texto atenuado dentro de un mismo párrafo/titular, ej. la segunda mitad de "...de nuevas **construcciones que comprenden...**" |
| Ilustración de mapa decorativo (footer/CTA final) | — | líneas gris claro sobre blanco | líneas blancas a baja opacidad sobre negro |
| Logos de aliados con bajo contraste (Nest, Sky Park, Invaca) | — | versión a color / negra original | versión monocromática blanca (ver nota abajo) |

> Los nombres de clase (`surface`, `foreground`, `foreground-muted`) son la convención idiomática de Tailwind y equivalen 1:1 a los tokens `color.surface.base` / `color.text.base` / `color.text.muted`.

### Qué NO cambia entre temas (es marca, no tema)
- Los 8 colores de marca (`brand-*`) y sus variantes dark — mismo hex en claro y oscuro. No se re-mapean por tema.
- El color "dueño" de cada sección para el `BrandMark` (ej. Historia = `teal-dark`, la sección de "+500 proyectos" = `coral-light`, la de financiamiento = `orange`) — se mantiene idéntico en ambos temas.
- El **footer**: siempre fondo negro absoluto con el logotipo en blanco, sin importar el tema activo. Es una franja de marca fija, no una superficie themeable — por eso `Footer` usa `bg-black text-white` y no `surface`/`foreground`.
- El gris de tabs inactivos (`gray-400` = `#C7C7C7`) se usa igual en ambos temas — funciona razonablemente sobre negro, pero da poco contraste sobre blanco; si Accesibilidad lo exige, evaluar un gris más oscuro solo para el tema claro (pendiente de decisión, no cambiar sin confirmar con diseño).
- Fotografías y renders 3D: no llevan filtro ni inversión en ningún tema.
- Botones, stat cards, tarjetas de color sólido (Torre Nest, Skypark): mismo color de fondo en ambos temas — lo único que cambia alrededor es el fondo de página y el texto suelto.

### Implementación
- `surface`, `foreground` y `foreground-muted` se resuelven vía CSS variables (`--surface`, `--text`, `--text-muted`) definidas en `app/globals.css` bajo `:root` y `.dark`, no como clases `dark:` repetidas en cada componente — así cada componente de UI referencia la variable, no el tema.
- Los tokens `brand-*` van aparte, fijos, nunca detrás de una CSS variable de tema.
- Toggle de tema con `next-themes` (`attribute="class"` sobre `<html>`) y Tailwind con `darkMode: 'class'`. Ver `app/providers.tsx` y `components/ui/ThemeToggle.tsx`.
- **Logos de aliados**: el modelo de contenido para "partners/aliados" necesita **dos variantes de imagen por logo** (`logoLight` y `logoDark`, ver `content/types.ts`), no una sola — varios logos (Nest, Sky Park, Invaca) usan una versión monocromática blanca en el tema oscuro que no es simplemente "el mismo logo invertido" por CSS, sino un asset distinto. Logos que ya funcionan sobre ambos fondos (ej. Baruta, a color) pueden reutilizar el mismo asset en ambas variantes.

## 7. Iconografía y BrandMark

- **La librería de iconos del proyecto es [Lucide](https://lucide.dev)** (`lucide-react`). Las flechas siguen yendo dentro de una caja cuadrada de color sólido, que es lo que las hace de marca; lo que cambia es de dónde sale el trazo.
  - Las flechas se usan **siempre** a través de `components/ui/Arrow.tsx`, no importando `ArrowRight` suelto en cada sección: ahí se fijan grosor (`2`) y remate recto (`strokeLinecap="square"`), que es lo que pega con la estética de bloques. Un icono de Lucide con remate redondeado por defecto desentona.
  - Los demás iconos (tema, menú) sí se importan directamente de Lucide.
  - Excepciones dibujadas a mano: `Flag` (Lucide no trae banderas, y además son ilustraciones de marca) y los glifos de Instagram y LinkedIn de `SocialIcon` (Lucide retiró las marcas comerciales de la librería; el icono de web sí sale de Lucide). Ambos van con el mismo grosor de trazo que `Arrow` para que convivan en una misma fila.
- **Isotipo de bloques (`BrandMark`)**: el patrón pixelado tipo "E" fragmentada **no se construye como una imagen de color fijo**. Se construye así:
  1. Un contenedor cuadrado con `background-color` = el color de marca que corresponda a la sección (cualquier token `brand-*`).
  2. Encima, un **PNG con fondo transparente** que contiene únicamente los bloques blancos del patrón (mismo PNG siempre, un solo asset).
  3. El PNG se posiciona con `position: absolute; inset: 0` sobre el color de fondo.
  - Resultado: cambiar el color del ícono en cualquier sección es solo cambiar el `background-color` del contenedor — nunca se genera un PNG nuevo por color.
  - Uso: `<BrandMark color="teal-dark" size={96} />`.

### Assets del isotipo (ya entregados)

| Forma | Archivo | Medidas |
|---|---|---|
| `E` (vertical) | `public/brand/iconografia-clm-E.png` | 59×72 |
| `M` (horizontal) | `public/brand/iconografia-clm-M.png` | 72×59 |

Son el mismo patrón en dos orientaciones, de ahí las proporciones inversas. Van en `object-contain` y no `cover`: recortarlas dentro de una caja cuadrada partiría bloques del patrón por la mitad.

Existe además `public/brand/iconografia-clm-1.png` (108×498), una tira vertical del mismo patrón. La usa la sección Skypark como textura del panel de color: va de fondo repetido (no como `next/image`, porque se tilea) a muy baja opacidad sobre el color de marca.

### Assets de logotipo (ya entregados)

| Uso | Archivo |
|---|---|
| Fondo claro | `public/brand/logo-cuadra-las-mercedes-2.png` (280×106) |
| Fondo oscuro | `public/brand/cuadra-las-mercedes-negativo.png` (462×174) |

`public/brand/logo-cuadra-las-mercedes-1.png` es el mismo logo blanco que el negativo pero **sin transparencia**: es un rectángulo opaco `#171717`. Sobre la superficie oscura del sitio (`#000000`) dejaría una caja gris visible, por eso se usa el negativo. No sustituirlo sin comprobar el canal alfa.

Ninguno de los dos archivos entregados para fondo claro tiene alfa: `logo-cuadra-las-mercedes-2.png` trae un fondo **blanco opaco**. Funciona porque `surface` en claro es `#FFFFFF` exacto; si alguna vez se coloca el logotipo sobre un fondo claro que no sea blanco puro, hará falta pedir una versión con transparencia.

## 8. Referencia viva

`/kit` renderiza todos los tokens y componentes de este documento en una sola página, en ambos temas. Es la forma rápida de contrastar contra el Figma sin abrir una sección real. No es una ruta del sitio público.
