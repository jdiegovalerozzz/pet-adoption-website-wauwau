import React, { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/**
 * Datos de ejemplo. Reemplaza/obtén desde API cuando lo tengas.
 * Usa una única imagen placeholder por el momento.
 */
const PETS = [
  { id: 1, name: "Max", desc: "Juguetón y amigable, le encanta correr y jugar.", species: "Perro", size: "Grande", age: "Adulto", sex: "Macho" },
  { id: 2, name: "Luna", desc: "Una gatita tranquila y cariñosa.", species: "Gato", size: "Pequeño", age: "Cachorro", sex: "Hembra" },
  { id: 3, name: "Rocky", desc: "Leal y protector. Ideal para familias activas.", species: "Perro", size: "Mediano", age: "Adulto", sex: "Macho" },
  { id: 4, name: "Bella", desc: "Dulce y gentil, buena con niños.", species: "Perro", size: "Pequeño", age: "Adulto", sex: "Hembra" },
  { id: 5, name: "Charlie", desc: "Curioso y lleno de energía.", species: "Perro", size: "Mediano", age: "Cachorro", sex: "Macho" },
  { id: 6, name: "Lucy", desc: "Elegante y serena, le gusta observar desde la ventana.", species: "Gato", size: "Pequeño", age: "Adulto", sex: "Hembra" },
  { id: 7, name: "Cooper", desc: "Un perro grande con corazón aún más grande.", species: "Perro", size: "Grande", age: "Adulto", sex: "Macho" },
  { id: 8, name: "Daisy", desc: "Pequeña en tamaño pero grande en personalidad.", species: "Perro", size: "Pequeño", age: "Cachorro", sex: "Hembra" },
  { id: 9, name: "Milo", desc: "Un gato aventurero que explora la casa.", species: "Gato", size: "Pequeño", age: "Adulto", sex: "Macho" },
    { id: 10, name: "Sadie", desc: "Cariñosa y siempre lista para un abrazo.", species: "Perro", size: "Mediano", age: "Adulto", sex: "Hembra" },
    { id: 11, name: "Oliver", desc: "Un gato juguetón que adora las cajas.", species: "Gato", size: "Pequeño", age: "Cachorro", sex: "Macho" },
    { id: 12, name: "Toby", desc: "Le encanta nadar y jugar al aire libre.", species: "Perro", size: "Grande", age: "Adulto", sex: "Macho" },
    { id: 13, name: "Chloe", desc: "Una gata elegante con un maullido suave.", species: "Gato", size: "Pequeño", age: "Adulto", sex: "Hembra" },
    { id: 14, name: "Jack", desc: "Un perro enérgico que necesita mucho ejercicio.", species: "Perro", size: "Mediano", age: "Cachorro", sex: "Macho" },
    { id: 15, name: "Lily", desc: "Dulce y tranquila, perfecta para un hogar relajado.", species: "Gato", size: "Pequeño", age: "Adulto", sex: "Hembra" },
    { id: 16, name: "Zeus", desc: "Fuerte y valiente, un gran compañero de aventuras.", species: "Perro", size: "Grande", age: "Adulto", sex: "Macho" },
    { id: 17, name: "Nala", desc: "Una gata juguetona que adora perseguir luces.", species: "Gato", size: "Pequeño", age: "Cachorro", sex: "Hembra" },  
    { id: 18, name: "Buster", desc: "Un perro amigable que se lleva bien con todos.", species: "Perro", size: "Mediano", age: "Adulto", sex: "Macho" },
  // puedes añadir más aquí...
];

const PAGE_SIZE = 9;

export default function Adoption() {
  const [species, setSpecies] = useState("Todos");
  const [size, setSize] = useState("Todos");
  const [age, setAge] = useState("Todos");
  const [sex, setSex] = useState("Todos");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  // Opciones dinámicas (puedes ampliarlas o traer desde API)
  const speciesOptions = ["Todos", "Perro", "Gato"];
  const sizeOptions = ["Todos", "Pequeño", "Mediano", "Grande"];
  const ageOptions = ["Todos", "Cachorro", "Adulto", "Senior"];
  const sexOptions = ["Todos", "Macho", "Hembra"];

  // Filtrado
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
              Explora nuestra galería de mascotas adorables que esperan un hogar amoroso. Usa los filtros para encontrar la pareja perfecta para ti y tu familia.
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
                <article key={p.id} className="pet-card" aria-labelledby={`pet-${p.id}-name`}>
                  <div className="pet-image-wrap">
                    <img src="/assets/placeholder-pet.jpg" alt={`${p.name} placeholder`} className="pet-image" />
                  </div>
                  <div className="pet-info">
                    <h4 id={`pet-${p.id}-name`}>{p.name}</h4>
                    <p className="pet-desc">{p.desc}</p>
                  </div>
                </article>
              ))
            )}
          </div>

          <div className="pagination">
            <button className="page-btn" onClick={() => goToPage(page - 1)} aria-label="Página anterior" disabled={page === 1}>‹</button>
            <span className="page-indicator">{page} / {totalPages}</span>
            <button className="page-btn" onClick={() => goToPage(page + 1)} aria-label="Página siguiente" disabled={page === totalPages}>›</button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
