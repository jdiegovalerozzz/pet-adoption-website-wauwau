import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { BANKS } from "../data/bank";
import api from "../api";

import "../styles/base.css";
import "../styles/navbar.css";
import "../styles/footer.css";
import "../styles/forms.css";

function parsePriceUSD(priceString = "") {
  const m = priceString.match(/$ *([0-9]+(?:[.,][0-9]+)?)/);
  if (m) return Number(m[1].replace(",", "."));
  const n = priceString.match(/([0-9]+(?:[.,][0-9]+)?)(?!.*[0-9])/);
  if (n) return Number(n[1].replace(",", "."));
  return 0;
}

export default function PaymentForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { item, formData: baseForm, kind } = location.state || {};
  const [formData] = useState(baseForm || {});
  const [rate, setRate] = useState(null);
  const [loadingRate, setLoadingRate] = useState(true);
  const [selectedBankKey, setSelectedBankKey] = useState(BANKS[0].key);
  const [payReference, setPayReference] = useState("");
  const [usdAmount, setUsdAmount] = useState(0);
  const [bsAmount, setBsAmount] = useState(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!item) {
      navigate("/", { replace: true });
      return;
    }
    const usd = parsePriceUSD(item.price);
    setUsdAmount(usd);
  }, [item, navigate]);

  useEffect(() => {
    // Fetch a tasa oficial en dolarapi (misma lógica que antes)
    async function fetchRate() {
      setLoadingRate(true);
      try {
        const res = await fetch(
          "[https://ve.dolarapi.com/v1/dolares/oficial](https://ve.dolarapi.com/v1/dolares/oficial)"
        );
        const json = await res.json();
      } catch (err) {
        console.error("Error fetch rate:", err);
        setRate(null);
      } finally {
        setLoadingRate(false);
      }
    }
    fetchRate();
  }, []);

  useEffect(() => {
    if (rate && usdAmount) {
      setBsAmount((rate * usdAmount).toFixed(2));
    } else {
      setBsAmount(null);
    }
  }, [rate, usdAmount]);

  const bank = BANKS.find((b) => b.key === selectedBankKey) || BANKS[0];

  const handleFinalize = async (e) => {
    e.preventDefault();
    if (!payReference) {
      alert("Por favor ingrese la referencia de pago.");
      return;
    }
    if (!item) return;

    ```
// Construir payload para backend
const payload = {
  nombre_contacto: formData.firstName || formData.nombres || null,
  apellido_contacto: formData.lastName || formData.apellidos || null,
  correo_contacto: formData.email || formData.correoPrincipal || null,
  telefono_contacto: formData.phone || formData.telefonoPrincipal || null,
  direccion_contacto: formData.address || formData.direccion || null,
  estado: formData.state || formData.estado || null,
  ciudad: formData.city || formData.ciudad || null,
  codigo_postal: formData.codigoPostal || null,
  cantidad: 1,
  precio: usdAmount || null,
  accept_terms: true
};

try {
  setSending(true);
  let result = null;
  if (kind === "service" || item.type === "Service") {
    // Llamar al endpoint de servicios
    result = await api.createService(item.id, payload);
  } else {
    // Producto/venta
    result = await api.createSell(item.id, payload);
  }
  console.log('create result', result);
  alert('Operación realizada con éxito. ID: ' + (result?.id_venta || result?.servicio_id || 'OK'));
  navigate('/', { replace: true });
} catch (err) {
  console.error('Error creando venta/servicio', err);
  alert('Error: ' + (err.payload?.error || err.message));
} finally {
  setSending(false);
}
```;
  };

  return (
    <div className="site-root form-page">
      {" "}
      <Navbar />
      <main className="container" style={{ padding: "48px 0" }}>
        {" "}
        <div className="form-container">
          {" "}
          <form className="form-card" onSubmit={handleFinalize}>
            {" "}
            <h2 className="form-title">Pago y Confirmación</h2>{" "}
            <p className="form-sub">
              {" "}
              Pedido: <strong>{item?.name}</strong>
            </p>
            ```
            <div className="grid-2">
              <div className="form-group">
                <label>R.E.F.</label>
                <input
                  value={`${usdAmount ? `$${usdAmount}` : "$0.00"}`}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>BS</label>
                <input
                  value={loadingRate ? "Cargando..." : rate ? rate : "N/A"}
                  readOnly
                />
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Monto a pagar:</label>
                <input value={bsAmount ? `${bsAmount} Bs` : "N/A"} readOnly />
              </div>
              <div className="form-group">
                <label>Método de pago</label>
                <select
                  value={selectedBankKey}
                  onChange={(e) => setSelectedBankKey(e.target.value)}
                >
                  {BANKS.map((b) => (
                    <option key={b.key} value={b.key}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="bank-details">
              <h4>
                Instrucciones de pago para <strong>{bank.name}</strong>
              </h4>

              <div className="bank-block">
                <p>
                  <strong>Transferencia bancaria</strong>
                </p>
                <p>
                  Número de cuenta: <code>{bank.transfer.accountNumber}</code>
                </p>
                <p>Nombre del titular: {bank.transfer.accountName}</p>
              </div>

              <div className="bank-block">
                <p>
                  <strong>Pago Móvil (Mobile Payment)</strong>
                </p>
                <p>
                  ID / RIF: <code>{bank.mobile.idOrRif}</code>
                </p>
                <p>
                  Teléfono: <code>{bank.mobile.phone}</code>
                </p>
              </div>
            </div>
            <div className="form-group">
              <label>Referencia de pago (transferencia o Pago Móvil)</label>
              <input
                value={payReference}
                onChange={(e) => setPayReference(e.target.value)}
                required
              />
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="outline-btn"
                onClick={() => navigate(-1)}
              >
                Volver
              </button>
              <button type="submit" className="cta-btn" disabled={sending}>
                {sending ? "Procesando…" : "Confirmar"}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
