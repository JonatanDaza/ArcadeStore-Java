"use client";
import Header from "app/components/header";
import Footer from "app/components/footer";
import Table from "app/components/Table";
import ActionButton, { ToggleSwitch } from "app/components/ActionButton";
import Sidebar from "app/components/sidebar";
import CategoryService from "app/services/api/categories";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

// Ejecutar diagnóstico
CategoryService.testConnection();
export default function CategoriesPage() {
  // Estados para manejar los datos y la UI
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view');

  // Estados para el formulario
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    active: true
  });

  // Verificar conexión al montar el componente
  useEffect(() => {
    checkConnectionAndLoad();
  }, []);

  // Función para verificar conexión y cargar datos
  const checkConnectionAndLoad = async () => {
    try {
      setLoading(true);
      setConnectionStatus('checking');
      
      // Verificar conexión primero
      const isConnected = await CategoryService.checkConnection();
      
      if (!isConnected) {
        setConnectionStatus('disconnected');
        setError('No se pudo conectar al servidor. Verifica que el backend esté ejecutándose.');
        return;
      }
      
      setConnectionStatus('connected');
      await loadCategories();
    } catch (err) {
      setConnectionStatus('error');
      setError(err.message);
      console.error('Connection error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar todas las categorías
  const loadCategories = async () => {
    try {
      setError(null);
      const data = await CategoryService.getAllCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading categories:', err);
      setCategories([]);
    }
  };

  // Función para alternar el estado de una categoría
  const toggleCategoryStatus = async (categoryId, currentStatus) => {
    try {
      if (currentStatus) {
        const result = await CategoryService.deactivateCategory(categoryId);
        
        if (result.success) {
          setCategories(prev => 
            prev.map(cat => 
              cat.id === categoryId 
                ? { ...cat, active: false }
                : cat
            )
          );
          toast?.success('Categoría desactivada exitosamente');
        } else {
          toast?.error(result.message);
        }
      } else {
        const updatedCategory = await CategoryService.updateCategory(categoryId, {
          ...categories.find(cat => cat.id === categoryId),
          active: true
        });
        
        setCategories(prev => 
          prev.map(cat => 
            cat.id === categoryId 
              ? updatedCategory
              : cat
          )
        );
        toast?.success('Categoría activada exitosamente');
      }
    } catch (err) {
      toast?.error(`Error al cambiar estado: ${err.message}`);
      console.error('Error toggling category status:', err);
    }
  };

  // Función para manejar la visualización de detalles
  const handleViewCategory = (category) => {
    setSelectedCategory(category);
    setModalType('view');
    setShowModal(true);
  };

  // Función para manejar la edición
  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      active: category.active
    });
    setModalType('edit');
    setShowModal(true);
  };

  // Función para crear nueva categoría
  const handleCreateCategory = () => {
    setSelectedCategory(null);
    setFormData({
      name: '',
      description: '',
      active: true
    });
    setModalType('create');
    setShowModal(true);
  };

  // Función para guardar categoría (crear o actualizar)
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    
    try {
      if (modalType === 'create') {
        await CategoryService.createCategory(formData);
        toast?.success('Categoría creada exitosamente');
      } else if (modalType === 'edit') {
        await CategoryService.updateCategory(selectedCategory.id, formData);
        toast?.success('Categoría actualizada exitosamente');
      }
      
      setShowModal(false);
      loadCategories();
    } catch (err) {
      toast?.error(`Error al guardar: ${err.message}`);
      console.error('Error saving category:', err);
    }
  };

  // Función para acciones en cada fila
  function cellAcciones({ row }) {
    const category = row.original;
    
    return (
      <div className="flex gap-2">
        <ActionButton
          type="view"
          title="Ver detalles"
          onClick={() => handleViewCategory(category)}
        />
        <ActionButton
          type="edit"
          title="Editar"
          onClick={() => handleEditCategory(category)}
        />      
        
        <ToggleSwitch
          checked={category.active}
          onChange={() => toggleCategoryStatus(category.id, category.active)}
          title={category.active ? "Desactivar" : "Activar"}
        />
      </div>
    );
  }

  // Configuración de columnas
  const columns = [
    {
      header: "ID",
      accessorKey: "id",
      cell: info => info.getValue(),
    },
    {
      header: "Nombre",
      accessorKey: "name",
      cell: info => info.getValue(),
    },
    {
      header: "Descripción",
      accessorKey: "description",
      cell: info => info.getValue() || 'Sin descripción',
    },
    {
      header: "Estado",
      accessorKey: "active",
      cell: info => (
        info.getValue() ? (
          <span className="inline-block px-4 py-1 text-xs font-semibold rounded-full bg-green-200/80 text-green-800 text-center min-w-[90px]">
            Activo
          </span>
        ) : (
          <span className="inline-block px-4 py-1 text-xs font-semibold rounded-full bg-red-200/80 text-red-700 text-center min-w-[90px]">
            Inactivo
          </span>
        )
      ),
    },
    {
      header: "Fecha Creación",
      accessorKey: "createdAt",
      cell: info => {
        const date = info.getValue();
        return date ? new Date(date).toLocaleDateString('es-ES') : '-';
      },
    },
    {
      header: "Acciones",
      id: "acciones",
      cell: cellAcciones,
    },
  ];

  // Componente de estado de conexión
  const ConnectionStatus = () => {
    const statusConfig = {
      checking: { color: 'bg-yellow-100 border-yellow-400 text-yellow-700', text: 'Verificando conexión...' },
      connected: { color: 'bg-green-100 border-green-400 text-green-700', text: 'Conectado al servidor' },
      disconnected: { color: 'bg-red-100 border-red-400 text-red-700', text: 'Sin conexión al servidor' },
      error: { color: 'bg-red-100 border-red-400 text-red-700', text: 'Error de conexión' }
    };

    const config = statusConfig[connectionStatus];

    return (
      <div className={`${config.color} border px-4 py-3 rounded mb-4`}>
        <div className="flex items-center justify-between">
          <span>{config.text}</span>
          {connectionStatus !== 'connected' && (
            <button
              onClick={checkConnectionAndLoad}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
            >
              Reconectar
            </button>
          )}
        </div>
      </div>
    );
  };

  // Componente Modal
  const Modal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {modalType === 'view' && 'Detalles de Categoría'}
                {modalType === 'edit' && 'Editar Categoría'}
                {modalType === 'create' && 'Nueva Categoría'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {modalType === 'view' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">ID</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCategory?.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCategory?.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Descripción</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCategory?.description || 'Sin descripción'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Estado</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCategory?.active ? 'Activo' : 'Inactivo'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha de Creación</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedCategory?.createdAt ? new Date(selectedCategory.createdAt).toLocaleString('es-ES') : '-'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Última Actualización</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedCategory?.updatedAt ? new Date(selectedCategory.updatedAt).toLocaleString('es-ES') : '-'}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveCategory} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({...formData, active: e.target.checked})}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="active" className="text-sm font-medium text-gray-700">
                    Categoría activa
                  </label>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {modalType === 'create' ? 'Crear' : 'Actualizar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen hero_area">
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 min-w-0 bg-gradient-to-b from-[#06174d] via-black to-[#06174d] p-3 lg:p-5">
          <div className="w-auto h-auto pt-3">
            <div className="flex justify-between items-center mb-4 lg:mb-6">
              <h1 className="text-xl lg:text-2xl font-bold custom_heading">
                Lista de Categorías
              </h1>
              <button
                onClick={handleCreateCategory}
                disabled={connectionStatus !== 'connected'}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + Nueva Categoría
              </button>
            </div>

            {/* Estado de conexión */}
            <ConnectionStatus />
            
            {/* Estados de carga y error */}
            {loading && (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                <span className="ml-3 text-white">Cargando categorías...</span>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <strong>Error:</strong> {error}
                    <br />
                    <small className="text-xs">
                      Posibles soluciones:
                      <br />
                      • Verificar que el backend esté ejecutándose en http://localhost:8085
                      <br />
                      • Revisar la configuración de CORS en el servidor
                      <br />
                      • Verificar que no haya firewall bloqueando la conexión
                    </small>
                  </div>
                  <button
                    onClick={checkConnectionAndLoad}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm ml-4"
                  >
                    Reintentar
                  </button>
                </div>
              </div>
            )}

            {/* Tabla de categorías */}
            {!loading && !error && connectionStatus === 'connected' && (
              <div className="overflow-x-auto rounded-lg shadow-lg">
                <Table 
                  columns={columns} 
                  data={categories}
                  emptyMessage="No hay categorías disponibles"
                />
              </div>
            )}

            {/* Información adicional */}
            {!loading && !error && categories.length > 0 && (
              <div className="mt-4 text-sm text-gray-300">
                Total de categorías: {categories.length} | 
                Activas: {categories.filter(cat => cat.active).length} | 
                Inactivas: {categories.filter(cat => !cat.active).length}
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
      
      {/* Modal */}
      <Modal />
    </div>
  );
}