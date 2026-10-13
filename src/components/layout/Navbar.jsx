import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { HiMenuAlt4, HiX } from 'react-icons/hi'
import logo from '../../assets/Xlive-logo-trans.png'
import { nav } from '../../data/company'
import { scrollToTarget } from '../../hooks/useLenis'
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap'
import Button from '../ui/Button'

/*
 * Fixed navbar. Turns solid after the first scroll, slides away while
 * scrolling down and returns on the first upward scroll so the footage and
 * the headlines own the viewport. Mobile menu is a GSAP timeline.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const header = useRef(null)
  const menu = useRef(null)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useGSAP(
    () => {
      const st = ScrollTrigger.create({
        start: 'top -40',
        end: 'max',
        onUpdate: (self) => {
          setScrolled(self.scroll() > 40)
          if (open) return
          const hide = self.direction === 1 && self.scroll() > 160
          gsap.to(header.current, { yPercent: hide ? -100 : 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' })
        },
        onLeaveBack: () => {
          setScrolled(false)
          gsap.to(header.current, { yPercent: 0, duration: 0.4, overwrite: 'auto' })
        },
      })
      return () => st.kill()
    },
    { dependencies: [open] },
  )

  // Mobile menu open / close
  useGSAP(
    () => {
      const el = menu.current
      if (!el) return
      const items = el.querySelectorAll('[data-menu-item]')
      if (open) {
        gsap.set(el, { display: 'block' })
        gsap.timeline()
          .fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, ease: 'power2.out' })
          .fromTo(items, { autoAlpha: 0, x: -18 }, { autoAlpha: 1, x: 0, duration: 0.5, stagger: 0.05, ease: 'expo.out' }, 0.1)
      } else {
        gsap.to(el, { autoAlpha: 0, duration: 0.25, onComplete: () => gsap.set(el, { display: 'none' }) })
      }
    },
    { dependencies: [open] },
  )

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Anchor links: scroll on home, else navigate home first then scroll.
  const go = (href) => (e) => {
    e.preventDefault()
    setOpen(false)
    if (pathname !== '/') {
      navigate('/')
      setTimeout(() => scrollToTarget(href === '#top' ? null : href), 550)
    } else {
      setTimeout(() => scrollToTarget(href === '#top' ? null : href), open ? 300 : 0)
    }
  }

  const linkCls = 'group relative font-body text-sm text-fg-muted hover:text-fg transition-colors'
  const underline = (
    <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-acid transition-transform duration-300 ease-expo group-hover:scale-x-100" />
  )

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div
        ref={header}
        className={`transition-colors duration-500 ${
          scrolled || open ? 'bg-ink-950/80 backdrop-blur-md border-b border-line-soft' : 'bg-transparent'
        }`}
      >
      <nav className="shell flex items-center justify-between h-[74px]">
        <a href="#top" onClick={go('#top')} className="flex items-center gap-3" aria-label="XLIVE Production home">
          <img src={logo} alt="XLIVE Production" className="h-10 w-auto" width={120} height={40} />
        </a>

        <div className="hidden lg:flex items-center gap-8">
          {nav.map((item) =>
            item.to ? (
              <Link key={item.label} to={item.to} onClick={() => setOpen(false)} className={linkCls}>
                {item.label}
                {underline}
              </Link>
            ) : (
              <a key={item.label} href={item.href} onClick={go(item.href)} className={linkCls}>
                {item.label}
                {underline}
              </a>
            ),
          )}
        </div>

        <div className="hidden lg:block">
          <Button href="#contact" onClick={go('#contact')} size="sm">
            Start a project
          </Button>
        </div>

        <button
          className="lg:hidden text-fg p-2 -mr-2"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <HiX size={26} /> : <HiMenuAlt4 size={26} />}
        </button>
      </nav>
      </div>

      <div ref={menu} className="lg:hidden fixed inset-0 top-[74px] bg-ink-950/98 backdrop-blur-lg hidden">
        <div className="shell py-10 flex flex-col gap-2">
          {nav.map((item) => {
            const cls = 'font-display font-bold font-semi-wide text-3xl uppercase py-3 border-b border-line-soft block'
            return item.to ? (
              <div key={item.to} data-menu-item>
                <Link to={item.to} onClick={() => setOpen(false)} className={cls}>
                  {item.label}
                </Link>
              </div>
            ) : (
              <a key={item.label} data-menu-item href={item.href} onClick={go(item.href)} className={cls}>
                {item.label}
              </a>
            )
          })}
          <div data-menu-item className="mt-8">
            <Button href="#contact" onClick={go('#contact')} size="lg" className="w-full">
              Start a project
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
