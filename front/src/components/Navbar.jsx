import React, { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`} role="banner">
      <div className="nav-inner">
        <div className="nav-left">

          <a href="/" className="logo-link" aria-label="Inicio - Wau Wau">
            <img src="/assets/logo-wauwau.jpg" alt="Wau Wau" className="logo-img" />
            <span className="logo-title">wauwau</span>
          </a>
        </div>

        <nav className="nav-right" role="navigation" aria-label="Main navigation">
          <a href="/">Inicio</a>
          <a href="/adopt">Adoptar</a>
          <a href="/items">Cuidados</a>
          <a href="/info">Información</a>
        </nav>
      </div>
    </header>
  );
}
