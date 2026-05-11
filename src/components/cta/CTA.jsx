import { arialRaceView } from '../../assets';

export default function CTA() {
  return (
    <section id="CTA">
      <div className="cta-bg" style={{ backgroundImage: `url(${arialRaceView})` }} />
      <div className="cta-overlay" />
      <div className="cta-content sr">
        <div className="cta-eyebrow">Ready to race?</div>
        <h2 className="cta-title">
          <span className="ghost">START YOUR</span>
          <em>ENGINE</em>
        </h2>
        <p className="cta-sub">
          Join the Zarnex universe. Whether you're building the next world-class event, racing series, or facility — we're
          at the starting line.
        </p>
        <div className="cta-buttons">
          <a href="mailto:hello@zarnex.com" className="btn-race">Contact Us ›</a>
          <a href="#SERVICES" className="btn-outline">Our Services</a>
        </div>
        <div className="cta-locations">
          <div className="cta-location-item">
            <div className="cta-location-label">HQ</div>
            <div className="cta-location-city">Riyadh, Saudi Arabia</div>
          </div>
          <div className="cta-divider" />
          <div className="cta-location-item">
            <div className="cta-location-label">OPS</div>
            <div className="cta-location-city">Jeddah, Saudi Arabia</div>
          </div>
          <div className="cta-divider" />
          <div className="cta-location-item">
            <div className="cta-location-label">INTL</div>
            <div className="cta-location-city">Dubai, UAE</div>
          </div>
        </div>
      </div>
    </section>
  );
}
