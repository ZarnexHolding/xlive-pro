import { raceCards } from '../../data/raceCards';
import { heroBg } from '../../assets';

export default function RaceGrid() {
  return (
    <section id="RACE">
      <div className="race-header sr">
        <div>
          <div className="sec-eyebrow">On The Grid</div>
          <h2 className="race-title">RACE<br /><em>DAY</em><br />UNIVERSE</h2>
        </div>
        <p className="race-sub sr-r">
          Three machines. One track. The future of racing fuelled by Zarnex production excellence.
        </p>
      </div>

      <div className="race-grid">
        <div className="race-card sr d1">
          <div className="race-card-line" />
          <img src={heroBg} alt="Ultra Futuristic Race Car" loading="lazy" />
          <div className="race-card-overlay" />
          <div className="race-card-info">
            <div className="race-card-cat">Feature · Formula Future</div>
            <div className="race-card-name">ULTRA HYPERCAR — SPEED UNLIMITED</div>
          </div>
          <div className="hud-tl" />
          <div className="hud-br" />
        </div>
        {raceCards.map((card, i) => (
          <div key={card.id} className={`race-card sr ${['d2','d3','d2','d3'][i]}`}>
            <div className="race-card-line" />
            <img src={card.img} alt={card.alt} loading="lazy" />
            <div className="race-card-overlay" />
            <div className="race-card-info">
              <div className="race-card-cat">{card.cat}</div>
              <div className="race-card-name">{card.name}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
