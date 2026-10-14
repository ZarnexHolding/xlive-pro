/** @type {import('tailwindcss').Config} */

/*
 * XLIVE design tokens: brand-true system.
 * Source of truth for Tailwind. The same values are mirrored as CSS custom
 * properties in src/styles/globals.css (:root) for use outside utility classes
 * (canvas, SVG, inline gradients). Keep the two in sync.
 *
 * Brand palette (Brand Guidelines): Deep Electric Blue #2A1AAE (structural),
 * Acid Green #73F83E (single high-voltage accent, used sparingly), Vivid Green
 * #089A23 (supportive/success), Muted Olive #6E7B63. Canvas = near-black,
 * cooled slightly toward the brand blue. Neutrals are the only non-brand values
 * (unavoidable functional black/white/grey), tinted to sit under the blue.
 *
 * Type (Sept 2026 rework): display = Archivo variable (wdth 100..125, the wide
 * cut is the "circuit poster" voice), body = Hanken Grotesk, mono = JetBrains
 * Mono for technical labels, indices and metrics meta.
 */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Canvas / neutrals (cool near-black → elevated surfaces)
        ink: {
          950: '#050609', // deepest base
          900: '#080A11', // page background
          800: '#0C0E17', // alternating section
          700: '#11141F', // card / elevated
          600: '#171A28', // raised / hover
          500: '#1F2333', // strokes on dark
        },
        // Brand
        electric: {
          DEFAULT: '#2A1AAE', // Deep Electric Blue: structural
          bright: '#3A28E0',  // brighter: glows / gradients
          glow: '#5138FF',    // highlight / light-streak
          deep: '#160C6B',    // shadowed blue
        },
        acid: {
          DEFAULT: '#73F83E', // Acid Green: the "live" accent (sparingly)
          dim: '#5AD62E',
        },
        vivid: '#089A23',     // Vivid Green: supportive / success
        olive: '#6E7B63',     // Muted Olive: organic muted
        // Text
        fg: {
          DEFAULT: '#F3F5FB', // primary text (cool near-white)
          muted: '#9BA1B6',   // secondary text
          dim: '#767D95',     // labels / meta (AA on ink-900)
        },
        line: {
          DEFAULT: 'rgba(243,245,251,0.10)',
          soft: 'rgba(243,245,251,0.06)',
          strong: 'rgba(243,245,251,0.18)',
        },
      },
      fontFamily: {
        // Display = Archivo variable (loaded in index.html). Helvetica Neue is
        // the brand face and stays as the fallback chain for parity.
        display: ['Archivo', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        // Body = Hanken Grotesk (Anantason surrogate).
        body: ['"Hanken Grotesk"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        // Technical labels, indices, metrics meta.
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        // Fluid editorial scale (clamp: min, preferred vw, max)
        // display-2xl (hero headline): the floor is 2.5rem, or less on phones
        // narrower than ~404px, where (100vw - both gutters) / 9 keeps the
        // widest headline line ("to perform.", ~8.7em wide) on one line.
        'display-2xl': ['clamp(min(2.5rem, calc((100vw - 3rem) / 9)), 8vw, 8rem)', { lineHeight: '0.9', letterSpacing: '-0.035em' }],
        'display-xl': ['clamp(2.75rem, 7vw, 7rem)', { lineHeight: '0.93', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(2.25rem, 5vw, 4.75rem)', { lineHeight: '0.98', letterSpacing: '-0.025em' }],
        'heading': ['clamp(1.75rem, 3vw, 3rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'subhead': ['clamp(1.25rem, 1.6vw, 1.75rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'body-lg': ['clamp(1.0625rem, 1.1vw, 1.25rem)', { lineHeight: '1.6' }],
        'label': ['0.75rem', { lineHeight: '1', letterSpacing: '0.2em' }],
      },
      letterSpacing: {
        tightest: '-0.04em',
        widest: '0.2em',
        'ultra-wide': '0.3em',
      },
      maxWidth: {
        shell: '1440px',
        prose: '68ch',
      },
      spacing: {
        section: 'clamp(6rem, 12vw, 12rem)',
        'section-sm': 'clamp(4rem, 8vw, 7rem)',
        gutter: 'clamp(1.5rem, 4vw, 4rem)',
      },
      borderRadius: {
        xs: '2px',
        DEFAULT: '4px',
        md: '8px',
        lg: '14px',
        xl: '20px',
        '2xl': '28px',
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        snap: 'cubic-bezier(0.87, 0, 0.13, 1)',
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        400: '400ms',
        600: '600ms',
        900: '900ms',
      },
      boxShadow: {
        'glow-blue': '0 0 80px -20px rgba(58,40,224,0.55)',
        'glow-acid': '0 0 60px -18px rgba(115,248,62,0.45)',
        elev: '0 30px 80px -40px rgba(0,0,0,0.9)',
      },
      backgroundImage: {
        'grid-fade': 'linear-gradient(to bottom, transparent, rgba(58,40,224,0.05))',
        'blue-curtain': 'linear-gradient(180deg, #2A1AAE 0%, #0A0B14 60%, #050609 100%)',
      },
      keyframes: {
        'streak': {
          '0%,100%': { opacity: '0.25', transform: 'scaleY(1)' },
          '50%': { opacity: '0.7', transform: 'scaleY(1.06)' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'float-slow': {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-dot': {
          '0%,100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.35', transform: 'scale(0.7)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        streak: 'streak 6s ease-in-out infinite',
        marquee: 'marquee 40s linear infinite',
        'marquee-slow': 'marquee 70s linear infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'pulse-dot': 'pulse-dot 1.6s ease-in-out infinite',
        'fade-up': 'fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
}
