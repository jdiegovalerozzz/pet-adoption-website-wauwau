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
  const [serverErrors, setServerErrors] = useState([]);
  const [success, setSuccess] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerErrors([]);
    setSuccess(null);
    if (!petId) {
      setServerErrors([{ msg: "Pet id no proporcionado" }]);
      return;
    }
    setSending(true);
    try {
      // Map front-end field names to the backend DB/validator fields
      const payload = {
        nombre_contacto: formData.nombres || null,
        apellido_contacto: formData.apellidos || null,
        correo_contacto: formData.correoPrincipal || null,
        correo_secundario: formData.correoSecundario || null,
        telefono_contacto: formData.telefonoPrincipal || null,
        telefono_secundario: formData.telefonoSecundario || null,
        direccion_contacto: formData.direccion || null,
        condiciones_hogar: answers.descripcionHogar || null,
        estado: formData.estado || null,
        ciudad: formData.ciudad || null,
        codigo_postal: formData.codigoPostal || null,
        conyuge: formData.companero || null,
        adoption_timeline: answers.prontoAdoptar || null,
        familiarity_level: answers.familiaridad ? Number(answers.familiaridad) : null,
        household_composition: Array.isArray(answers.espacioCompartido) ? answers.espacioCompartido : [],
        // Compatibility fields expected by validator
        // `is_adult` should be boolean (true if user certified adult)
        is_adult: answers.mayorEdad ? (answers.mayorEdad === "Sí" || answers.mayorEdad === "true" || answers.mayorEdad === "1") : null,
        // `accept_terms` should be boolean (true when checkbox is checked)
        accept_terms: Boolean(answers.terminos),
      };

      const res = await api.createAdoptionRequest(petId, payload);
      setSuccess(res);
    } catch (err) {
      if (err && err.status === 400 && err.payload && Array.isArray(err.payload.errors)) {
        setServerErrors(err.payload.errors);
      } else {
        setServerErrors([{ msg: err.message || "Error desconocido" }]);
      }
    } finally {
      setSending(false);
    }
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
        {serverErrors && serverErrors.length > 0 && (
          <div className="form-errors container" style={{ marginTop: '1rem' }}>
            <h4>Errores del formulario:</h4>
            <ul>
              {serverErrors.map((er, i) => (
                <li key={i}>{er.msg || JSON.stringify(er)}</li>
              ))}
            </ul>
          </div>
        )}

        {success && (
          <div className="form-success container" style={{ marginTop: '1rem' }}>
            <h3>Solicitud enviada</h3>
            <p>Tu solicitud fue creada con id: {success.id_solicitud}</p>
            <button className="cta-btn" onClick={() => navigate('/adopt')}>
              Volver a Adopciones
            </button>
          </div>
        )}
      <Footer />
    </div>
  );
};

export default AdoptFormPage2;
