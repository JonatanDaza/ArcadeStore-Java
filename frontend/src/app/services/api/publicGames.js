// Servicio para obtener juegos públicos (sin autenticación)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8085';

class PublicGameService {
  
  // Método de diagnóstico temporal
  async debugGames() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/games/public/debug`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.text();
      console.log('🔍 DEBUG INFO:', result);
      return result;
    } catch (error) {
      console.error('Error in debug:', error);
      throw error;
    }
  }
  
  // Obtener todos los juegos activos para la tienda
  async getActiveGames() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/games/public/active`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching active games:', error);
      throw error;
    }
  }

  // NUEVO: Obtener solo juegos de pago (no gratuitos)
  async getPaidGames() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/games/public/paid`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching paid games:', error);
      throw error;
    }
  }

  // Obtener un juego específico por ID (público)
  async getGameById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/games/public/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Juego no encontrado');
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching game by ID:', error);
      throw error;
    }
  }

  // Obtener juegos destacados
  async getFeaturedGames() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/games/public/featured`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching featured games:', error);
      throw error;
    }
  }

  // Obtener juegos por categoría
  async getGamesByCategory(categoryId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/games/public/category/${categoryId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching games by category:', error);
      throw error;
    }
  }

  // Obtener juegos gratuitos
  async getFreeGames() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/games/public/free`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching free games:', error);
      throw error;
    }
  }

  // Obtener juegos recientes
  async getRecentGames() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/games/public/recent`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching recent games:', error);
      throw error;
    }
  }

  // Verificar conexión con el servidor
  async checkConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/games/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Connection check failed:', error);
      return false;
    }
  }

  // Construir URL de imagen
  getImageUrl(imagePath) {
    if (!imagePath) return '/images/default-game.png';
    return `${API_BASE_URL}/images/${imagePath}`;
  }

  // Mapear datos del backend al formato del frontend
  mapGameData(game) {
    return {
      id: game.id,
      titulo: game.title,
      descripcion: game.description,
      precio: game.price,
      image: game.imagePath,
      categoria: game.category,
      requisitos_minimos: game.requisiteMinimum,
      requisitos_recomendados: game.requisiteRecommended,
      active: game.active,
      highlighted: game.highlighted,
      esFreeToPlay: game.price === 0
    };
  }
}

export default new PublicGameService();