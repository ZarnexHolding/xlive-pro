import { useEffect, useRef } from 'react';
import { heroBg } from '../../assets';

export default function Hero() {
  const bgRef = useRef(null);
  const h1Ref = useRef(null);
  const slRef = useRef(null);

  useEffect(() => {
    const container = slRef.current;
    if (!container) return;
    const lines = [];
    for (let i = 0; i < 12; i++) {
      const line = document.createElement('div');
      line.className = 'hero-speed-line';
      line.style.cssText = `top:${10 + Math.random() * 80}%;animation-duration:${2 + Math.random() * 4}s;animation-delay:${Math.random() * 3}s;opacity:${0.2 + Math.random() * 0.4}`;
      container.appendChild(line);
      lines.push(line);
    }
    return () => lines.forEach((l) => l.remove());
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (bgRef.current) bgRef.current.style.transform = `scale(1.05) translateY(${y * 0.15}px)`;
      if (h1Ref.current) {
        h1Ref.current.style.transform = `translateY(${y * 0.2}px)`;
        h1Ref.current.style.opacity = String(Math.max(0, 1 - y / 600));
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section id="HERO">
      <div ref={bgRef} className="hero-bg-img" style={{ backgroundImage: `url(${heroBg})` }} />
      <div className="hero-overlay" />
      <div className="scanlines" />
      <div ref={slRef} className="hero-speed-lines" />
      <div className="hud-tl" />
      <div className="hud-tr" />

      <div className="hero-hud">
        SYS:ONLINE<br />LAP:—<br />SPEED:∞<br />FUEL:MAX<br />NET:ZARNEX
      </div>

      <div className="hero-content">
        <div className="hero-eyebrow">Zarnex Universe · Est. 2019 · KSA</div>
        <h1 ref={h1Ref} className="hero-h1">
          <span className="line-ghost">IGNITE</span>
          THE<br />
          <span className="line-blue">RACE</span>
        </h1>

        <div className="hero-meta">
          <div className="hero-meta-stat">
            <div className="hero-meta-num">250<em>+</em></div>
            <div className="hero-meta-lbl">Events Produced</div>
          </div>
          <div className="hero-meta-div" />
          <div className="hero-meta-stat">
            <div className="hero-meta-num">10<em>×</em></div>
            <div className="hero-meta-lbl">Active Entities</div>
          </div>
          <div className="hero-meta-div" />
          <div className="hero-meta-stat">
            <div className="hero-meta-num"><em>∞</em></div>
            <div className="hero-meta-lbl">Speed Limit</div>
          </div>
        </div>

        <div className="hero-cta-row">
          <a href="#RACE" className="btn-race">Enter The Grid</a>
          <a href="#SERVICES" className="btn-outline">Our Universe</a>
        </div>
      </div>

      <div className="hero-scroll">
        <div className="hero-scroll-line" />
        <span>Scroll</span>
      </div>
    </section>
  );
}
