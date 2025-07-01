import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8085';

/**
 * Creates the authorization headers for API requests.
 * @param {string} token - The JWT token for authentication.
 * @returns {object} The headers object.
 */
const authHeaders = (token) => ({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});

/**
 * Service class for handling all operations related to game exchanges.
 */
class ExchangeService {
  /**
   * Checks the connection to the exchange service endpoint.
   * @param {string} token - The user's auth token.
   * @returns {Promise<boolean>} True if the connection is successful, false otherwise.
   */
  async checkConnection(token) {
    try {
      const response = await axios.get(`${API_URL}/api/exchanges/all`, authHeaders(token));
      return response.status === 200;
    } catch (error) {
      console.error("Connection check to ExchangeService failed:", error);
      return false;
    }
  }

  /**
   * Fetches all exchanges from the backend. (Admin operation)
   * @param {string} token - The user's auth token.
   * @returns {Promise<Array>} A list of all exchanges.
   */
  async getAllExchanges(token) {
    try {
      const response = await axios.get(`${API_URL}/api/exchanges/all`, authHeaders(token));
      return response.data;
    } catch (error) {
      console.error("Error fetching exchanges:", error.response || error);
      throw error.response?.data || new Error('Error al obtener los intercambios.');
    }
  }

  /**
   * Creates a new exchange record in the backend.
   * @param {object} exchangeData - The data for the new exchange.
   * @param {string|number} exchangeData.requestedGameId - The ID of the game being requested.
   * @param {string|number} exchangeData.offeredGameId - The ID of the game being offered.
   * @param {string} token - The user's auth token.
   * @returns {Promise<object>} The newly created exchange object.
   */
  async createExchange(exchangeData, token) {
    try {
      const response = await axios.post(`${API_URL}/api/exchanges/create`, exchangeData, authHeaders(token));
      return response.data;
    } catch (error) {
      console.error("Error creating exchange:", error.response || error);
      const apiError = error.response?.data;
      const errorMessage = apiError?.message || 'Ocurrió un error al crear el intercambio. Por favor, inténtalo de nuevo.';
      throw new Error(errorMessage);
    }
  }

  /**
   * Fetches a specific exchange by its ID.
   * @param {string|number} exchangeId - The ID of the exchange to fetch.
   * @param {string} token - The user's auth token.
   * @returns {Promise<object>} The exchange object.
   */
  async getExchangeById(exchangeId, token) {
    try {
      const response = await axios.get(`${API_URL}/api/exchanges/${exchangeId}`, authHeaders(token));
      return response.data;
    } catch (error) {
      console.error(`Error fetching exchange ${exchangeId}:`, error.response || error);
      throw error.response?.data || new Error('Error al obtener los detalles del intercambio.');
    }
  }

  /**
   * Updates the status of an existing exchange.
   * @param {string|number} exchangeId - The ID of the exchange to update.
   * @param {string} status - The new status (e.g., 'COMPLETED', 'CANCELLED').
   * @param {string} token - The user's auth token.
   * @returns {Promise<object>} The updated exchange object.
   */
  async updateExchangeStatus(exchangeId, status, token) {
    try {
      const response = await axios.patch(`${API_URL}/api/exchanges/${exchangeId}/status`, { status }, authHeaders(token));
      return response.data;
    } catch (error) {
      console.error(`Error updating status for exchange ${exchangeId}:`, error.response || error);
      throw error.response?.data || new Error('Error al actualizar el estado del intercambio.');
    }
  }
}

export default new ExchangeService();