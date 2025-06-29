import axios from "axios";

// Asegúrate de que tu variable de entorno esté configurada correctamente para Next.js
// NEXT_PUBLIC_API_URL debe estar en un archivo .env.local en la raíz de tu proyecto
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8085';
const GAMES_API_URL = `${API_BASE_URL}/api/games`;

// Helper para los encabezados con JWT.
// ¡Es CRÍTICO que esta función NO establezca Content-Type cuando vas a enviar FormData!
const getAuthHeaders = (token) => {
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  // NO añadas 'Content-Type' aquí. Axios lo gestionará automáticamente para FormData.
  return { headers };
};

export async function checkConnection(token) {
  try {
    const res = await axios.get(`${GAMES_API_URL}/all`, getAuthHeaders(token));
    return { connected: res.status === 200, authenticated: true };
  } catch (error) {
    console.error("Connection check failed:", error);
    if (error.response && error.response.status === 401) {
      return { connected: true, authenticated: false, error: "Unauthorized" };
    }
    return { connected: false, authenticated: false, error: error.message || "Network Error" };
  }
}

export async function getAllGames(token) {
  const res = await axios.get(`${GAMES_API_URL}/all`, getAuthHeaders(token));
  return res.data;
}

export async function createGame(gameData, token) {
  console.log(gameData instanceof FormData); // Debe ser true
  // Cuando envías 'gameData' (que es un FormData), Axios establecerá
  // automáticamente 'Content-Type' a 'multipart/form-data'.
  // NO debes establecerlo manualmente aquí.
  const res = await axios.post(`${GAMES_API_URL}/create`, gameData, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    withCredentials: true, // Mantén esto si necesitas enviar cookies
  });
  return res.data;
}

export async function updateGame(id, gameData, token) {
  // Lo mismo aplica para el update: si 'gameData' es FormData,
  // deja que Axios gestione el Content-Type.
  const res = await axios.put(`${GAMES_API_URL}/${id}/update`, gameData, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    withCredentials: true,
  });
  return res.data;
}

export async function changeGameStatus(id, activeStatus, token) {
  const res = await axios.patch(`${GAMES_API_URL}/${id}/status?active=${activeStatus}`, {}, getAuthHeaders(token));
  return res.data;
}

export async function highlightGame(id, highlightedStatus, token) {
  const res = await axios.patch(`${GAMES_API_URL}/${id}/highlight?highlighted=${highlightedStatus}`, {}, getAuthHeaders(token));
  return res.data;
}

const GameService = {
  checkConnection,
  getAllGames,
  createGame,
  updateGame,
  changeGameStatus,
  highlightGame,
};

export default GameService;