import { useEffect } from 'react';
import { xliveLogo } from '../../assets';

export default function Loader({ progress, onEnter }) {
  const pct = Math.floor(progress);
  const done = pct >= 100;
  const circumference = 339;
  const offset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div id="LOADER">
      <div className="ld-grid-bg" />

      <div className="ld-logo" style={{ opacity: 0, animation: 'fadeUp .8s .3s forwards' }}>
        <div className="xlive-logo-wrap">
          <img src={xliveLogo} alt="XLIVE Production" className="xlive-logo" />
        </div>
      </div>

      <div className="ld-loading-ring" style={{ opacity: 0, animation: 'fadeUp .8s .6s forwards' }}>
        <svg viewBox="0 0 120 120">
          <defs>
            <linearGradient id="rg" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#00C8FF" />
              <stop offset="100%" stopColor="#FF1744" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(0,200,255,.08)" strokeWidth="2" />
          <circle cx="60" cy="60" r="54" fill="none" stroke="url(#rg)" strokeWidth="2"
            strokeLinecap="round"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
              transform: 'rotate(-90deg)',
              transformOrigin: 'center',
              transformBox: 'fill-box',
              transition: 'stroke-dashoffset 0.12s ease-out',
            }}
          />
          <text x="60" y="56" textAnchor="middle" fill="rgba(0,200,255,.5)"
            fontFamily="Space Mono" fontSize="8" letterSpacing="2">LOADING</text>
          <text x="60" y="72" textAnchor="middle" fill="white"
            fontFamily="Barlow Condensed" fontSize="18" fontWeight="900"
            fontStyle="italic">{pct}%</text>
        </svg>
      </div>

      <div className="ld-console" style={{ opacity: 0, animation: 'fadeUp .8s .5s forwards' }}>
        <span className="ld-console-line">
          <span className="p">›</span>boot XLIVE v5.0.1 — motorsport division
        </span>
        <span className="ld-console-line" style={{ opacity: progress > 20 ? 1 : 0.25 }}>
          <span className="p">›</span>scanning race assets… <span className="ok">xlive PRODUCTION OK</span>
        </span>
        <span className="ld-console-line" style={{ opacity: progress > 50 ? 1 : 0.25 }}>
          <span className="p">›</span>loading universe nodes… <span className="ok">[10 ENTITIES]</span>
        </span>
        <span className="ld-console-line" style={{ opacity: progress > 75 ? 1 : 0.25 }}>
          <span className="p">›</span>network: RIYADH · JEDDAH · DUBAI
        </span>
        <span className="ld-console-line" style={{ opacity: progress > 90 ? 1 : 0.25 }}>
          <span className="p">›</span><span className="active">IGNITE THE RACE ▶</span>
        </span>
      </div>

      <div className="ld-bar-wrap" style={{ opacity: 0, animation: 'fadeUp .8s .8s forwards' }}>
        <div className="ld-bar-top">
          <span>SYSTEM BOOT</span>
          <span>{pct}%</span>
        </div>
        <div className="ld-bar-track">
          <div className="ld-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <button className={`ld-enter${done ? ' visible' : ''}`} onClick={onEnter}>
        ENTER UNIVERSE ›
      </button>
    </div>
  );
}
