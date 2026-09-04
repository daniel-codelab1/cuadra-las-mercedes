'use client'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

/**
 * Punto único de registro de GSAP. Todo hook o componente que necesite GSAP
 * importa desde aquí — nunca desde 'gsap/ScrollTrigger' directamente, para que
 * el plugin se registre una sola vez y siempre del lado del cliente.
 *
 * `SplitText` parte un texto en líneas, palabras o caracteres para animarlos
 * por separado. Era un plugin de pago hasta GSAP 3.13; desde entonces viene en
 * el paquete y no hace falta licencia. Quien lo use tiene que revertir el
 * troceado al limpiar, o el marcado se queda partido.
 *
 * `useGSAP` es el hook oficial de @gsap/react: revierte animaciones y
 * ScrollTriggers al desmontar sin que haya que acordarse del `ctx.revert()`.
 * Es el patrón por defecto del proyecto; no usar `useEffect` + `gsap.context()`
 * a mano.
 */
if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)
}

/** true si el usuario pidió menos movimiento a nivel de sistema. */
export function prefersReducedMotion() {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export { gsap, ScrollTrigger, SplitText, useGSAP }
