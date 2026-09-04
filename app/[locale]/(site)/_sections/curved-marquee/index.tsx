import { CurvedLoop } from '@/components/ui'
import { getCurvedMarquee } from '@/content/sections/curvedMarquee'
import type { Locale } from '@/i18n/routing'

/**
 * Banda de marca en curva, entre financiamiento y Skypark.
 *
 * Es un respiro entre dos secciones que ocupan la pantalla entera: no cuenta
 * nada nuevo, repite el nombre de la marca siguiendo un arco.
 *
 * El color y el tamaño se pasan aquí y no viven en el componente: `fill-*`
 * porque en SVG el color del texto es el relleno, no `color`, y `foreground`
 * para que siga al tema —el registro traía blanco fijo, invisible sobre esta
 * página—.
 *
 * `overflow-hidden` en la sección: el arco se sale de su caja a propósito, y
 * sin recortarlo se mete en las secciones vecinas.
 *
 * `hidden lg:block`: fuera en móvil. Es sólo un respiro decorativo entre dos
 * secciones fijadas —no cuenta nada que no esté ya en el resto del sitio—, y
 * ese respiro ya lo da de sobra el propio scroll normal de un teléfono, sin
 * la banda curva.
 */
export function CurvedMarquee({ locale }: { locale: Locale }) {
  const { text } = getCurvedMarquee(locale)

  return (
    <section id="marquesina" className="hidden overflow-hidden py-cell lg:block">
      <CurvedLoop
        marqueeText={text}
        curveAmount={160}
        speed={70}
        className="fill-foreground font-display text-display"
      />
    </section>
  )
}
