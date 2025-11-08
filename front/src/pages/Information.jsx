import React, {useEffect} from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "../styles/base.css";
import "../styles/navbar.css";
import "../styles/information.css";
import "../styles/footer.css";

export default function Information() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const section = document.querySelector(location.hash);
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth" });
        }, 200); // pequeño delay para esperar el render
      }
    }
  }, [location]);
  
  return (
    <div className="site-root information-page">
      <Navbar />
      <main>
        {/* ---------- ABOUT US SECTION ---------- */}
        <section className="about section" aria-label="About Wauwau">
          <div className="container about-grid">
            <div className="about-text">
              <h1 className="section-title">Sobre nosotros</h1>
              <p>
                En <strong>Wauwau</strong>, creemos que cada animal merece un
                hogar seguro y un compañero amoroso. Nuestra misión es conectar a los
                mascotas necesitadas con familias listas para darles una segunda
                oportunidad.
              </p>
              <p>
                Fundada con compasión y dedicación, hemos ayudado a innumerables
                animales a encontrar hogares amorosos mientras educamos a la
                comunidad sobre el cuidado responsable de las mascotas. Nuestro
                compromiso se extiende más allá de la adopción: también brindamos
                orientación, consejos de cuidado y apoyo para el bienestar a lo
                largo de la vida.
              </p>
            </div>
            <div className="about-image">
              <img
                src="/assets/about-placeholder.jpg"
                alt="Wauwau shelter and team"
                className="about-photo"
              />
            </div>
          </div>
        </section>

        {/* ---------- CARE RESOURCES SECTION ---------- */}
        <section id="care-section" className="care-info section" aria-label="Pet Care Resources">
          <div className="container">
            <h2 className="section-title">Recursos para el cuidado de mascotas</h2>
            <p className="section-subtitle">
              Aprende cómo mantener a tus amigos peludos saludables, felices y amados.
            </p>

            <div className="video-grid">
              <div className="video-card">
                <div className="video-frame">
                  <iframe
                    src="https://www.youtube.com/embed/LZ9AKsUCcTI"
                    title="Guia completa de cuidado de cachorros"
                    allowFullScreen
                  ></iframe>
                </div>
                <h3>Guia completa de cuidado de cachorros</h3>
                <p>Consejos esenciales para mantener a tu perro saludable y bien entrenado.</p>
              </div>

              <div className="video-card">
                <div className="video-frame">
                  <iframe
                    src="https://www.youtube.com/embed/jrxmi_ehJDw"
                    title="Guía Completa de la Educación de un Gato"
                    allowFullScreen
                  ></iframe>
                </div>
                <h3>Guía Completa de la Educación de un Gato</h3>
                <p>Aprende a mantener a tus amigos felinos felices y seguros en casa.</p>
              </div>

              <div className="video-card">
                <div className="video-frame">
                  <iframe
                    src="https://www.youtube.com/embed/W7ptZu9pdh8"
                    title="Las MEJORES FRUTAS para PERROS"
                    allowFullScreen
                  ></iframe>
                </div>
                <h3>Las MEJORES FRUTAS para PERROS</h3>
                <p>Entiende las dietas balanceadas y las opciones de alimentos saludables para las mascotas.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
