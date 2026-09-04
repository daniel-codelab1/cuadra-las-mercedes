import Image from 'next/image'

import { BackgroundVideo, BrandMark, Button, RichText } from '@/components/ui'
import { getSkypark } from '@/content/sections/skypark'
import { getSkyparkEditorial } from '@/content/sections/skyparkEditorial'
import type { MediaSlide } from '@/content/types'
import type { Locale } from '@/i18n/routing'
import { cn } from '@/lib/cn'
import { isVector } from '@/lib/media'

import { EditorialReveal } from './EditorialReveal'

/**
 * Torre Skypark — versión editorial.
 *
 * Dos columnas asimétricas: a la izquierda una foto grande y, debajo, el
 * párrafo largo; a la derecha el titular, su párrafo y un par de fotos
 * pequeñas al pie.
 *
 * De la referencia se toma la distribución, no el acabado: las esquinas van
 * rectas y no redondeadas, que es la regla de marca (`borderRadius: none |
 * min`, DESIGN_SYSTEM.md). Los tamaños de texto y los aires salen de los tokens.
 *
 * Usa el contenido de `skypark` tal cual, sin copiarlo: el titular y el párrafo
 * corto son los del primer piso, el largo es la nota al pie, y las tres fotos
 * son las de los tres pisos.
 */
