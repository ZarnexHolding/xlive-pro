import { galleryItems } from '../../data/galleryItems';

export default function Gallery() {
  return (
    <section id="GALLERY">
      <div className="gallery-header sr">
        <div>
          <div className="sec-eyebrow">Media / Gallery</div>
          <h2 className="gallery-title">INSIDE THE<br /><em>UNIVERSE</em></h2>
        </div>
        <a href="#" className="btn-outline" style={{ fontSize: '.8rem' }}>View All ›</a>
      </div>
      <div className="gallery-bento">
        {galleryItems.map((item, i) => (
          <div key={item.id} className={`gb-item sr d${(i % 3) + 1}`}>
            <div className="gb-line" />
            <img src={item.img} alt={item.alt} />
            <div className="gb-overlay" />
            <div className="gb-info">
              <div className="gb-cat">{item.cat}</div>
              <div className="gb-name">{item.name}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
