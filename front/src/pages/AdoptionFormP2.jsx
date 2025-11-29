/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import api from "../api";

import "../styles/base.css";
import "../styles/adoptionForm.css";
import "../styles/footer.css";

const AdoptFormPage2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const formData = location.state?.formData || {};
  // petId puede venir por params (/adopt/form/:id/page2) o por state
  const petId = params.id || location.state?.petId;

  const [answers, setAnswers] = useState({
    mayorEdad: "",
    prontoAdoptar: "",
    espacioCompartido: [],
    descripcionHogar: "",
    familiaridad: "",
    terminos: false,
  });

  const [sending, setSending] = useState(false);

  const handleRadio = (e) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (option) => {
    setAnswers((prev) => {
      const exists = prev.espacioCompartido.includes(option);
      return {
        ...prev,
        espacioCompartido: exists
          ? prev.espacioCompartido.filter((o) => o !== option)
          : [...prev.espacioCompartido, option],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="adoption-form-page">
      {" "}
      <div className="form-container">
        {" "}
        <form className="form-card" onSubmit={handleSubmit}>
          {" "}
          <h2 className="form-title">
            Un poco más sobre ti y tu deseo de adoptar{" "}
          </h2>
          <div className="form-group">
            <label>¿Certificas que eres mayor de edad?</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="mayorEdad"
                  value="Sí"
                  onChange={handleRadio}
                  required
                />
                Sí
              </label>
              <label>
                <input
                  type="radio"
                  name="mayorEdad"
                  value="No"
                  onChange={handleRadio}
                />
                No
              </label>
            </div>
          </div>
          <div className="form-group">
            <label>¿Qué tan pronto te gustaría adoptar?</label>
            <div className="radio-group">
              {[
                "De inmediato",
                "Dentro de una semana",
                "Dentro de un mes",
                "Dentro de 6 meses",
                "Otro",
              ].map((opt) => (
                <label key={opt}>
                  <input
                    type="radio"
                    name="prontoAdoptar"
                    value={opt}
                    onChange={handleRadio}
                    required
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>¿Cómo es el espacio que compartirán?</label>
            <div className="checkbox-grid">
              {[
                "Tenemos uno o más perros",
                "Tenemos uno o más gatos",
                "Tenemos otros animales, que no son gatos ni perro",
                "Tenemos niños, o hay niños que visitan nuestra casa con frecuencia",
                "Nos gusta recibir visitas, y/o tenemos amigos o familiares que nos visitan con frecuencia",
                "Ninguna de las anteriores",
              ].map((opt) => (
                <label key={opt}>
                  <input
                    type="checkbox"
                    checked={answers.espacioCompartido.includes(opt)}
                    onChange={() => handleCheckbox(opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>¿Cómo describirías tu hogar la mayoría de los días?</label>
            <div className="radio-group">
              {[
                "Activo, divertido, siempre hay algo que está pasando",
                "Divertido, relajado, pero no demasiado tranquilo",
                "Calmado, tranquilo y relajado",
              ].map((opt) => (
                <label key={opt}>
                  <input
                    type="radio"
                    name="descripcionHogar"
                    value={opt}
                    onChange={handleRadio}
                    required
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>
              ¿Qué tan familiarizado estás con el cuidado de perros? (1 = Nunca
              he tenido uno, 10 = Muy experimentado)
            </label>
            <div className="radio-group likert">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                <label key={num}>
                  <input
                    type="radio"
                    name="familiaridad"
                    value={num}
                    onChange={handleRadio}
                    required
                  />
                  {num}
                </label>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="terms-label">
              <input
                type="checkbox"
                name="terminos"
                checked={answers.terminos}
                onChange={(e) =>
                  setAnswers({ ...answers, terminos: e.target.checked })
                }
                required
              />
              Acepto los Términos y Condiciones establecidos
            </label>
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="outline-btn"
              onClick={() => navigate(-1)}
            >
              Regresar
            </button>
            <button type="submit" className="cta-btn" disabled={sending}>
              {sending ? "Enviando…" : "Enviar"}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default AdoptFormPage2;
