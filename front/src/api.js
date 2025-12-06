const BASE = import.meta.env.VITE_API_BASE || 'https://pet-adoption-website-wauwau.onrender.com';

async function request(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts
  });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }
  if (!res.ok) {
    const err = new Error(data?.error || res.statusText || 'API error');
    err.status = res.status;
    err.payload = data;
    throw err;
  }
  return data;
}

/* Pets */
export async function fetchPets() {
  return request('/api/pets');
}
export async function fetchPetById(id) {
  return request(`/api/pets/${id}`);
}
export async function createAdoptionRequest(petId, body) {
  // body debe contener los campos que tu backend espera (ver más abajo el mapeo)
  return request(`/api/pets/${petId}/adopt`, {
    method: 'POST',
    body: JSON.stringify(body)
  });
}

/* Products / Sells */
export async function fetchProducts() {
  return request('/api/sells'); // rutas: GET /api/sells
}
export async function fetchProductById(id) {
  return request(`/api/sells/${id}`);
}
export async function createSell(productId, body) {
  // Envía tanto en URL como en body producto_id por compatibilidad con validadores
  return request(`/api/sells/${productId}/sell`, {
    method: 'POST',
    body: JSON.stringify({ producto_id: Number(productId), ...body })
  });
}

/* Services */
export async function fetchServices() {
  return request('/api/services');
}
export async function fetchServiceById(id) {
  return request(`/api/services/${id}`);
}
export async function createService(serviceId, body) {
  return request(`/api/services/${serviceId}/sell`, {
    method: 'POST',
    body: JSON.stringify(body)
  });
}

export default {
  fetchPets, fetchPetById, createAdoptionRequest,
  fetchProducts, fetchProductById, createSell,
  fetchServices, fetchServiceById, createService
};
