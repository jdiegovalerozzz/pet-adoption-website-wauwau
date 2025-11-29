import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

import "../styles/base.css";
import "../styles/forms.css";
import "../styles/footer.css";

export default function ItemForm() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const item = state?.item;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    phone: "",
    email: "",
    appointmentDate: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!item) return;
    // Pasamos item y formData a la pantalla de pago
    const kind = item.type === "Service" ? "service" : "product";
    navigate("/form/payment", { state: { item, formData, kind } });
  };

  if (!item) {
    return (
      <div className="site-root">
        <main
          className="container"
          style={{ padding: "4rem 0", textAlign: "center" }}
        >
          {" "}
          <h2>Item no encontrado</h2>{" "}
        </main>{" "}
        <Footer />{" "}
      </div>
    );
  }

  return (
    <div className="form-page">
      {" "}
      <div className="form-container">
        {" "}
        <form className="form-card" onSubmit={handleNext}>
          {" "}
          <h2 className="form-title">
            {item.type === "Service"
              ? "Información de cita"
              : "Información de envío"}{" "}
          </h2>
          <div className="grid-2">
            <div className="form-group">
              <label>Nombre</label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Apellido</label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label>Dirección</label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Ciudad</label>
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label>Estado</label>
              <input
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Correo</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          {item.type === "Service" && (
            <div className="form-group">
              <label>Fecha de cita preferida</label>
              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div className="form-actions">
            <button
              type="button"
              className="outline-btn"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </button>
            <button type="submit" className="cta-btn">
              Continuar
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
