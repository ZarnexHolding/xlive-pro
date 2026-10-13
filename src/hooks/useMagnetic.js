import { useEffect } from 'react'
import { gsap } from '../lib/gsap'

/*
 * Magnetic hover: while the pointer is over the element it leans toward the
 * cursor (a fraction of the cursor's offset from its centre, capped at `max`
 * px so neighbouring buttons never touch) and springs back
 * on leave. Listens on the element itself only, so neighbouring buttons never
 * react to each other's hover. No-op on coarse pointers and under
 * prefers-reduced-motion.
 */
export function useMagnetic(ref, { strength = 0.22, max = 10 } = {}) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return

    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' })

    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      xTo(gsap.utils.clamp(-max, max, (e.clientX - (r.left + r.width / 2)) * strength))
      yTo(gsap.utils.clamp(-max, max, (e.clientY - (r.top + r.height / 2)) * strength))
    }
    const onLeave = () => {
      xTo(0)
      yTo(0)
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [ref, strength, max])
}
