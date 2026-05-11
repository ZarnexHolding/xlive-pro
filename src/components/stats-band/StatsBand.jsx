import { stats } from '../../data/stats';

export default function StatsBand() {
  return (
    <div className="stats-band">
      {stats.map((s, i) => (
        <div key={s.label} className={`stat-item sr d${i + 1}`}>
          <div className="stat-num">{s.num}<em>{s.suffix}</em></div>
          <div className="stat-lbl">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
