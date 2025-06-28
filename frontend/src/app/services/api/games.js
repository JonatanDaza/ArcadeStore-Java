import axios from "axios";

// Make sure your environment variable is correctly set up for Next.js
// NEXT_PUBLIC_API_URL should be in a .env.local file in your project root
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8085';
const GAMES_API_URL = `${API_BASE_URL}/api/games`;

// Helper for headers with JWT
const authHeaders = (token) => {
  if (!token) {
    // Optionally throw an error or handle cases where token is missing
    console.error("Authentication token is missing.");
    // You might want to redirect to login or show an error to the user
  }
  return {
    headers: {
      "Content-Type": "application/json",
      // Ensure the Authorization header is set only if a token exists
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };
};

export async function checkConnection(token) {
  try {
    // Assuming /api/games/all is an endpoint that doesn't require specific roles
    // or you're checking general API reachability.
    const res = await axios.get(`${GAMES_API_URL}/all`, authHeaders(token));
    return { connected: res.status === 200, authenticated: true }; // Assuming 200 means authenticated if a token was sent
  } catch (error) {
    console.error("Connection check failed:", error);
    // Differentiate between network error and auth error if needed
    if (error.response && error.response.status === 401) {
      return { connected: true, authenticated: false, error: "Unauthorized" };
    }
    return { connected: false, authenticated: false, error: error.message || "Network Error" };
  }
}

export async function getAllGames(token) {
  const res = await axios.get(`${GAMES_API_URL}/all`, authHeaders(token));
  return res.data;
}

export async function createGame(gameData, token) {
  const res = await axios.post(`${GAMES_API_URL}/create`, gameData, authHeaders(token));
  return res.data;
}

export async function updateGame(id, gameData, token) {
  const res = await axios.put(`${GAMES_API_URL}/${id}/update`, gameData, authHeaders(token));
  return res.data;
}

// Unified function for changing game status
export async function changeGameStatus(id, activeStatus, token) {
  // Use PATCH for partial updates, directly setting the 'active' status
  const res = await axios.patch(`${GAMES_API_URL}/${id}/status?active=${activeStatus}`, {}, authHeaders(token));
  return res.data; // Assuming your backend returns a success message or the updated object
}

// Added for highlighting based on your UI
export async function highlightGame(id, highlightedStatus, token) {
  // Assuming your backend has an endpoint for highlighting, often a PATCH request
  const res = await axios.patch(`${GAMES_API_URL}/${id}/highlight?highlighted=${highlightedStatus}`, {}, authHeaders(token));
  return res.data;
}


const GameService = {
  checkConnection,
  getAllGames,
  createGame,
  updateGame,
  changeGameStatus, // Use the unified function
  highlightGame,
};

export default GameService;