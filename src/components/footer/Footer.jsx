import {xliveLogo} from "../../assets";

export default function Footer() {
  return (
    <footer>
      <div className="ft-brand">
        <img src={xliveLogo} alt="XLIVE — ZARNEX" />
        <p className="ft-tagline">Live production, motorsport, facility management &amp; a universe of 10 entities built for the Gulf.</p>
      </div>
      <div className="ft-col">
        <h5>Navigate</h5>
        <ul>
          <li><a href="#RACE">Racing</a></li>
          <li><a href="#SERVICES">Services</a></li>
          <li><a href="#GALLERY">Gallery</a></li>
          <li><a href="#PRODUCTION">Production</a></li>
          <li><a href="#CTA">Contact</a></li>
        </ul>
      </div>
      <div className="ft-col">
        <h5>Entities</h5>
        <ul>
          <li><a href="#">xlive Production</a></li>
          <li><a href="#">IFMC</a></li>
          <li><a href="#">GreenScape KSA</a></li>
          <li><a href="#">ZarnexPro</a></li>
          <li><a href="#">Zarnex Global</a></li>
        </ul>
      </div>
      <div className="ft-col">
        <h5>Territories</h5>
        <ul>
          <li><a href="#">Riyadh, KSA</a></li>
          <li><a href="#">Jeddah, KSA</a></li>
          <li><a href="#">Dubai, UAE</a></li>
        </ul>
        <h5 style={{ marginTop: '1.5rem' }}>Legal</h5>
        <ul>
          <li><a href="#">Privacy</a></li>
          <li><a href="#">Terms</a></li>
        </ul>
      </div>
      <div className="ft-bottom">
        <div className="ft-copy">© 2025 Zarnex Group · All rights reserved · KSA · UAE</div>
        <div className="ft-socials">
          <a href="#">LinkedIn</a>
          <a href="#">Instagram</a>
          <a href="#">Twitter/X</a>
        </div>
      </div>
    </footer>
  );
}
