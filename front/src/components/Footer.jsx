import React from "react";
import facebook from "/assets/facebook.svg";
import twitter from "/assets/twitter.svg";
import instagram from "/assets/instagram.svg";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner container">
        <div className="footer-socials">
          <a href="#" aria-label="Facebook" className="footer-icon">
            <img src={facebook} alt="Facebook" width="22" height="22" />
          </a>
          <a href="#" aria-label="Twitter" className="footer-icon">
            <img src={twitter} alt="Twitter" width="22" height="22" />
          </a>
          <a href="#" aria-label="Instagram" className="footer-icon">
            <img src={instagram} alt="Instagram" width="22" height="22" />
          </a>
        </div>

        <p>© 2025 Wauwau. Todos los derechos reservados.</p>
        <p>Av. Circunvalación 2. CC Zapara.</p>
      </div>
    </footer>
  );
}
