/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#080808',
        'bg-secondary': '#0E0E0E',
        'bg-card': '#111111',
        cream: '#EDE8DF',
        'cream-muted': '#9A9590',
        accent: '#E84530',
        'accent-warm': '#C8A97A',
        border: 'rgba(237,232,223,0.08)',
        'border-subtle': 'rgba(237,232,223,0.05)',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.2em',
        'ultra-wide': '0.3em',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'snap': 'cubic-bezier(0.87, 0, 0.13, 1)',
      },
    },
  },
  plugins: [],
}
