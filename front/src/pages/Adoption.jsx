import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { PETS } from "../data/pets";

const PAGE_SIZE = 9;

export default function Adoption() {
  const navigate = useNavigate();
  const [species, setSpecies] = useState("Todos");
  const [size, setSize] = useState("Todos");
  const [age, setAge] = useState("Todos");
  const [sex, setSex] = useState("Todos");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const speciesOptions = ["Todos", "Perro", "Gato"];
  const sizeOptions = ["Todos", "Pequeño", "Mediano", "Grande"];
  const ageOptions = ["Todos", "Cachorro", "Adulto", "Senior"];
  const sexOptions = ["Todos", "Macho", "Hembra"];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PETS.filter((p) => {
      if (species !== "Todos" && p.species !== species) return false;
      if (size !== "Todos" && p.size !== size) return false;
      if (age !== "Todos" && p.age !== age) return false;
      if (sex !== "Todos" && p.sex !== sex) return false;
      if (q && !p.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [species, size, age, sex, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function goToPage(n) {
    if (n < 1 || n > totalPages) return;
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="site-root adoption-page">
      <Navbar />
      <main>
        <header className="adoption-hero">
          <div className="container">
            <h1>Encuentra a tu nuevo mejor amigo</h1>
            <p className="adoption-sub">
              Explora nuestra galería de mascotas adorables que esperan un hogar amoroso. 
              Usa los filtros para encontrar la pareja perfecta para ti y tu familia.
            </p>

            <div className="filters-card" role="search" aria-label="Filtros de adopción">
              <div className="filters-row">
                <label>
                  <span>Especie</span>
                  <select value={species} onChange={(e) => { setSpecies(e.target.value); setPage(1); }}>
                    {speciesOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </label>

                <label>
                  <span>Tamaño</span>
                  <select value={size} onChange={(e) => { setSize(e.target.value); setPage(1); }}>
                    {sizeOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </label>

                <label>
                  <span>Edad</span>
                  <select value={age} onChange={(e) => { setAge(e.target.value); setPage(1); }}>
                    {ageOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </label>

                <label>
                  <span>Sexo</span>
                  <select value={sex} onChange={(e) => { setSex(e.target.value); setPage(1); }}>
                    {sexOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </label>

                <label className="search-input">
                  <input
                    type="search"
                    placeholder="Buscar por nombre..."
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                    aria-label="Buscar mascotas por nombre"
                  />
                </label>
              </div>
            </div>
          </div>
        </header>

        <section className="container pets-section">
          <h3 className="section-heading">Mascotas disponibles</h3>

          <div className="pet-grid">
            {current.length === 0 ? (
              <p className="no-results">No se encontraron mascotas con esos filtros.</p>
            ) : (
              current.map((p) => (
                <article
                  key={p.id}
                  className="pet-card"
                  onClick={() => navigate(`/pet/${p.id}`)}
                  style={{ cursor: "pointer" }}
                  aria-label={`Ver detalles de ${p.name}`}
                >
                  <div className="pet-image-wrap">
                    <img
                      src="/assets/placeholder-pet.jpg"
                      alt={p.name}
                      className="pet-image"
                    />
                  </div>
                  <div className="pet-info">
                    <h4>{p.name}</h4>
                    <p className="pet-desc">{p.desc}</p>
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
