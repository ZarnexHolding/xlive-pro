import { useEffect } from 'react'
import Lenis from 'lenis'

let lenisInstance = null

export function useLenis() {
  useEffect(() => {
    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    })

    function raf(time) {
      lenisInstance.raf(time)
      requestAnimationFrame(raf)
    }

    const rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenisInstance.destroy()
      lenisInstance = null
    }
  }, [])

  return lenisInstance
}

export function getLenis() {
  return lenisInstance
}
