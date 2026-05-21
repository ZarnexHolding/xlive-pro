import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { HiX } from "react-icons/hi";
import clsx from "clsx";
import xliveLogo from "../../assets/Xlive-logo-trans.png";
import { getLenis } from "../../hooks/useLenis";

const EASE_LUXURY = [0.16, 1, 0.3, 1];
const EASE_SNAP = [0.76, 0, 0.24, 1];

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Sectors", href: "#sectors" },
  { label: "Clients", href: "#clients" },
  { label: "Contact", href: "#contact" },
];

function NavLink({ label, href, onClick, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      onClick={() => onClick(href)}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative text-[12px] tracking-[0.08em] uppercase font-body
                 text-cream/45 hover:text-cream transition-colors duration-300 py-1"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        delay: 0.3 + index * 0.07,
        ease: EASE_LUXURY,
      }}
    >
      {label}
      {/* Underline reveal */}
      <motion.span
        className="absolute bottom-0 left-0 h-px bg-accent origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: EASE_SNAP }}
      />
    </motion.button>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { scrollY } = useScroll();

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 50));
    return unsub;
  }, [scrollY]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleNavClick = (href) => {
    const scrollToTarget = () => {
      const target = document.querySelector(href);
      if (!target) return;

      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(target);
        return;
      }

      target.scrollIntoView({ behavior: "smooth" });
    };

    setMenuOpen(false);

    if (menuOpen) {
      setTimeout(scrollToTarget, 450);
      return;
    }

    scrollToTarget();
  };

  return (
    <>
      {/* ── MAIN NAVBAR ─────────────────────────────── */}
      <motion.header
        className={clsx(
          `
    fixed top-0 left-0 right-0 z-50
    transition-all duration-700 overflow-hidden

    before:absolute
    before:inset-0
    before:bg-gradient-to-b
    before:from-black/70
    before:to-transparent
    before:pointer-events-none
    before:z-[-1]
    `,
          scrolled
            ? "bg-bg/85 backdrop-blur-xl border-b border-cream/[0.06]"
            : "bg-transparent",
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 1,
          delay: 0.1,
          ease: EASE_LUXURY,
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-5 md:px-10 lg:px-16">
          <div className="flex items-center justify-between h-[74px] md:h-[88px]">
            {/* LOGO */}
            <motion.a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center flex-shrink-0"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: EASE_LUXURY }}
              whileHover={{ opacity: 0.85 }}
            >
              <img
                src={xliveLogo}
                alt="XLIVE"
                className="h-8 md:h-12 w-auto object-contain"
                style={{ filter: "brightness(1.05)" }}
              />
            </motion.a>

            {/* DESKTOP NAV */}
            <nav className="hidden md:flex items-center gap-10">
              {navLinks.map((link, i) => (
                <NavLink
                  key={link.label}
                  {...link}
                  index={i}
                  onClick={handleNavClick}
                />
              ))}
            </nav>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-4">
              {/* CTA */}
              <CTAButton
                onClick={() => handleNavClick("#contact")}
                className="hidden md:flex"
              >
                Start a Project
              </CTAButton>

              {/* MOBILE BURGER */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="
    md:hidden
    relative
    w-10
    h-10
    flex
    items-center
    justify-center
    z-50
  "
                aria-label="Toggle menu"
              >
                <div className="relative w-5 h-4">
                  <span
                    className={clsx(
                      "absolute left-0 w-full h-px bg-cream transition-all duration-500",
                      menuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0",
                    )}
                  />

                  <span
                    className={clsx(
                      "absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-cream transition-all duration-300",
                      menuOpen ? "opacity-0" : "opacity-100",
                    )}
                  />

                  <span
                    className={clsx(
                      "absolute left-0 w-full h-px bg-cream transition-all duration-500",
                      menuOpen
                        ? "top-1/2 -translate-y-1/2 -rotate-45"
                        : "bottom-0",
                    )}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ── MOBILE OVERLAY ──────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-[#050505]/95 backdrop-blur-2xl flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE_SNAP }}
          >
            {/* Mobile nav header */}
            <div className="flex items-center justify-between h-[68px] px-5 border-b border-cream/[0.06]">
              <button
                onClick={() => setMenuOpen(false)}
                className="text-cream/60 hover:text-cream transition-colors p-1"
              >
                <HiX size={20} />
              </button>
            </div>

            {/* Links */}
            <nav className="flex flex-col px-5 pt-10">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left py-5 font-display font-bold text-cream/55
                             hover:text-cream border-b border-cream/[0.06]
                             transition-colors duration-200"
                  style={{ fontSize: "clamp(2.2rem, 8vw, 4rem)" }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.2 + i * 0.06,
                    duration: 0.5,
                    ease: EASE_LUXURY,
                  }}
                >
                  <span className="flex items-center justify-between">
                    {link.label}
                    <span className="text-accent text-base font-body font-normal tracking-widest">
                      0{i + 1}
                    </span>
                  </span>
                </motion.button>
              ))}
            </nav>

            {/* Mobile footer */}
            <div className="mt-auto px-5 pb-10">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <button
                  onClick={() => handleNavClick("#contact")}
                  className="w-full h-[52px] rounded-full inline-flex items-center justify-center bg-cream text-bg hover:bg-accent hover:text-cream transition-all duration-300 text-[11px] tracking-[0.16em] uppercase font-body font-medium mb-6"
                >
                  Start a Project
                </button>
                <p className="text-cream/25 text-[10px] tracking-widest uppercase font-body">
                  Middle East · Event Production & Technologies
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Shared CTA component
function CTAButton({ children, onClick, className = "" }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        delay: 0.65,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`
  relative z-10
  h-[44px]
  px-7
  inline-flex
  items-center
  justify-center
        rounded-full
        bg-cream
        text-bg
        text-[11px]
        uppercase
        tracking-[0.08em]
        font-medium
        transition-all
        duration-300
        hover:bg-accent
        hover:text-cream
        hover:scale-[1.02]
        active:scale-[0.98]
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}
