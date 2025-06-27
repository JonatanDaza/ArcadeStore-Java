import axios from "axios";

// Configuración de la API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8085/api/categories';

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

const CategoryService = {
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
   * Obtiene todas las categorías
   * @returns {Promise<Array>} Lista de categorías
   */
  getAllCategories: async () => {
    try {
      console.log('📋 Fetching all categories...');
      const response = await apiClient.get('/all');
      
      console.log(`✅ Successfully fetched ${response.data?.length || 0} categories`);
      return response.data || [];
    } catch (error) {
      console.error('❌ Failed to fetch categories:', error.message);
      handleNetworkError(error, 'obtener categorías');
    }
  },

  /**
   * Obtiene una categoría por ID
   * @param {number} id - ID de la categoría
   * @returns {Promise<Object>} Categoría encontrada
   */
  getCategoryById: async (id) => {
    try {
      console.log(`🔍 Fetching category with ID: ${id}`);
      const response = await apiClient.get(`/${id}/show`);
      
      console.log('✅ Category fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Failed to fetch category ${id}:`, error.message);
      handleNetworkError(error, `obtener categoría ${id}`);
    }
  },

  /**
   * Crea una nueva categoría
   * @param {Object} categoryData - Datos de la categoría
   * @param {string} categoryData.name - Nombre de la categoría (requerido)
   * @param {string} [categoryData.description] - Descripción de la categoría
   * @param {boolean} [categoryData.active] - Estado activo (default: true)
   * @returns {Promise<Object>} Categoría creada
   */
  createCategory: async (categoryData) => {
    try {
      // Validación básica
      if (!categoryData || typeof categoryData !== 'object') {
        throw new Error('Los datos de la categoría son requeridos');
      }
      
      if (!categoryData.name || categoryData.name.trim() === '') {
        throw new Error('El nombre de la categoría es requerido');
      }

      // Preparar datos con valores por defecto
      const dataToSend = {
        name: categoryData.name.trim(),
        description: categoryData.description || '',
        active: categoryData.active !== undefined ? categoryData.active : true
      };

      console.log('➕ Creating new category:', dataToSend);
      const response = await apiClient.post('/create', dataToSend);
      
      console.log('✅ Category created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to create category:', error.message);
      handleNetworkError(error, 'crear categoría');
    }
  },

  /**
   * Actualiza una categoría existente
   * @param {number} id - ID de la categoría
   * @param {Object} categoryData - Datos actualizados de la categoría
   * @returns {Promise<Object>} Categoría actualizada
   */
  updateCategory: async (id, categoryData) => {
    try {
      // Validación básica
      if (!categoryData || typeof categoryData !== 'object') {
        throw new Error('Los datos de la categoría son requeridos');
      }
      
      if (!categoryData.name || categoryData.name.trim() === '') {
        throw new Error('El nombre de la categoría es requerido');
      }

      const dataToSend = {
        ...categoryData,
        name: categoryData.name.trim()
      };

      console.log(`📝 Updating category ${id}:`, dataToSend);
      const response = await apiClient.put(`/${id}/update`, dataToSend);
      
      console.log('✅ Category updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Failed to update category ${id}:`, error.message);
      handleNetworkError(error, `actualizar categoría ${id}`);
    }
  },

  /**
   * Cambia el estado de una categoría (activar/desactivar)
   * @param {number} id - ID de la categoría
   * @param {boolean} active - true para activar, false para desactivar
   * @returns {Promise<{success: boolean, message: string}>}
   */
  changeCategoryStatus: async (id, active) => {
    try {
      console.log(`🔄 Changing category ${id} status to: ${active ? 'active' : 'inactive'}`);
      const response = await apiClient.patch(`/${id}/status?active=${active}`);
      
      const message = active 
        ? 'Categoría activada exitosamente' 
        : 'Categoría desactivada exitosamente';
      
      console.log('✅ Category status changed successfully');
      
      return {
        success: true,
        message: message
      };
    } catch (error) {
      console.error(`❌ Failed to change category ${id} status:`, error.message);
      
      // Manejo específico para conflictos (409)
      if (error.response?.status === 409) {
        return {
          success: false,
          message: error.response.data || 'No se puede desactivar la categoría porque contiene juegos activos'
        };
      }
      
      handleNetworkError(error, `cambiar estado de categoría ${id}`);
    }
  },

  /**
   * Desactiva una categoría (método legacy - usar changeCategoryStatus)
   * @param {number} id - ID de la categoría
   * @returns {Promise<{success: boolean, message: string}>}
   * @deprecated Usar changeCategoryStatus en su lugar
   */
  deactivateCategory: async (id) => {
    console.warn('⚠️ deactivateCategory is deprecated, use changeCategoryStatus instead');
    return CategoryService.changeCategoryStatus(id, false);
  },

  /**
   * Obtiene solo las categorías activas
   * @returns {Promise<Array>} Lista de categorías activas
   */
  getActiveCategories: async () => {
    try {
      console.log('📋 Fetching active categories...');
      const categories = await CategoryService.getAllCategories();
      const activeCategories = categories.filter(category => category.active === true);
      
      console.log(`✅ Found ${activeCategories.length} active categories out of ${categories.length} total`);
      return activeCategories;
    } catch (error) {
      console.error('❌ Failed to fetch active categories:', error.message);
      throw new Error(`Error al obtener categorías activas: ${error.message}`);
    }
  },

  /**
   * Busca categorías por término (filtro local)
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Promise<Array>} Lista de categorías filtradas
   */
  searchCategories: async (searchTerm) => {
    try {
      if (!searchTerm || searchTerm.trim() === '') {
        return CategoryService.getAllCategories();
      }

      console.log(`🔍 Searching categories with term: "${searchTerm}"`);
      const categories = await CategoryService.getAllCategories();
      
      const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
      console.log(`✅ Found ${filteredCategories.length} categories matching "${searchTerm}"`);
      return filteredCategories;
    } catch (error) {
      console.error(`❌ Failed to search categories with term "${searchTerm}":`, error.message);
      throw new Error(`Error al buscar categorías: ${error.message}`);
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
      const result = await CategoryService.checkConnectionAndAuth();
      return result.connected && result.authenticated;
    } catch (error) {
      console.error('Connection check failed:', error);
      return false;
    }
  },

  /**
   * Función de utilidad para testear la conexión
   * @returns {Promise<void>}
   */
  testConnection: async () => {
    console.log('🧪 Testing connection...');
    console.log('⚙️ Configuration:', CategoryService.getConfigInfo());
    
    const result = await CategoryService.checkConnectionAndAuth();
    console.log('📊 Test result:', result);
    
    if (result.connected && result.authenticated) {
      console.log('🎉 Connection test passed!');
      
      // Test básico de obtener categorías
      try {
        const categories = await CategoryService.getAllCategories();
        console.log(`✅ Successfully fetched ${categories.length} categories`);
      } catch (error) {
        console.error('❌ Failed to fetch categories during test:', error.message);
      }
    } else {
      console.error('❌ Connection test failed:', result.error);
    }
    
    return result;
  }
};

export default CategoryService;

// Exportar funciones individuales para mayor flexibilidad
export const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  changeCategoryStatus,
  deactivateCategory, // deprecated
  getActiveCategories,
  searchCategories,
  checkConnection, // función de compatibilidad
  checkConnectionAndAuth, // función mejorada
  getConfigInfo,
  testConnection
} = CategoryService;