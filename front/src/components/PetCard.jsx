import React from "react";

export default function PetCard({ pet }) {
  return (
    <article className="pet-card" aria-labelledby={`pet-${pet.id}-name`}>
      <div className="pet-image-wrap">
        <img src="/assets/placeholder-pet.jpg" alt={`${pet.name} placeholder`} className="pet-image" />
      </div>
      <div className="pet-info">
        <h4 id={`pet-${pet.id}-name`}>{pet.name}</h4>
        <p className="pet-desc">{pet.desc}</p>
      </div>
    </article>
  );
}
