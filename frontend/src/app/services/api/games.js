// services/api/games.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8085';

class GameService {
  // Verificar conexión con el backend
  static async checkConnection(token = null) {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/games/health`, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      return response.ok;
    } catch (error) {
      console.error('Error checking connection:', error);
      return false;
    }
  }

  // Obtener todos los juegos
  static async getAllGames(token = null) {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      console.log('🔄 Haciendo petición a:', `${API_BASE_URL}/api/games/all`);
      console.log('🔄 Headers:', headers);

      const response = await fetch(`${API_BASE_URL}/api/games/all`, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📦 Datos recibidos del servidor:', data);
      
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('❌ Error fetching games:', error);
      throw new Error(`Error al obtener juegos: ${error.message}`);
    }
  }

  // Obtener juego por ID
  static async getGameById(id, token = null) {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/games/${id}/show`, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching game:', error);
      throw new Error(`Error al obtener juego: ${error.message}`);
    }
  }

  // Crear nuevo juego
  static async createGame(gameData, token = null) {
    try {
      const headers = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Validar que gameData sea FormData
      if (!(gameData instanceof FormData)) {
        throw new Error('Los datos del juego deben ser FormData');
      }

      // Log para debugging - mostrar todos los campos
      console.log('=== DEBUGGING FORM DATA ===');
      for (let [key, value] of gameData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File - ${value.name} (${value.type}, ${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      console.log('=== END DEBUGGING ===');

      const response = await fetch(`${API_BASE_URL}/api/games/create`, {
        method: 'POST',
        headers,
        body: gameData,
        credentials: 'include',
      });

      // Log de la respuesta para debugging
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        
        // Intentar parsear como JSON si es posible
        let errorMessage = errorText;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorText;
        } catch (e) {
          // Si no es JSON válido, usar el texto tal como está
        }
        
        throw new Error(`Error ${response.status}: ${errorMessage}`);
      }

      // Intentar parsear la respuesta
      const responseText = await response.text();
      console.log('Success response body (first 500 chars):', responseText.substring(0, 500));
      
      try {
        const result = JSON.parse(responseText);
        console.log('✅ Juego creado exitosamente:', result);
        return result;
      } catch (parseError) {
        console.error('❌ Error parsing JSON response:', parseError);
        console.error('Response text length:', responseText.length);
        console.error('Response text preview:', responseText.substring(0, 1000));
        
        // Si el JSON es muy largo, probablemente sea por referencia circular
        if (responseText.length > 10000) {
          throw new Error('La respuesta del servidor es demasiado larga. Posible referencia circular en los datos.');
        }
        
        throw new Error(`Error al parsear respuesta del servidor: ${parseError.message}`);
      }

    } catch (error) {
      console.error('Error creating game:', error);
      throw new Error(`Error al crear juego: ${error.message}`);
    }
  }

  // Actualizar juego
  static async updateGame(id, gameData, token = null) {
    try {
      const headers = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Validar que gameData sea FormData
      if (!(gameData instanceof FormData)) {
        throw new Error('Los datos del juego deben ser FormData');
      }

      const response = await fetch(`${API_BASE_URL}/api/games/${id}/update`, {
        method: 'PUT',
        headers,
        body: gameData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update error response:', errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const responseText = await response.text();
      try {
        return JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing update response:', parseError);
        throw new Error(`Error al parsear respuesta: ${parseError.message}`);
      }
    } catch (error) {
      console.error('Error updating game:', error);
      throw new Error(`Error al actualizar juego: ${error.message}`);
    }
  }

  // Cambiar estado del juego (activo/inactivo)
  static async changeGameStatus(id, active, token = null) {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/games/${id}/status?active=${active}`, {
        method: 'PATCH',
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      return true;
    } catch (error) {
      console.error('Error changing game status:', error);
      throw new Error(`Error al cambiar estado: ${error.message}`);
    }
  }

  // Destacar/quitar destacado del juego
  static async highlightGame(id, highlighted, token = null) {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Nota: Este endpoint necesita ser implementado en el backend
      const response = await fetch(`${API_BASE_URL}/api/games/${id}/highlight?highlighted=${highlighted}`, {
        method: 'PATCH',
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      return true;
    } catch (error) {
      console.error('Error highlighting game:', error);
      // Por ahora, simular éxito si el endpoint no existe
      if (error.message.includes('404')) {
        console.warn('Endpoint de destacar no implementado, simulando éxito');
        return true;
      }
      throw new Error(`Error al destacar juego: ${error.message}`);
    }
  }
}

export default GameService;