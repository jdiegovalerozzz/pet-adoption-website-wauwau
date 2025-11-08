import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ITEMS } from "../data/items";

import "../styles/base.css";
import "../styles/navbar.css";
import "../styles/footer.css";
import "../styles/items.css";

const PAGE_SIZE = 9;

export default function Items() {
  const navigate = useNavigate();
  const [type, setType] = useState("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const typeOptions = ["All", "Product", "Service"];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ITEMS.filter((i) => {
      if (type !== "All" && i.type !== type) return false;
      if (q && !i.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [type, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function goToPage(n) {
    if (n < 1 || n > totalPages) return;
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="site-root items-page">
      <Navbar />
      <main>
        <header className="items-hero">
          <div className="container">
            <h1>Servicios y Productos de Cuidado para Mascotas</h1>
            <p className="items-sub">
              Explore nuestro catálogo de servicios y productos de alta calidad para el cuidado de mascotas.
              Use los filtros a continuación para encontrar exactamente lo que su mascota necesita.
            </p>

            <div className="filters-card" role="search" aria-label="Filter items">
              <div className="filters-row">
                <label>
                  <span>Tipo</span>
                  <select
                    value={type}
                    onChange={(e) => {
                      setType(e.target.value);
                      setPage(1);
                    }}
                  >
                    {typeOptions.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="search-input">
                  <input
                    type="search"
                    placeholder="Buscar por nombre..."
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setPage(1);
                    }}
                    aria-label="Buscar items por nombre"
                  />
                </label>
              </div>
            </div>
          </div>
        </header>

        <section className="container items-section">
          <h3 className="section-heading">Ofertas Disponibles</h3>

          <div className="item-grid">
            {current.length === 0 ? (
              <p className="no-results">No hay elementos que coincidan con su búsqueda.</p>
            ) : (
              current.map((item) => (
                <article
                  key={item.id}
                  className="item-card"
                  onClick={() => navigate(`/items/${item.id}`)}
                  style={{ cursor: "pointer" }}
                  aria-label={`View details of ${item.name}`}
                >
                  <div className="item-image-wrap">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="item-image"
                    />
                  </div>
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p className="item-desc">{item.shortDesc}</p>
                    <p className="item-price">{item.price}</p>
                    <button className="outline-btn">View Details</button>
                  </div>
                </article>
              ))
            )}
          </div>

          <div className="pagination">
            <button className="page-btn" onClick={() => goToPage(page - 1)} disabled={page === 1}>‹</button>
            <span className="page-indicator">{page} / {totalPages}</span>
            <button className="page-btn" onClick={() => goToPage(page + 1)} disabled={page === totalPages}>›</button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
