export default function FeatureImage({ img, eyebrow, title, text, overlayStyle, children }) {
  return (
    <div className="img-feature sr">
      <img src={img} alt={eyebrow || ''} />
      <div className="img-feature-overlay" style={overlayStyle} />
      <div className="img-feature-content">
        {eyebrow && <div className="sec-eyebrow" style={{ marginBottom: '1rem' }}>{eyebrow}</div>}
        <h2 dangerouslySetInnerHTML={{ __html: title }} />
        {text && <p>{text}</p>}
        {children}
      </div>
      <div className="hud-tl" />
      <div className="hud-br" />
    </div>
  );
}
