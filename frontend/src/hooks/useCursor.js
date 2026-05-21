import { useEffect } from 'react'

const lerp = (a, b, n) => (1 - n) * a + n * b
const HOVER_SELECTOR = 'a,button,.card,.srv,.exp-card,.client-item,.footer-nav a'

export default function useCursor() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Only enable on fine pointer devices.
    if (window.matchMedia && !window.matchMedia('(pointer: fine)').matches) return

    const dot = document.getElementById('cur')
    const ring = document.getElementById('cur-ring')
    if (!dot || !ring) return

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let rx = mx
    let ry = my
    let rafId = 0

    dot.style.left = `${mx}px`
    dot.style.top = `${my}px`
    ring.style.left = `${rx}px`
    ring.style.top = `${ry}px`

    const animateRing = () => {
      rx = lerp(rx, mx, 0.1)
      ry = lerp(ry, my, 0.1)
      ring.style.left = `${rx}px`
      ring.style.top = `${ry}px`
      rafId = window.requestAnimationFrame(animateRing)
    }

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      dot.style.left = `${mx}px`
      dot.style.top = `${my}px`
      document.body.classList.add('cursor-ready')
    }

    const onOver = (e) => {
      const target = e.target
      if (target instanceof Element && target.closest(HOVER_SELECTOR)) {
        document.body.classList.add('hov')
      }
    }

    const onOut = (e) => {
      const target = e.target
      if (target instanceof Element && target.closest(HOVER_SELECTOR)) {
        document.body.classList.remove('hov')
      }
    }

    rafId = window.requestAnimationFrame(animateRing)
    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)

    return () => {
      window.cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      document.body.classList.remove('hov')
      document.body.classList.remove('cursor-ready')
    }
  }, [])
}
