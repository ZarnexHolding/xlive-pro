import { Zap, Car, Building2, TreePine, Package, Handshake } from 'lucide-react';
import { services } from '../../data/services';

const ICON_MAP = { Zap, Car, Building2, TreePine, Package, Handshake };

export default function Services() {
  return (
    <section id="SERVICES">
      <div className="srv-header sr">
        <div className="sec-eyebrow">What We Build</div>
        <h2 className="srv-title">OUR <em>UNIVERSE</em><br />OF SERVICES</h2>
      </div>
      <div className="srv-grid">
        {services.map((s, i) => {
          const Icon = ICON_MAP[s.icon];
          return (
            <div key={s.id} className={`glass-card sr d${(i % 3) + 1}`}>
              <div className="glass-card-num">{s.num}</div>
              <div className="glass-icon">
                {Icon ? <Icon size={20} strokeWidth={1.5} style={{ color: 'var(--blue)' }} /> : null}
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
