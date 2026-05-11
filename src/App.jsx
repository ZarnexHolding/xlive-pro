import { useLoader } from './hooks/useLoader';
import { useCursor } from './hooks/useCursor';
import { useScrollReveal } from './hooks/useScrollReveal';
import { useParticleCanvas } from './hooks/useParticleCanvas';

import Loader from './components/loader/Loader';
import Navbar from './components/navbar/Navbar';
import Hero from './components/hero/Hero';
import Marquee from './components/marquee/Marquee';
import RaceGrid from './components/race-grid/RaceGrid';
import StatsBand from './components/stats-band/StatsBand';
import FeatureImage from './components/feature-image/FeatureImage';
import Services from './components/services/Services';
import Gallery from './components/gallery/Gallery';
import Production from './components/production/Production';
import CTA from './components/cta/CTA';
import Footer from './components/footer/Footer';

import { electricRacing, wecRacingPoster } from './assets';

export default function App() {
  const { progress, entered, enter } = useLoader();

  useCursor();
  useScrollReveal();
  useParticleCanvas(entered);

  return (
    <>
      <div id="CUR" />
      <div id="CRING" />
      <canvas id="BGCANVAS" aria-hidden="true" />

      {!entered && <Loader progress={progress} onEnter={enter} />}

      <div style={{
        opacity: entered ? 1 : 0,
        pointerEvents: entered ? 'auto' : 'none',
        transition: 'opacity 1s ease-out',
      }}>
        <Navbar />
        <main>
          <Hero />
          <Marquee />
          <RaceGrid />
          <StatsBand />
          <FeatureImage
            img={electricRacing}
            eyebrow="Formula E · Electric Era"
            title='THE <em>ELECTRIC</em><br>FRONTIER'
            text="Where silent speed meets spectacular production. Zarnex engineers the future of motorsport entertainment."
          />
          <Services />
          <Gallery />
          <Production />
          <FeatureImage
            img={wecRacingPoster}
            eyebrow="Season · 2025"
            title='THE <em>FINALE</em><br>IS HERE'
            text="Championship season production by Zarnex. Live events, broadcast infrastructure, and fan experience at world-class scale."
            overlayStyle={{ background: 'linear-gradient(to right,rgba(4,6,14,.85) 25%,rgba(4,6,14,.2) 100%)' }}
          >
            <div style={{ marginTop: '1.5rem' }}>
              <a href="#CTA" className="btn-race" style={{ fontSize: '.85rem' }}>Book Production ›</a>
            </div>
          </FeatureImage>
          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
}
