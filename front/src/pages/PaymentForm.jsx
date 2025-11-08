import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { BANKS } from "../data/bank";

import "../styles/base.css";
import "../styles/navbar.css";
import "../styles/footer.css";
import "../styles/forms.css";

function parsePriceUSD(priceString = "") {
  // Intenta extraer el monto en $ primero
  const m = priceString.match(/\$ *([0-9]+(?:[.,][0-9]+)?)/);
  if (m) return Number(m[1].replace(",", "."));
  // De lo contrario, intenta encontrar el último número en la cadena
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

  useEffect(() => {
    if (!item) {
      navigate("/", { replace: true });
      return;
    }
    const usd = parsePriceUSD(item.price);
    setUsdAmount(usd);
  }, [item, navigate]);

  useEffect(() => {
    // Fetch a tasa oficial en dolarapi
    async function fetchRate() {
      setLoadingRate(true);
      try {
        const res = await fetch("https://ve.dolarapi.com/v1/dolares/oficial");
        const json = await res.json();

        let parsed = null;
        if (json?.oficial && typeof json.oficial === "object") {
          parsed = Number(json.oficial?.promedio || json.oficial?.venta || json.oficial?.compra);
        } else if (json?.dolar && typeof json.dolar === "object") {
          parsed = Number(json.dolar?.venta || json.dolar?.promedio || json.dolar?.compra);
        } else if (Array.isArray(json)) {
          const first = json[0] || {};
          parsed = Number(first?.venta || first?.precio || first?.compra || first?.promedio);
        } else if (typeof json === "object") {
          for (const k of Object.keys(json)) {
            const v = json[k];
            if (typeof v === "number") {
              parsed = v;
              break;
            }
            if (typeof v === "string" && v.match(/^[0-9.,]+$/)) {
              parsed = Number(v.replace(",", "."));
              break;
            }
          }
        }
        if (!parsed || Number.isNaN(parsed)) {
          const text = JSON.stringify(json);
          const m = text.match(/([0-9]+(?:[.,][0-9]+)?)/);
          parsed = m ? Number(m[1].replace(",", ".")) : null;
        }
        setRate(parsed);
      } catch (err) {
        console.error("Error haciendo fetch de la tasa:", err);
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

  const handleFinalize = (e) => {
    e.preventDefault();
    if (!payReference) {
      alert("Por favor ingrese la referencia de pago.");
      return;
    }

    // Envio simulado
    const payload = {
      item,
      kind,
      buyer: formData,
      usdAmount,
      bsAmount,
      rate,
      paymentMethod: bank.key,
      paymentReference: payReference,
      timestamp: new Date().toISOString()
    };

    console.log("Payment payload:", payload);
    alert("Información de pago guardada.");
    navigate("/", { replace: true });
  };

  return (
    <div className="site-root form-page">
      <Navbar />
      <main className="container" style={{ padding: "48px 0" }}>
        <div className="form-container">
          <form className="form-card" onSubmit={handleFinalize}>
            <h2 className="form-title">Pago y Confirmación</h2>
            <p className="form-sub"> Pedido: <strong>{item?.name}</strong></p>

            <div className="grid-2">
              <div className="form-group">
                <label>R.E.F.</label>
                <input value={`${usdAmount ? `$${usdAmount}` : "$0.00"}`} readOnly />
              </div>

              <div className="form-group">
                <label>BS</label>
                <input value={loadingRate ? "Cargando..." : (rate ? rate : "N/A")} readOnly />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Monto a pagar:</label>
                <input value={bsAmount ? `${bsAmount} Bs` : "N/A"} readOnly />
              </div>
              <div className="form-group">
                <label>Método de pago</label>
                <select value={selectedBankKey} onChange={(e) => setSelectedBankKey(e.target.value)}>
                  {BANKS.map((b) => (
                    <option key={b.key} value={b.key}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bank-details">
              <h4>Instrucciones de pago para <strong>{bank.name}</strong></h4>

              <div className="bank-block">
                <p><strong>Transferencia bancaria</strong></p>
                <p>Número de cuenta: <code>{bank.transfer.accountNumber}</code></p>
                <p>Nombre del titular: {bank.transfer.accountName}</p>
              </div>

              <div className="bank-block">
                <p><strong>Pago Móvil (Mobile Payment)</strong></p>
                <p>ID / RIF: <code>{bank.mobile.idOrRif}</code></p>
                <p>Teléfono: <code>{bank.mobile.phone}</code></p>
              </div>
            </div>

            <div className="form-group">
              <label>Referencia de pago (transferencia o Pago Móvil)</label>
              <input value={payReference} onChange={(e) => setPayReference(e.target.value)} required />
            </div>

            <div className="form-actions">
              <button type="button" className="outline-btn" onClick={() => navigate(-1)}>Volver</button>
              <button type="submit" className="cta-btn">Confirmar</button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
