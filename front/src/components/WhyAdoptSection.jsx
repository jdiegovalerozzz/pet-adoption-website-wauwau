import React from "react";

export default function WhyAdoptSection() {
  return (
    <section className="why-adopt section" aria-label="Por qué adoptar">
      <div className="container why-grid">
        <div className="why-left">
          <h2 className="why-title">¿Por qué adoptar transforma vidas?</h2>
          <p className="why-sub">Tu gesto puede salvar una vida.</p>
        </div>

        <div className="why-right">
          <img
            src="/assets/whyadopt-placeholder.jpg"
            alt="Por qué adoptar"
            className="why-image"
          />
        </div>
      </div>
    </section>
  );
}
