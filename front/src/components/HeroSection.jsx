import React from "react";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="hero" aria-label="Hero">
      <div className="hero-grid">
        <div className="hero-left">
          <h1 className="hero-title">
            <span>¿Listo para</span>
            <span className="hero-break">cambiar una</span>
            <span className="hero-break">vida?</span>
          </h1>

          <p className="hero-sub">
            Da el primer paso hacia una amistad que cambiará vidas!
          </p>

          <div className="hero-cta">
            <button className="cta-btn" onClick={()=>navigate("/adopt")}>¡Adoptar ya!</button>
          </div>
        </div>

        <div className="hero-right" aria-hidden="false">
          <img
            src="/assets/hero-placeholder.jpg"
            alt="Animales felices en adopción"
            className="hero-image"
          />
        </div>
      </div>
    </section>
  );
}
