import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const EASE_LUXURY = [0.16, 1, 0.3, 1];
const EASE_SNAP = [0.76, 0, 0.24, 1];

// Per-line masked reveal — cinematic upward slide
function SplitLine({ children, delay, loaded }) {
  return (
    <div className="overflow-hidden" style={{ paddingBottom: "0.07em" }}>
      <motion.div
        initial={{ y: "110%", opacity: 0 }}
        animate={loaded ? { y: "0%", opacity: 1 } : { y: "110%", opacity: 0 }}
        transition={{ duration: 1.05, delay, ease: EASE_LUXURY }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Premium fill-sweep CTA
function HeroCTA({ children, primary = false, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 0.975 }}
      className={`
        relative overflow-hidden flex items-center
        px-6 py-3 text-[11px] font-body font-medium tracking-[0.15em] uppercase
        transition-colors duration-300
        ${
          primary
            ? "bg-accent text-cream"
            : "border border-cream/20 text-cream/75 hover:bg-[#ffffff] hover:text-black transition-all duration-500 hover:scale-[1.03] "
        }
      `}
    >
      {/* Sweep overlay */}
      <motion.span
        className={`absolute inset-0 origin-left ${primary ? "bg-white/[0.08]" : "bg-cream/[0.05]"}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.38, ease: EASE_SNAP }}
      />
      <span className="relative z-10">{children}</span>
      {/* Arrow slides in */}
      <motion.span
        className="relative z-10 ml-2 flex items-center"
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -6 }}
        transition={{ duration: 0.25, ease: EASE_SNAP }}
      >
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <path
            d="M1 5.5h9M6 1.5l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.span>
    </motion.button>
  );
}

export default function Hero({ loaded = true, onHeroReady }) {
  const containerRef = useRef(null);

  const { scrollY } = useScroll();
  const rawScale = useTransform(scrollY, [0, 700], [1, 1.08]);
  const rawY = useTransform(scrollY, [0, 700], [0, 60]);
  const videoScale = useSpring(rawScale, { stiffness: 45, damping: 20 });
  const contentY = useSpring(rawY, { stiffness: 45, damping: 20 });

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen min-h-[640px] overflow-hidden"
    >
      {/* ─── VIDEO ───────────────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 z-0 will-change-transform"
        style={{ scale: videoScale }}
      >
        <video
          className="w-full h-full object-cover"
          style={{ objectPosition: "78% center" }}
          autoPlay
          muted
          loop
          playsInline
          poster="/poster.jpg"
          src="/videos/hero.mp4"
          onLoadedData={onHeroReady}
          onCanPlay={onHeroReady}
          onCanPlayThrough={onHeroReady}
          onError={onHeroReady}
        />
      </motion.div>

      {/* ─── CINEMATIC OVERLAY STACK ─────────────────────────── */}
      {/* 1. Base dim */}
      <div className="absolute inset-0 z-[1] bg-black/40" />
      {/* 2. Strong left vignette — anchors text panel to scene */}
      {/* Strong cinematic readability overlay */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background: `
      linear-gradient(
        90deg,
        rgba(4,4,4,0.92) 0%,
        rgba(4,4,4,0.78) 32%,
        rgba(4,4,4,0.42) 58%,
        rgba(4,4,4,0.12) 78%,
        transparent 100%
      )
    `,
        }}
      />
      {/* 3. Bottom fade — grounds scene to site body */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background:
            "linear-gradient(to top, #080808 0%, rgba(8,8,8,0.6) 22%, transparent 50%)",
        }}
      />
      {/* 4. Top fade — gives navbar breathing room */}
      <div
        className="absolute top-0 left-0 right-0 h-44 z-[2]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(8,8,8,0.55) 0%, transparent 100%)",
        }}
      />
      {/* 5. Subtle perimeter vignette — cinematic edge darkening */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          boxShadow: "inset 0 0 120px rgba(8,8,8,0.5)",
        }}
      />

      {/* ─── CONTENT ─────────────────────────────────────────── */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 h-full w-full flex items-stretch will-change-transform"
      >
        {/*
          LAYOUT: full height flex row.
          Left column (45–50% on desktop) = content panel.
          Right side remains open — video breathes through.
        */}
        <div
          className="w-full flex flex-col justify-between
                        max-w-7xl mx-auto px-5 md:px-10 lg:px-16
                        pt-20 md:pt-24 pb-6 md:pb-8"
        >
          {/* TOP: eyebrow tag */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: -6 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.05, ease: EASE_LUXURY }}
          >
            <span className="w-4 h-px bg-accent flex-shrink-0" />
            <span className="text-[10px] tracking-[0.22em] uppercase text-cream/40 font-body">
              Event Production & Technologies&nbsp;&nbsp;·&nbsp;&nbsp;Middle
              East
            </span>
          </motion.div>

          {/* CENTRE: main content panel */}
          <div className="flex-1 flex items-center">
            {/*
              The content panel: left-aligned, constrained to ~48% on desktop.
              On mobile it goes full-width (video is barely visible anyway on small screens).
              The dark gradient makes the left side readable without a box.
            */}
            <div className="w-full max-w-[850px] pt-10 md:pt-14">

              {/* H1 — Premium Cinematic Composition */}
              <h1
                className="font-display text-cream mb-6 md:mb-7"
                style={{
                  letterSpacing: "-0.045em",
                  lineHeight: 0.88,
                }}
              >
                {/* Small Intro */}
                <SplitLine delay={0.22} loaded={loaded}>
                  <span
                    className="block text-cream/60 font-semibold mb-3"
                    style={{
                      fontSize: "clamp(1rem, 1.4vw, 1.5rem)",
                    }}
                  >
                    Your Vision,
                  </span>
                </SplitLine>

                {/* Main */}
                <SplitLine delay={0.34} loaded={loaded}>
                  <span
                    className="block font-extrabold text-cream"
                    style={{
                      fontSize: "clamp(3rem, 5.8vw, 5.8rem)",
                    }}
                  >
                    Engineered
                  </span>
                </SplitLine>

                {/* Accent */}
                <SplitLine delay={0.48} loaded={loaded}>
                  <span
                    className="block font-extrabold text-accent"
                    style={{
                      fontSize: "clamp(3rem, 5.8vw, 5.8rem)",
                    }}
                  >
                    To Perform.
                  </span>
                </SplitLine>
              </h1>

              {/* Descriptor */}
              <motion.p
                className="font-body font-light text-cream/68 leading-[1.7] mb-7"
                style={{
                  fontSize: "clamp(0.875rem, 1vw, 1rem)",
                  lineHeight: 1.8,
                  textShadow: "0 1px 12px rgba(0,0,0,0.4)",
                  maxWidth: "34ch",
                }}
                initial={{ opacity: 0, y: 12 }}
                animate={loaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.9, delay: 0.72, ease: EASE_LUXURY }}
              >
                From concept to curtain call — XLIVE produces landmark events
                that define moments across the Middle East and beyond.
              </motion.p>

              {/* CTAs */}
              <motion.div
                className="flex flex-wrap items-center gap-3"
                initial={{ opacity: 0, y: 12 }}
                animate={loaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.9, delay: 0.86, ease: EASE_LUXURY }}
              >
                <HeroCTA
                  primary
                  onClick={() =>
                    document
                      .querySelector("#projects")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Our Work
                </HeroCTA>
                <HeroCTA
                  onClick={() =>
                    document
                      .querySelector("#about")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  About XLIVE
                </HeroCTA>
              </motion.div>
            </div>
            {/* end panel */}
          </div>

        
        </div>
        {/* end inner */}
      </motion.div>

      {/* Right-edge architectural detail — desktop only */}
      <motion.div
        className="absolute right-5 md:right-8 top-1/2 -translate-y-1/2 z-10
                   hidden lg:flex flex-col items-center gap-2.5 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 1.25, ease: EASE_LUXURY }}
      >
        <div className="w-px h-14 bg-gradient-to-b from-transparent to-cream/12" />
        <span
          className="text-[8px] tracking-[0.32em] uppercase text-cream/18 font-body"
          style={{ writingMode: "vertical-rl" }}
        >
          XLIVE Production
        </span>
        <div className="w-px h-14 bg-gradient-to-t from-transparent to-cream/12" />
      </motion.div>
    </section>
  );
}
