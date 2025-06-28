// Elimina TODO lo relacionado con AUTH_USERNAME, AUTH_PASSWORD, createAuthHeaders y los interceptores de axios

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8085/api/categories';

// --- FUNCIONES SOLO JWT ---

export async function checkConnection(token) {
  try {
    const res = await fetch(`${API_URL}/all`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function getAllCategories(token) {
  const res = await fetch(`${API_URL}/all`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("No se pudieron cargar las categorías");
  return res.json();
}

export async function createCategory(categoryData, token) {
  const res = await fetch(`${API_URL}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(categoryData),
  });
  if (!res.ok) throw new Error("No se pudo crear la categoría");
  return res.json();
}

export async function updateCategory(id, categoryData, token) {
  const res = await fetch(`${API_URL}/${id}/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(categoryData),
  });
  if (!res.ok) throw new Error("No se pudo actualizar la categoría");
  return res.json();
}

export async function deactivateCategory(id, token) {
  const res = await fetch(`${API_URL}/${id}/status?active=false`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("No se pudo desactivar la categoría");
  return res.json();
}

// Si necesitas un objeto CategoryService, solo referencia estas funciones:
const CategoryService = {
  checkConnection,
  getAllCategories,
  createCategory,
  updateCategory,
  deactivateCategory,
};

export default CategoryService;