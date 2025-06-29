import axios from "axios";

const API_URL = 'http://localhost:8085/api/categories';

// Helper para headers con JWT
const authHeaders = (token) => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

export async function checkConnection(token) {
  try {
    const res = await axios.get(`${API_URL}/all`, authHeaders(token));
    return res.status === 200;
  } catch {
    return false;
  }
}

export async function getAllCategories(token) {
  const res = await axios.get(`${API_URL}/all`, authHeaders(token));
  return res.data;
}

export async function createCategory(categoryData, token) {
  const res = await axios.post(`${API_URL}/create`, categoryData, authHeaders(token));
  return res.data;
}

export async function updateCategory(id, categoryData, token) {
  const res = await axios.put(`${API_URL}/${id}/update`, categoryData, authHeaders(token));
  return res.data;
}

export async function deactivateCategory(id, token) {
  const res = await axios.patch(`${API_URL}/${id}/status?active=false`, {}, authHeaders(token));
  return res.data;
}

export async function activateCategory(id, token) {
  const res = await axios.patch(`${API_URL}/${id}/status?active=true`, {}, authHeaders(token));
  return res.data;
}

const CategoryService = {
  checkConnection,
  getAllCategories,
  createCategory,
  updateCategory,
  deactivateCategory,
  activateCategory,
};

export default CategoryService;
