import React from "react";

function CareSection() {
  return (
    <section className="care">
      <h2>Cuidarlos bien es quererlos mejor</h2>

      <div className="care-grid">
        <div className="care-item">
          <h3>Espacio y comodidad</h3>
          <p>
            Un entorno limpio y seguro les permite descansar, jugar y sentirse protegidos.
          </p>
        </div>
        <div className="care-item">
          <h3>Amor y compañía</h3>
          <p>El afecto diario fortalece el vínculo y mejora su bienestar emocional.</p>
        </div>
        <div className="care-item">
          <h3>Alimentación adecuada</h3>
          <p>Una dieta balanceada es clave para su salud y energía.</p>
        </div>
        <div className="care-item">
          <h3>Atención médica</h3>
          <p>
            Vacunas y chequeos son esenciales para prevenir enfermedades y cuidar.
          </p>
        </div>
      </div>

      <button className="see-more"
        onClick={()=>
        (window.location.href = "/info#care-section")
        }>Ver consejos completos</button>
    </section>
  );
}

export default CareSection;
