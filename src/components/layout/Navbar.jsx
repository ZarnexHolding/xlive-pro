import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { HiMenuAlt4, HiX } from 'react-icons/hi'
import logo from '../../assets/Xlive-logo-trans.png'
import { nav } from '../../data/company'
import { getLenis } from '../../hooks/useLenis'
import Button from '../ui/Button'

function scrollTo(href) {
  if (href === '#top') {
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(0)
    else window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  const el = document.querySelector(href)
  if (!el) return
  const lenis = getLenis()
  if (lenis) lenis.scrollTo(el, { offset: -40 })
  else el.scrollIntoView({ behavior: 'smooth' })
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  // Anchor links: scroll on home, else navigate home first then scroll.
  const go = (href) => (e) => {
    e.preventDefault()
    setOpen(false)
    if (pathname !== '/') {
      navigate('/')
      setTimeout(() => scrollTo(href), 550)
    } else {
      setTimeout(() => scrollTo(href), open ? 300 : 0)
    }
  }

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-500 ${
        scrolled ? 'bg-ink-950/80 backdrop-blur-md border-b border-line-soft' : 'bg-transparent'
      }`}
    >
      <nav className="shell flex items-center justify-between h-[74px]">
        <a href="#top" onClick={go('#top')} className="flex items-center gap-3" aria-label="XLIVE Production — home">
          <img src={logo} alt="XLIVE Production" className="h-7 w-auto" />
        </a>

        <div className="hidden lg:flex items-center gap-8">
          {nav.map((item) =>
            item.to ? (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setOpen(false)}
                className="group relative font-body text-sm text-fg-muted hover:text-fg transition-colors"
              >
                {item.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-acid transition-transform duration-300 ease-expo group-hover:scale-x-100" />
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                onClick={go(item.href)}
                className="group relative font-body text-sm text-fg-muted hover:text-fg transition-colors"
              >
                {item.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-acid transition-transform duration-300 ease-expo group-hover:scale-x-100" />
              </a>
            )
          )}
        </div>

        <div className="hidden lg:block">
          <Button href="#contact" onClick={go('#contact')} size="sm">Start a project</Button>
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

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 top-[74px] bg-ink-950/98 backdrop-blur-lg"
          >
            <div className="shell py-10 flex flex-col gap-2">
              {nav.map((item, i) => {
                const cls = 'font-display font-bold text-3xl uppercase py-3 border-b border-line-soft'
                const anim = {
                  initial: { opacity: 0, x: -20 },
                  animate: { opacity: 1, x: 0 },
                  transition: { delay: 0.05 * i + 0.1 },
                }
                return item.to ? (
                  <motion.div key={item.to} {...anim}>
                    <Link to={item.to} onClick={() => setOpen(false)} className={`block ${cls}`}>
                      {item.label}
                    </Link>
                  </motion.div>
                ) : (
                  <motion.a key={item.label} href={item.href} onClick={go(item.href)} className={cls} {...anim}>
                    {item.label}
                  </motion.a>
                )
              })}
              <Button href="#contact" onClick={go('#contact')} size="lg" className="mt-8 w-full">
                Start a project
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
