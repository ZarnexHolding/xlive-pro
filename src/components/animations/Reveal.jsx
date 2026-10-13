import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../../lib/gsap'

/*
 * Scroll reveals (GSAP + ScrollTrigger). Same API as the old Framer version:
 *   <Reveal delay={0.1}>…</Reveal>
 *   <RevealGroup><RevealItem/>…</RevealGroup>   (staggered children)
 *
 * Elements are put in their hidden state by GSAP at mount, not by CSS, so with
 * JS disabled (or a crawler that does not run animations) the content is simply
 * visible. Under prefers-reduced-motion nothing is hidden at all.
 */
export function Reveal({ children, delay = 0, className = '', as: Tag = 'div', y = 28, start = 'top 88%' }) {
  const ref = useRef(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          ref.current,
          { autoAlpha: 0, y },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            delay,
            ease: 'expo.out',
            scrollTrigger: { trigger: ref.current, start, once: true },
          },
        )
      })
      return () => mm.revert()
    },
    { scope: ref },
  )
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}

export function RevealGroup({ children, className = '', stagger = 0.08, y = 28, start = 'top 85%' }) {
  const ref = useRef(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const items = ref.current.querySelectorAll('[data-reveal-item]')
        if (!items.length) return
        gsap.fromTo(
          items,
          { autoAlpha: 0, y },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            stagger,
            ease: 'expo.out',
            scrollTrigger: { trigger: ref.current, start, once: true },
          },
        )
      })
      return () => mm.revert()
    },
    { scope: ref },
  )
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

export function RevealItem({ children, className = '', as: Tag = 'div', ...rest }) {
  return (
    <Tag data-reveal-item className={className} {...rest}>
      {children}
    </Tag>
  )
}
