import { concertStage } from '../../assets';

export default function Production() {
  return (
    <section id="PRODUCTION">
      <div className="prod-img sr-l">
        <img src={concertStage} alt="Concert Stage Production" />
      </div>
      <div className="prod-content sr-r">
        <div className="prod-tag">xlive Production</div>
        <h2 className="prod-title">WE BUILD<br /><em>WORLDS</em><br />ON STAGE</h2>
        <p className="prod-body">
          From <strong>Formula E pit lanes</strong> to mega-concert stages that seat 100,000 — Zarnex's xlive division
          engineers every element of the live experience. Lighting rigs, LED screens, pyrotechnics, stage design, and full
          broadcast infrastructure.
        </p>
        <a href="#CTA" className="btn-race">Work With Us</a>
      </div>
      <div className="hud-tl" />
      <div className="hud-br" />
    </section>
  );
}
