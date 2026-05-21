import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { useLenis } from "./hooks/useLenis";
import useCursor from "./hooks/useCursor";
import Loader from "./components/ui/Loader";
import Navbar from "./components/layout/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Services from "./sections/Services";
import Projects from "./sections/Projects";
import Sectors from "./sections/Sectors";
import Stats from "./sections/Stats";
import Clients from "./sections/Clients";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";

const MIN_LOADER_MS = 1400;
const MAX_LOADER_MS = 3500;

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [minLoaderDone, setMinLoaderDone] = useState(false);
  const [maxLoaderDone, setMaxLoaderDone] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(true);

  useLenis();
  useCursor();

  useEffect(() => {
    const minTimer = window.setTimeout(() => {
      setMinLoaderDone(true);
    }, MIN_LOADER_MS);

    const maxTimer = window.setTimeout(() => {
      setMaxLoaderDone(true);
    }, MAX_LOADER_MS);

    return () => {
      window.clearTimeout(minTimer);
      window.clearTimeout(maxTimer);
    };
  }, []);

  useEffect(() => {
    if (loaded) return;
    if ((heroReady && minLoaderDone) || maxLoaderDone) {
      setLoaded(true);
    }
  }, [heroReady, loaded, maxLoaderDone, minLoaderDone]);

  const handleHeroReady = useCallback(() => {
    setHeroReady(true);
  }, []);

  const handleLoaderComplete = useCallback(() => {
    setLoaderVisible(false);
  }, []);

  return (
    <div className="bg-bg text-cream min-h-screen overflow-x-hidden">
      <div id="cur" />
      <div id="cur-ring" />

      {/* Loader sits above everything until complete */}
      <AnimatePresence>
        {loaderVisible && (
          <Loader ready={loaded} onComplete={handleLoaderComplete} />
        )}
      </AnimatePresence>

      {/* Site renders underneath — video preloads during loader */}
      <Navbar />
      <main>
        <Hero loaded={loaded} onHeroReady={handleHeroReady} />
        <About />
        <Stats />
        <Services />
        <Projects />
        <Sectors />
        <Clients />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
