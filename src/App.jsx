import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Outlet, useLocation } from 'react-router-dom'
import { useLenis, getLenis } from './hooks/useLenis'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'

// Route-level code splitting — each secondary page is its own chunk.
const Work = lazy(() => import('./pages/Work'))
const CaseStudy = lazy(() => import('./pages/CaseStudy'))
const Partners = lazy(() => import('./pages/Partners'))
const About = lazy(() => import('./pages/About'))
const StyleGuide = lazy(() => import('./pages/StyleGuide'))

const Fallback = () => <div className="min-h-screen bg-ink-900" />

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function SiteLayout() {
  useLenis()
  return (
    <div className="min-h-screen bg-ink-900 text-fg antialiased">
      <ScrollToTop />
      <Navbar />
      <main>
        <Suspense fallback={<Fallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<Work />} />
        <Route path="/work/:slug" element={<CaseStudy />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/about" element={<About />} />
      </Route>
      <Route path="/styleguide" element={<Suspense fallback={<Fallback />}><StyleGuide /></Suspense>} />
    </Routes>
  )
}
