import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../lib/gsap'

/*
 * Lenis smooth scroll, driven by the GSAP ticker so ScrollTrigger and Lenis
 * share one clock (no double rAF loops, no scroll-jank between the two).
 */
let lenisInstance = null

export function useLenis() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    lenisInstance = new Lenis({
      duration: reduce ? 0 : 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: !reduce,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    })

    lenisInstance.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenisInstance?.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenisInstance.destroy()
      lenisInstance = null
    }
  }, [])

  return lenisInstance
}

export function getLenis() {
  return lenisInstance
}

/* Scroll to an element / selector / top, respecting the fixed navbar. */
export function scrollToTarget(target, { offset = -72, immediate = false } = {}) {
  const lenis = getLenis()
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (lenis) {
    lenis.scrollTo(el ?? 0, { offset: el ? offset : 0, immediate })
  } else if (el) {
    el.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' })
  } else {
    window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' })
  }
}
