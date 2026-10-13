/*
 * Single GSAP entry point. Register plugins once here and import `gsap`,
 * `ScrollTrigger` and `useGSAP` from this module everywhere else so the
 * registration and the global defaults live in one place.
 *
 * Performance rules (keep them):
 *  - animate transforms + opacity only (compositor-friendly), never layout props
 *  - every scroll animation is created inside useGSAP() so it is cleaned up on
 *    unmount / route change (ScrollTriggers otherwise leak across pages)
 *  - wrap motion in gsap.matchMedia() with the reduced-motion query so users who
 *    opt out get static, fully visible content
 */
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

gsap.defaults({ ease: 'expo.out', duration: 1 })

// Reduced-motion query used by every section's matchMedia block.
export const MOTION_OK = '(prefers-reduced-motion: no-preference)'
export const DESKTOP = '(min-width: 1024px)'

export { gsap, ScrollTrigger, useGSAP }
