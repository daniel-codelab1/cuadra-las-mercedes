import Image from 'next/image'

import { getHub, type HubPhrase } from '@/content/sections/hub'
import type { Locale } from '@/i18n/routing'
import { ACCENT_BG } from '@/lib/accents'
import { cn } from '@/lib/cn'

import { HubZoom } from './HubZoom'

/**
 * Plano catastral de la zona, de fondo.
 *
 * Es decoración, no contenido: la frase es la que comunica, así que va con
 * `alt` vacío. En tema oscuro se invierte —líneas blancas sobre negro—, que es
 * el tratamiento documentado para el mapa decorativo (DESIGN_SYSTEM.md §6); la
 * opacidad baja es la que lo deja como trama de fondo y no como imagen.
 */
const MAP = { src: '/media/plano-las-mercedes.jpg', width: 1600, height: 989 }

/**
 * "Prime Business Hub".
 *
 * Sección fijada: el plano se acerca con el scroll —como si se bajara sobre la
 * ciudad— mientras la pregunta de entrada se va y aparece la respuesta.
 *
 * El texto se renderiza aquí, en el servidor, ya partido en las piezas que
 * anima el cliente: cada palabra suelta y el tramo destacado entero.
 */
export function Hub({ locale }: { locale: Locale }) {
  const { phrases } = getHub(locale)
  const [question, answer] = phrases

  return (
    <HubZoom
      map={
        <Image
          src={MAP.src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-20 dark:invert"
        />
      }
      question={<Phrase phrase={question} />}
      answer={<Phrase phrase={answer} emphasis="burst" />}
    />
  )
}

/**
 * El tramo del remate, partido en letras.
 *
 * El bloque de color sigue siendo uno solo —es la placa sobre la que se apoya
 * el texto—; lo que se parte es lo de dentro, así que la placa no se mueve
 * mientras las letras entran.
 *
 * Los espacios van fuera de las cajas de letra y sin marcar: no hay nada que
 * animar en un espacio, y meterlo en un `inline-block` impediría que la línea
 * rompiera ahí si alguna vez hiciera falta.
 */
function Letters({ text }: { text: string }) {
  return (
    <>
      {Array.from(text).map((char, index) =>
        char === ' ' ? (
          <span key={index}> </span>
        ) : (
          <span key={index} data-hub-letter className="reveal-init inline-block">
            {char}
          </span>
        ),
      )}
    </>
  )
}

/**
 * Una frase de la sección: líneas centradas, con un tramo sobre un bloque del
 * color de acento.
 *
 * El texto se parte aquí en las piezas que anima el cliente: cada palabra por
 * separado y el tramo destacado entero. `emphasis` decide cómo entra ese tramo
 * —barrido de izquierda a derecha, o abriéndose desde el centro en el remate—.
 */
function Phrase({
  phrase,
  emphasis = 'wipe',
}: {
  phrase: HubPhrase
  emphasis?: 'wipe' | 'burst'
}) {
  const burst = emphasis === 'burst'
  return (
    <p className="text-balance px-cell text-center font-display text-statement text-foreground">
      {phrase.lines.map((line, lineIndex) => (
        <span key={lineIndex} className="block">
          {line.map((segment, index) => {
            const space = index > 0 ? ' ' : null

            if (segment.highlight) {
              return (
                <span key={index}>
                  {space}
                  <span
                    data-hub-piece={burst ? 'highlight-burst' : 'highlight'}
                    className={cn(
                      'inline-block px-3 pb-1 pt-0.5 text-white',
                      burst ? 'burst-init' : 'draw-init',
                      ACCENT_BG[phrase.accent],
                    )}
                  >
                    {burst ? <Letters text={segment.text} /> : segment.text}
                  </span>
                </span>
              )
            }

            // El texto llano se parte en palabras: son las piezas que entran
            // una tras otra. El espacio va fuera del `inline-block` para que la
            // línea siga pudiendo romper donde toca.
            return (
              <span key={index}>
                {space}
                {segment.text.split(' ').map((word, wordIndex) => (
                  <span key={wordIndex}>
                    {wordIndex > 0 ? ' ' : null}
                    <span data-hub-piece="word" className="reveal-init inline-block">
                      {word}
                    </span>
                  </span>
                ))}
              </span>
            )
          })}
        </span>
      ))}
    </p>
  )
}
