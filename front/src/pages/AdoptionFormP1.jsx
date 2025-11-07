import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

import "../styles/base.css";
import "../styles/adoptionForm.css";
import "../styles/footer.css";

const AdoptFormPage1 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    companero: "",
    direccion: "",
    estado: "",
    ciudad: "",
    codigoPostal: "",
    telefonoPrincipal: "",
    telefonoSecundario: "",
    correoPrincipal: "",
    correoSecundario: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    navigate("/adopt/form/:id/page2", { state: { formData } });
  };

  return (
    <div className="adoption-form-page">
      <div className="form-container">
        <form className="form-card" onSubmit={handleNext}>
          <h2 className="form-title">
            ¡Ayúdanos a acercarte a tu nuevo compañero!
          </h2>

          <div className="grid-2">
            <div className="form-group">
              <label>Nombre(s)</label>
              <input
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Apellidos</label>
              <input
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              Cónyuge/pareja/compañero de habitación que quiera incluir en el
              registro (Opcional)
            </label>
            <input
              name="companero"
              value={formData.companero}
              onChange={handleChange}
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Dirección</label>
              <input
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Estado</label>
              <input
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Ciudad</label>
              <input
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Código Postal</label>
              <input
                name="codigoPostal"
                value={formData.codigoPostal}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Número de teléfono principal</label>
              <input
                name="telefonoPrincipal"
                value={formData.telefonoPrincipal}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Número de teléfono secundario (Opcional)</label>
              <input
                name="telefonoSecundario"
                value={formData.telefonoSecundario}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Dirección de correo electrónico principal</label>
              <input
                type="email"
                name="correoPrincipal"
                value={formData.correoPrincipal}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Dirección de correo electrónico secundaria (Opcional)</label>
              <input
                type="email"
                name="correoSecundario"
                value={formData.correoSecundario}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="outline-btn"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </button>
            <button type="submit" className="cta-btn">
              Siguiente
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default AdoptFormPage1;
