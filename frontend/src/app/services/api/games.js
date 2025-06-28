import axios from "axios";

// Configuración de la API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8085/api/games';

// Credenciales de autenticación
const AUTH_USERNAME = process.env.NEXT_PUBLIC_AUTH_USERNAME || 'Edgard';
const AUTH_PASSWORD = process.env.NEXT_PUBLIC_AUTH_PASSWORD || '1000213418';

// Función para crear headers de autenticación
const createAuthHeaders = () => {
  const credentials = btoa(`${AUTH_USERNAME}:${AUTH_PASSWORD}`);
  return {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${credentials}`,
    'Accept': 'application/json'
  };
};

// Configuración base para axios con interceptores mejorados
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor de request para agregar autenticación
apiClient.interceptors.request.use(
  (config) => {
    // Agregar autenticación a cada request
    const credentials = btoa(`${AUTH_USERNAME}:${AUTH_PASSWORD}`);
    config.headers.Authorization = `Basic ${credentials}`;
    
    console.log(`Making ${config.method?.toUpperCase()} request to:`, config.url);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Interceptor de response mejorado
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ Success ${response.config.method?.toUpperCase()} ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    const errorDetails = {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      responseData: error.response?.data
    };
    
    console.error('❌ API Error Details:', errorDetails);
    
    // Log específico para errores de autenticación
    if (error.response?.status === 401) {
      console.error('🔐 Authentication failed - check credentials');
    }
    
    // Log específico para errores del servidor
    if (error.response?.status === 500) {
      console.error('🔥 Server Error (500) - Backend issue detected');
      console.error('Server response:', error.response?.data);
    }
    
    return Promise.reject(error);
  }
);

// Función helper para manejar errores de red y autenticación
const handleNetworkError = (error, operation) => {
  // Errores de autenticación
  if (error.response?.status === 401) {
    throw new Error(`❌ Error de autenticación: Las credenciales son inválidas. Usuario: ${AUTH_USERNAME}`);
  }
  
  // Errores de autorización
  if (error.response?.status === 403) {
    throw new Error('❌ Error de autorización: No tienes permisos para realizar esta operación.');
  }
  
  // Error del servidor (500)
  if (error.response?.status === 500) {
    const serverMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         error.response?.data || 
                         'Error interno del servidor';
    throw new Error(`❌ Error del servidor (500): ${serverMessage}. Verifica que el backend esté funcionando correctamente.`);
  }
  
  // Errores específicos del negocio
  if (error.response?.status === 409) {
    throw new Error(error.response.data || 'Conflicto en la operación solicitada');
  }
  
  if (error.response?.status === 400) {
    const message = error.response?.data?.message || 'Datos inválidos enviados al servidor';
    throw new Error(`❌ Error de validación: ${message}`);
  }
  
  if (error.response?.status === 404) {
    throw new Error('❌ Recurso no encontrado');
  }
  
  // Errores de red
  if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
    throw new Error(`❌ Error de conexión: No se pudo conectar al servidor en ${API_URL}. Verifica que el backend esté ejecutándose.`);
  }
  
  // Timeout
  if (error.code === 'ECONNABORTED') {
    throw new Error(`⏱️ Timeout: La operación "${operation}" tardó demasiado en responder (más de 15 segundos)`);
  }
  
  // Error del servidor con respuesta
  if (error.response) {
    const serverMessage = error.response.data?.message || error.response.statusText;
    throw new Error(`❌ Error del servidor (${error.response.status}): ${serverMessage}`);
  }
  
  // Sin respuesta del servidor
  if (error.request) {
    throw new Error(`❌ Sin respuesta del servidor: Verifica la URL ${API_URL} y que el servidor esté ejecutándose`);
  }
  
  // Error inesperado
  throw new Error(`❌ Error inesperado en "${operation}": ${error.message}`);
};

const GameService = {
  /**
   * Verifica la conectividad y autenticación con el servidor
   * @returns {Promise<{connected: boolean, authenticated: boolean, error?: string}>}
   */
  checkConnectionAndAuth: async () => {
    try {
      console.log('🔍 Checking connection and authentication...');
      console.log('📍 API URL:', API_URL);
      console.log('👤 Username:', AUTH_USERNAME);
      
      const response = await fetch(API_URL + '/all', {
        method: 'GET',
        headers: createAuthHeaders(),
        mode: 'cors'
      });
      
      const result = {
        connected: true,
        authenticated: response.ok,
        status: response.status,
        statusText: response.statusText
      };
      
      if (response.status === 401) {
        result.error = 'Credenciales inválidas';
        console.error('🔐 Authentication failed: Invalid credentials');
      } else if (response.status === 403) {
        result.error = 'Sin permisos suficientes';
        console.error('🚫 Authorization failed: Insufficient permissions');
      } else if (response.status === 500) {
        result.error = 'Error interno del servidor';
        console.error('🔥 Server error (500): Internal server error');
        try {
          const errorText = await response.text();
          console.error('Server error details:', errorText);
        } catch (e) {
          console.error('Could not read server error details');
        }
      } else if (!response.ok) {
        result.error = `Error ${response.status}: ${response.statusText}`;
        console.error('❌ Request failed:', response.status, response.statusText);
      } else {
        console.log('✅ Connection and authentication successful');
      }
      
      return result;
    } catch (error) {
      console.error('🔥 Connection check failed:', error);
      return {
        connected: false,
        authenticated: false,
        error: error.message
      };
    }
  },

  /**
   * Obtiene todos los juegos con manejo mejorado de errores
   * @returns {Promise<Array>} Lista de juegos
   */
  getAllGames: async () => {
    try {
      console.log('🎮 Fetching all games...');
      
      // Verificar conexión primero
      const connectionStatus = await GameService.checkConnectionAndAuth();
      if (!connectionStatus.connected || !connectionStatus.authenticated) {
        throw new Error(`Error de conexión: ${connectionStatus.error}`);
      }
      
      const response = await apiClient.get('/all');
      
      // Validar que la respuesta sea un array
      if (!Array.isArray(response.data)) {
        console.warn('⚠️ Response is not an array, converting to array');
        const data = response.data || [];
        return Array.isArray(data) ? data : [];
      }
      
      console.log(`✅ Successfully fetched ${response.data.length} games`);
      return response.data;
      
    } catch (error) {
      console.error('❌ Failed to fetch games:', error.message);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      // Para errores 500, proporcionar más contexto
      if (error.response?.status === 500) {
        console.error('🔥 Server Error Details:');
        console.error('- Check if the backend API is running correctly');
        console.error('- Check database connectivity');
        console.error('- Check server logs for more information');
      }
      
      handleNetworkError(error, 'obtener juegos');
    }
  },

  /**
   * Obtiene un juego por ID con manejo mejorado de errores
   * @param {number} id - ID del juego
   * @returns {Promise<Object>} Juego encontrado
   */
  getGameById: async (id) => {
    try {
      if (!id || isNaN(id)) {
        throw new Error('ID de juego inválido');
      }
      
      console.log(`🔍 Fetching game with ID: ${id}`);
      const response = await apiClient.get(`/${id}/show`);
      
      if (!response.data) {
        throw new Error('No se encontraron datos del juego');
      }
      
      console.log('✅ Game fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Failed to fetch game ${id}:`, error.message);
      handleNetworkError(error, `obtener juego ${id}`);
    }
  },

  /**
   * Crea un nuevo juego con validación mejorada
   * @param {Object} gameData - Datos del juego
   * @returns {Promise<Object>} Juego creado
   */
  createGame: async (gameData) => {
    try {
      // Validación básica
      if (!gameData || typeof gameData !== 'object') {
        throw new Error('Los datos del juego son requeridos');
      }
      
      if (!gameData.titulo || gameData.titulo.trim() === '') {
        throw new Error('El título del juego es requerido');
      }

      if (!gameData.precio || gameData.precio <= 0) {
        throw new Error('El precio del juego es requerido y debe ser mayor a 0');
      }

      if (!gameData.categoryId) {
        throw new Error('La categoría del juego es requerida');
      }

      // Preparar datos con valores por defecto
      const dataToSend = {
        titulo: gameData.titulo.trim(),
        descripcion: gameData.descripcion || '',
        precio: Number(gameData.precio),
        imagen: gameData.imagen || '',
        requisitos_minimos: gameData.requisitos_minimos || '',
        requisitos_recomendados: gameData.requisitos_recomendados || '',
        categoryId: Number(gameData.categoryId),
        active: gameData.active !== undefined ? gameData.active : true
      };

      console.log('➕ Creating new game:', dataToSend);
      const response = await apiClient.post('/create', dataToSend);
      
      console.log('✅ Game created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to create game:', error.message);
      handleNetworkError(error, 'crear juego');
    }
  },

  /**
   * Actualiza un juego existente
   * @param {number} id - ID del juego
   * @param {Object} gameData - Datos actualizados del juego
   * @returns {Promise<Object>} Juego actualizado
   */
  updateGame: async (id, gameData) => {
    try {
      if (!id || isNaN(id)) {
        throw new Error('ID de juego inválido');
      }
      
      // Validación básica
      if (!gameData || typeof gameData !== 'object') {
        throw new Error('Los datos del juego son requeridos');
      }
      
      if (gameData.titulo && gameData.titulo.trim() === '') {
        throw new Error('El título del juego no puede estar vacío');
      }

      if (gameData.precio && gameData.precio <= 0) {
        throw new Error('El precio del juego debe ser mayor a 0');
      }

      const dataToSend = {
        ...gameData,
        titulo: gameData.titulo ? gameData.titulo.trim() : gameData.titulo,
        precio: gameData.precio ? Number(gameData.precio) : gameData.precio,
        categoryId: gameData.categoryId ? Number(gameData.categoryId) : gameData.categoryId
      };

      console.log(`📝 Updating game ${id}:`, dataToSend);
      const response = await apiClient.put(`/${id}/update`, dataToSend);
      
      console.log('✅ Game updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Failed to update game ${id}:`, error.message);
      handleNetworkError(error, `actualizar juego ${id}`);
    }
  },

  /**
   * Cambia el estado de un juego (activar/desactivar)
   * @param {number} id - ID del juego
   * @param {boolean} active - true para activar, false para desactivar
   * @returns {Promise<{success: boolean, message: string}>}
   */
  changeGameStatus: async (id, active) => {
    try {
      if (!id || isNaN(id)) {
        throw new Error('ID de juego inválido');
      }
      
      console.log(`🔄 Changing game ${id} status to: ${active ? 'active' : 'inactive'}`);
      const response = await apiClient.patch(`/${id}/status?active=${active}`);
      
      const message = active 
        ? 'Juego activado exitosamente' 
        : 'Juego desactivado exitosamente';
      
      console.log('✅ Game status changed successfully');
      
      return {
        success: true,
        message: message,
        data: response.data
      };
    } catch (error) {
      console.error(`❌ Failed to change game ${id} status:`, error.message);
      
      // Manejo específico para conflictos (409)
      if (error.response?.status === 409) {
        return {
          success: false,
          message: error.response.data || 'No se puede cambiar el estado del juego'
        };
      }
      
      handleNetworkError(error, `cambiar estado de juego ${id}`);
    }
  },

  /**
   * Obtiene solo los juegos activos
   * @returns {Promise<Array>} Lista de juegos activos
   */
  getActiveGames: async () => {
    try {
      console.log('🎮 Fetching active games...');
      const games = await GameService.getAllGames();
      const activeGames = games.filter(game => game.active === true);
      
      console.log(`✅ Found ${activeGames.length} active games out of ${games.length} total`);
      return activeGames;
    } catch (error) {
      console.error('❌ Failed to fetch active games:', error.message);
      throw new Error(`Error al obtener juegos activos: ${error.message}`);
    }
  },

  /**
   * Obtiene juegos por categoría
   * @param {number} categoryId - ID de la categoría
   * @returns {Promise<Array>} Lista de juegos de la categoría
   */
  getGamesByCategory: async (categoryId) => {
    try {
      if (!categoryId || isNaN(categoryId)) {
        throw new Error('ID de categoría inválido');
      }
      
      console.log(`🎮 Fetching games for category: ${categoryId}`);
      const response = await apiClient.get(`/category/${categoryId}`);
      
      const games = Array.isArray(response.data) ? response.data : [];
      console.log(`✅ Successfully fetched ${games.length} games for category ${categoryId}`);
      return games;
    } catch (error) {
      console.error(`❌ Failed to fetch games for category ${categoryId}:`, error.message);
      handleNetworkError(error, `obtener juegos de categoría ${categoryId}`);
    }
  },

  /**
   * Busca juegos por término (filtro local)
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Promise<Array>} Lista de juegos filtrados
   */
  searchGames: async (searchTerm) => {
    try {
      if (!searchTerm || searchTerm.trim() === '') {
        return GameService.getAllGames();
      }

      console.log(`🔍 Searching games with term: "${searchTerm}"`);
      const games = await GameService.getAllGames();
      
      const filteredGames = games.filter(game =>
        game.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (game.descripcion && game.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (game.categoria && game.categoria.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
      console.log(`✅ Found ${filteredGames.length} games matching "${searchTerm}"`);
      return filteredGames;
    } catch (error) {
      console.error(`❌ Failed to search games with term "${searchTerm}":`, error.message);
      throw new Error(`Error al buscar juegos: ${error.message}`);
    }
  },

  /**
   * Destaca o quita el destacado de un juego
   * @param {number} id - ID del juego
   * @param {boolean} highlighted - true para destacar, false para quitar destacado
   * @returns {Promise<{success: boolean, message: string}>}
   */
  highlightGame: async (id, highlighted) => {
    try {
      if (!id || isNaN(id)) {
        throw new Error('ID de juego inválido');
      }
      
      console.log(`⭐ ${highlighted ? 'Highlighting' : 'Unhighlighting'} game ${id}`);
      const response = await apiClient.patch(`/${id}/highlight?highlighted=${highlighted}`);
      
      const message = highlighted 
        ? 'Juego destacado exitosamente' 
        : 'Juego quitado de destacados exitosamente';
      
      console.log('✅ Game highlight status changed successfully');
      
      return {
        success: true,
        message: message,
        data: response.data
      };
    } catch (error) {
      console.error(`❌ Failed to change highlight status for game ${id}:`, error.message);
      handleNetworkError(error, `cambiar destacado de juego ${id}`);
    }
  },

  /**
   * Obtiene información de configuración y autenticación
   * @returns {Object} Información de configuración
   */
  getConfigInfo: () => {
    return {
      apiUrl: API_URL,
      username: AUTH_USERNAME,
      hasCredentials: !!(AUTH_USERNAME && AUTH_PASSWORD),
      timeout: 15000
    };
  },

  /**
   * Verifica solo la conectividad con el servidor (compatibilidad con versión anterior)
   * @returns {Promise<boolean>} True si la conexión es exitosa
   */
  checkConnection: async () => {
    try {
      const result = await GameService.checkConnectionAndAuth();
      return result.connected && result.authenticated;
    } catch (error) {
      console.error('Connection check failed:', error);
      return false;
    }
  },

  /**
   * Función de utilidad para testear la conexión con diagnóstico detallado
   * @returns {Promise<void>}
   */
  testConnection: async () => {
    console.log('🧪 Testing connection...');
    console.log('⚙️ Configuration:', GameService.getConfigInfo());
    
    const result = await GameService.checkConnectionAndAuth();
    console.log('📊 Test result:', result);
    
    if (result.connected && result.authenticated) {
      console.log('🎉 Connection test passed!');
      
      // Test básico de obtener juegos
      try {
        const games = await GameService.getAllGames();
        console.log(`✅ Successfully fetched ${games.length} games`);
        
        // Test de un juego específico si hay juegos disponibles
        if (games.length > 0) {
          const firstGame = games[0];
          console.log(`🔍 Testing individual game fetch with ID: ${firstGame.id}`);
          const gameDetail = await GameService.getGameById(firstGame.id);
          console.log('✅ Individual game fetch successful');
        }
        
      } catch (error) {
        console.error('❌ Failed to fetch games during test:', error.message);
      }
    } else {
      console.error('❌ Connection test failed:', result.error);
      
      // Sugerencias de diagnóstico
      console.log('🔧 Troubleshooting suggestions:');
      console.log('1. Check if the backend server is running');
      console.log('2. Verify the API URL is correct:', API_URL);
      console.log('3. Check authentication credentials');
      console.log('4. Verify network connectivity');
      console.log('5. Check for CORS issues');
    }
    
    return result;
  }
};

export default GameService;

// Exportar funciones individuales para mayor flexibilidad
export const {
  getAllGames,
  getGameById,
  createGame,
  updateGame,
  changeGameStatus,
  getActiveGames,
  getGamesByCategory,
  searchGames,
  highlightGame,
  checkConnection,
  checkConnectionAndAuth,
  getConfigInfo,
  testConnection
} = GameService;