const ITEMS = [
  'ZARNEX RACING', 'FORMULA E', 'XLIVE PRODUCTION',
  'IGNITE THE RACE', 'RIYADH · JEDDAH · DUBAI', 'SEASON 2025',
];

export default function Marquee() {
  return (
    <div className="marquee-strip" aria-hidden="true">
      <div className="marquee-inner">
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span key={i}>
            {item}<span className="dot" style={{ padding: '0 0.5rem' }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
