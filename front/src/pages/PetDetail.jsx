/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api";

import "../styles/base.css";
import "../styles/navbar.css";
import "../styles/petDetail.css";
import "../styles/footer.css";

export default function PetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [petReal, setPetReal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const p = await api.fetchPetById(id);
        const mapped = {
          id: p.id_mascota ?? p.id,
          name: p.nombre ?? p.name,
          desc: p.descripcion ?? p.desc,
          breed: p.raza ?? p.breed,
          age: p.edad,
          sex: p.genero ?? p.sex,
          size: p.tamano ?? p.size ?? "Mediano",
          fotos: p.fotos ?? (p.foto_url ? [{ url: p.foto_url }] : []),
        };
        if (mounted) setPetReal(mapped);
      } catch (e) {
        console.warn("pet fetch error", e);
        if (mounted) setErr(e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
  }, [id]);

  // Use only the data from the backend
  const pet = petReal;

  if (!pet && loading) {
    return (
      <div className="site-root">
        {" "}
        <Navbar />
        <main
          className="container"
          style={{ padding: "4rem 0", textAlign: "center" }}
        >
          {" "}
          <p>Cargando mascota…</p>{" "}
        </main>{" "}
        <Footer />{" "}
      </div>
    );
  }

  if (!pet && err) {
    return (
      <div className="site-root">
        {" "}
        <Navbar />
        <main
          className="container"
          style={{ padding: "4rem 0", textAlign: "center" }}
        >
          {" "}
          <h2>Mascota no encontrada</h2> <p>Error: {err.message || "error"}</p>
          <Link
            to="/adopt"
            className="cta-btn"
            style={{ marginTop: "1.5rem", display: "inline-block" }}
          >
            Volver a adopciones{" "}
          </Link>{" "}
        </main>{" "}
        <Footer />{" "}
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="site-root">
        {" "}
        <Navbar />
        <main
          className="container"
          style={{ padding: "4rem 0", textAlign: "center" }}
        >
          {" "}
          <h2>Mascota no encontrada</h2>
          <Link
            to="/adopt"
            className="cta-btn"
            style={{ marginTop: "1.5rem", display: "inline-block" }}
          >
            Volver a adopciones{" "}
          </Link>{" "}
        </main>{" "}
        <Footer />{" "}
      </div>
    );
  }

  return (
    <div className="site-root pet-detail-page">
      {" "}
      <Navbar />{" "}
      <main className="container pet-detail">
        {" "}
        <nav className="breadcrumb" aria-label="breadcrumb">
          {" "}
          <Link to="/">Inicio</Link> / <Link to="/adopt">Adopción</Link> /{" "}
          <span>{pet.name}</span>{" "}
        </nav>
        <section className="pet-detail-grid">
          <div className="pet-detail-image">
            <img
              src={
                pet.fotos && pet.fotos[0] && pet.fotos[0].url
                  ? pet.fotos[0].url
                  : "/assets/placeholder-pet.jpg"
              }
              alt={pet.name}
              className="pet-detail-photo"
            />
          </div>

          <div className="pet-detail-info">
            <h1>{pet.name}</h1>

            <div className="pet-attrs">
              <div>
                <strong>Raza:</strong> {pet.breed || "Desconocida"}
              </div>
              <div>
                <strong>Edad:</strong> {pet.age}
              </div>
              <div>
                <strong>Género:</strong> {pet.sex}
              </div>
              <div>
                <strong>Tamaño:</strong> {pet.size}
              </div>
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
                onClick={() =>
                  navigate(`/adopt/form/${pet.id}`, {
                    state: { petId: pet.id },
                  })
                }
              >
                Adoptar
              </button>
              {/* <button className="outline-btn">Contactar</button> */}
            </div>
          </div>
        </section>
      </main>
      <Footer extended />
    </div>
  );
}
