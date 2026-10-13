import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Long-lived vendor chunks: app edits do not invalidate React or GSAP
        // in the visitor's cache, and the three files download in parallel.
        // (Client build only; the SSR prerender bundle keeps deps external.)
        manualChunks: isSsrBuild
          ? undefined
          : {
              react: ['react', 'react-dom', 'react-router-dom'],
              motion: ['gsap', 'gsap/ScrollTrigger', '@gsap/react', 'lenis'],
            },
      },
    },
  },
  // Build-time prerender (scripts/prerender.mjs) bundles these into the SSR
  // entry instead of importing them from node_modules at render time.
  ssr: {
    noExternal: ['gsap', '@gsap/react', 'lenis', 'react-icons'],
  },
}))