export function SkyparkEditorial({ locale }: { locale: Locale }) {
  const { slides, footnote } = getSkypark(locale)
  // Los textos salen de los pisos; los medios, de la composición editorial.
  const [copy] = slides
  const { cta, lead, aside } = getSkyparkEditorial(locale)

  // `py-cell` en vez del `py-section` habitual: esta sección va entre dos que
  // ocupan la pantalla entera y no traen aire propio, así que el suyo es todo
  // el que separa. Con el aire de sección quedaban 160px por lado y se leía
  // como un hueco, no como una separación. Es el mismo valor que usa `historia`.
  return (
    <EditorialReveal id="skypark-editorial" className="py-cell">
      <div className="grid pr-cell gap-cell lg:grid-cols-2">
        {/* --- Columna izquierda ------------------------------------------
            Menos aire que por defecto: el párrafo sube y queda a la altura del
            bloque de texto del lado contrario, en vez de descolgado.

            `order-2 lg:order-1`: apilada, va segunda — el título entra primero
            y esta foto grande queda de cierre. En `lg` vuelve a su lugar, a la
            izquierda, que es donde la deja el orden de las pistas del grid. */}
        <div className="order-2 flex flex-col gap-cell lg:order-1">
          <Media
            media={lead}
            sizes="(min-width: 1024px) 45vw, 92vw"
            className="aspect-[16/10]"
            notch={['step-top-left', 'bottom-right']}
          />
          <p data-text className="reveal-init ml-cell max-w-prose text-body text-foreground">
            <RichText value={footnote} />
          </p>

          {/* El envoltorio lleva las marcas de animación en vez del botón: así
              lo que se enciende y se apaga es una caja, y `data-cta` deja
              señalado lo único interactivo de la sección, que necesita quedar
              fuera del alcance del teclado mientras está invisible. */}
          <span data-text data-cta className="reveal-init ml-cell block w-fit">
            <Button href={cta.href} accent="olive">
              {cta.label}
            </Button>
          </span>
        </div>

        {/* --- Columna derecha --------------------------------------------
            Media celda entre el titular y su párrafo, igual que la columna de
            enfrente. El bloque de fotos no se aprieta con esto: lo empuja al
            fondo su `mt-auto`, que se queda con el hueco que sobre.

            `order-1 lg:order-2`: apilada, va primera — se lee el título antes
            que la foto grande de la otra columna. En `lg` vuelve a su lugar, a
            la derecha.

            El isotipo, el título y el párrafo siguen llevando `ml-cell`
            aunque ahora abran la sección: nada de esta sección trae `pl-cell`
            propio (§ arriba), así que sin ese margen tocarían el borde de la
            pantalla estén primeros o segundos en el orden. */}
        <div className="order-1 flex flex-col gap-cell-half lg:order-2">
          {/* Isotipo de bloques abriendo la columna. El envoltorio no es
              decorativo: `BrandMark` no propaga props, así que un `data-*`
              puesto encima se perdería sin que TypeScript dijera nada
              (CLAUDE.md). `w-fit` lo deja del ancho del isotipo y no del de la
              columna, que es lo que hace que caiga en su sitio.

              Va sin `size`: dimensionado por clase, `size-cell-mark` es una
              celda fluida con la ventana —pero con el piso de 44px de las
              muescas de marca, ver globals.css— y no los 72px fijos de
              `BRANDMARK_CELL_SIZE`. La separación con el titular la da el
              `gap-cell-half` de la columna. */}
          <span data-mark className="reveal-init ml-cell block w-fit mb-cell lg:mb-0 lg:ml-0">
            <BrandMark shape="E" color="navy" className="size-cell-mark" />
          </span>

          {/* Texto llano: lo trocea `SplitText` en el cliente. `reveal-init` lo
              mantiene apagado hasta entonces, para que no asome el titular sin
              animar entre el pintado y la hidratación. */}
          <h2
            data-heading
            className="reveal-init ml-cell font-display text-h1 text-foreground mb-cell lg:mb-0 lg:ml-0"
          >
            {copy.title}
          </h2>

          <p data-text className="reveal-init ml-cell max-w-prose text-body text-foreground lg:ml-0">
            <RichText value={copy.body} />
          </p>

          {/* Las dos fotos pequeñas, al pie de la columna. `mt-auto` las
              empuja abajo cuando la columna da de sí, que es lo que las alinea
              con el párrafo largo del lado contrario. */}
          <div className="mt-cell grid grid-cols-2 gap-cell-half">
            {aside.map((media, index) => (
              <Media
                key={index}
                media={media}
                sizes="(min-width: 1024px) 22vw, 45vw"
                className="aspect-[16/11]"
                // Sólo la última, que es la que queda abajo a la derecha del
                // bloque. Sale del índice y no de un identificador, así que
                // sigue siendo la de la esquina aunque cambien los medios.
                notch={index === aside.length - 1 ? 'step-bottom-right' : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </EditorialReveal>
  )
}

/**
 * Las muescas, cada una como la lista de bloques que la componen.
 *
 * Es una lista y no una clase suelta porque una muesca puede ser un escalón:
 * varias piezas de distinto tamaño encajadas en la misma esquina. Las clases
 * van escritas enteras —posición y medidas juntas— porque Tailwind sólo genera
 * las que encuentra literales en el código.
 */
const NOTCHES = {
  /** Escalón: 2×1 celdas a ras de la esquina y 1×1 justo debajo, contra el borde. */
  'step-top-left': ['left-0 top-0 h-cell-mark w-cell-mark-2', 'left-0 top-cell-mark size-cell-mark'],
  /** El mismo escalón girado 180°, para la esquina contraria. */
  'step-bottom-right': [
    'bottom-0 right-0 h-cell-mark w-cell-mark-2',
    'bottom-cell-mark right-0 size-cell-mark',
  ],
  /** Un solo bloque, sin escalón. */
  'bottom-right': ['bottom-0 right-0 size-cell-mark'],
} as const

type NotchName = keyof typeof NOTCHES

/**
 * Una foto dentro de su caja de proporción. `data-media` la marca como una de
 * las que se descubren al final, cuando el texto ya está puesto.
 *
 * `notch` le muerde una esquina con un bloque de una celda en `surface`, que es
 * el tratamiento del kit para recortar la esquina de una foto (DESIGN_SYSTEM.md
 * §4, composición de Skypark). Va **dentro** de la caja, no fuera: así el
 * recorte de la entrada lo descubre junto con la foto en vez de dejarlo puesto
 * sobre una imagen que aún no ha aparecido.
 */
function Media({
  media,
  sizes,
  className,
  notch,
}: {
  media: MediaSlide
  sizes: string
  className: string
  /**
   * Una muesca o varias: una foto puede llevar muescas en esquinas distintas.
   * Se aplanan a la lista de bloques que hay que pintar.
   */
  notch?: NotchName | NotchName[]
}) {
  const piezas = notch ? [notch].flat().flatMap((nombre) => NOTCHES[nombre]) : []
  return (
    <div data-media className={cn('reveal-init relative w-full overflow-hidden', className)}>
      {media.type === 'image' ? (
        <Image
          src={media.image.url}
          alt={media.image.alt}
          fill
          unoptimized={isVector(media.image.url)}
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <BackgroundVideo src={media.src} poster={media.poster?.url} alt={media.alt} />
      )}

      {piezas.map((pieza) => (
        <span key={pieza} aria-hidden="true" className={cn('absolute bg-surface', pieza)} />
      ))}
    </div>
  )
}
