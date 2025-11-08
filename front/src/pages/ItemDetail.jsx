import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ITEMS } from "../data/items";

import "../styles/base.css";
import "../styles/navbar.css";
import "../styles/footer.css";
import "../styles/items.css";

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = ITEMS.find((i) => i.id === Number(id));

  if (!item) {
    return (
      <div className="site-root">
        <Navbar />
        <main className="container" style={{ padding: "4rem 0", textAlign: "center" }}>
          <h2>Item no encontrado</h2>
          <Link to="/items" className="cta-btn" style={{ marginTop: "1.5rem", display: "inline-block" }}>
            Volver al catálogo
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="site-root item-detail-page">
      <Navbar />
      <main className="container item-detail">
        <nav className="breadcrumb" aria-label="breadcrumb">
          <Link to="/">Inicio</Link> / <Link to="/items">Cuidados</Link> / <span>{item.name}</span>
        </nav>

        <section className="item-detail-grid">
          <div className="item-detail-image">
            <img
              src={item.image}
              alt={item.name}
              className="item-detail-photo"
            />
          </div>

          <div className="item-detail-info">
            <h1>{item.name}</h1>

            <div className="item-attrs">
              <div><strong>Tipo:</strong> {item.type}</div>
              <div><strong>Precio:</strong> {item.price}</div>
            </div>

            <div className="item-about">
              <h3>Acerca de</h3>
              <p>{item.desc}</p>
            </div>

            <div className="item-actions">
              <button className="cta-btn" 
                onClick={() => navigate(`/form/item/${item.id}`, { state: { item } })}>Comprar</button>
              <button
                className="outline-btn"
                onClick={() => navigate(-1)}
              >
                Regresar
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
