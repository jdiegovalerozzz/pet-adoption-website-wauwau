import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { PETS } from "../data/pets"; // Importamos los datos locales

import "../styles/base.css";
import "../styles/navbar.css";
import "../styles/petDetail.css";
import "../styles/footer.css";


export default function PetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pet = PETS.find((p) => p.id === Number(id));

  if (!pet) {
    return (
      <div className="site-root">
        <Navbar />
        <main className="container" style={{ padding: "4rem 0", textAlign: "center" }}>
          <h2>Mascota no encontrada</h2>
          <Link to="/adopt" className="cta-btn" style={{ marginTop: "1.5rem", display: "inline-block" }}>
            Volver a adopciones
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="site-root pet-detail-page">
      <Navbar />
      <main className="container pet-detail">
        <nav className="breadcrumb" aria-label="breadcrumb">
          <Link to="/">Inicio</Link> / <Link to="/adopt">Adopción</Link> / <span>{pet.name}</span>
        </nav>

        <section className="pet-detail-grid">
          <div className="pet-detail-image">
            <img
              src="/assets/placeholder-pet.jpg"
              alt={pet.name}
              className="pet-detail-photo"
            />
          </div>

          <div className="pet-detail-info">
            <h1>{pet.name}</h1>

            <div className="pet-attrs">
              <div><strong>Raza:</strong> {pet.breed || "Desconocida"}</div>
              <div><strong>Edad:</strong> {pet.age}</div>
              <div><strong>Género:</strong> {pet.sex}</div>
              <div><strong>Tamaño:</strong> {pet.size}</div>
            </div>

            <div className="pet-about">
              <h3>Acerca de {pet.name}</h3>
              <p>
                {pet.desc ||
                  "Esta adorable mascota está buscando un hogar lleno de amor. Dale la oportunidad de formar parte de tu familia."}
              </p>
            </div>

            <div className="pet-actions">
              <button
                className="cta-btn"
                onClick={() => navigate(`/adopt/form/${pet.id}`)}
              >
                Adoptar
              </button>
              <button className="outline-btn">Contactar</button>
            </div>

          </div>
        </section>
      </main>

      <Footer extended />
    </div>
  );
}
