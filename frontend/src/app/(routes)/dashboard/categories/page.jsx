"use client";
import Header from "app/components/header";
import Footer from "app/components/footer";
import Table from "app/components/Table";
import ActionButton, { ToggleSwitch } from "app/components/ActionButton";
import Sidebar from "app/components/sidebar";
import CategoryService, { getAllCategories } from "app/services/api/categories";
import CreateModal from "app/components/modalCreate";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import ShowModal from "@/components/modalShow";
import { jwtDecode } from 'jwt-decode';

export default function CategoriesPage() {
  // Estados para manejar los datos y la UI
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  // Función para verificar si el token está expirado
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  };

  // Función para cargar todas las categorías
  const loadCategories = useCallback(async () => {
    try {
      setError(null);
      const token = localStorage.getItem("authToken");
      if (isTokenExpired(token)) {
        toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem("authToken");
        router.push('/login');
        return;
      }
      const data = await CategoryService.getAllCategories(token);
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      let errorMessage = 'Error desconocido al cargar categorías';
      if (err.message && err.message.includes("Forbidden")) {
        errorMessage = 'Acceso denegado: No tienes permiso para ver las categorías. Por favor, verifica tus credenciales o contacta al administrador.';
        toast.error(errorMessage);
        localStorage.removeItem("authToken");
        router.push('/login');
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setCategories([]);
    }
  }, [router]);

  // Función para verificar conexión y cargar datos
  const checkConnectionAndLoad = useCallback(async () => {
    try {
      setLoading(true);
      setConnectionStatus('checking');
      setError(null);

      const token = localStorage.getItem("authToken");
      if (isTokenExpired(token)) {
        toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem("authToken");
        router.push('/login');
        return;
      }
      const isConnected = await CategoryService.checkConnection(token);

      if (!isConnected) {
        setConnectionStatus('disconnected');
        setError('No se pudo conectar al servidor. Verifica que el backend esté ejecutándose.');
        return;
      }

      setConnectionStatus('connected');
      await loadCategories();
    } catch (err) {
      setConnectionStatus('error');
      const errorMessage = err.message || 'Error de conexión desconocido';
      setError(errorMessage);
      console.error('Connection error:', err);
    } finally {
      setLoading(false);
    }
  }, [loadCategories, router]);

  // Verificar conexión al montar el componente
  useEffect(() => {
    checkConnectionAndLoad();
  }, [checkConnectionAndLoad]);

  // Función para alternar el estado de una categoría
  const toggleCategoryStatus = useCallback(async (categoryId, currentStatus) => {
    try {
      setError(null);
      const token = localStorage.getItem("authToken");
      if (isTokenExpired(token)) {
        toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem("authToken");
        router.push('/login');
        return;
      }

      if (currentStatus) {
        try {
          await CategoryService.deactivateCategory(categoryId, token);
          setCategories(prev =>
            prev.map(cat =>
              cat.id === categoryId
                ? { ...cat, active: false }
                : cat
            )
          );
          toast?.success('Categoría desactivada exitosamente');
        } catch (err) {
          toast?.error('Error al desactivar categoría');
        }
      } else {
        try {
          await CategoryService.activateCategory(categoryId, token);
          setCategories(prev =>
            prev.map(cat =>
              cat.id === categoryId
                ? { ...cat, active: true }
                : cat
            )
          );
          toast?.success('Categoría activada exitosamente');
        } catch (err) {
          toast?.error('Error al activar categoría');
        }
      }
    } catch (err) {
      let errorMessage = 'Error desconocido al cambiar estado';
      if (err.message && err.message.includes("Forbidden")) {
        errorMessage = 'Acceso denegado: No tienes permiso para cambiar el estado de categorías.';
        toast.error(errorMessage);
        localStorage.removeItem("authToken");
        router.push('/login');
      } else if (err.message) {
        errorMessage = err.message;
      }
      toast?.error(`Error al cambiar estado: ${errorMessage}`);
      console.error('Error toggling category status:', err);
    }
  }, [router]);

  // Función para manejar la visualización de detalles
  const handleViewCategory = useCallback((category) => {
    setSelectedCategory(category);
    setModalType('view');
    setShowModal(true);
  }, []);

  // Función para manejar la edición
  const handleEditCategory = useCallback((category) => {
    setSelectedCategory(category);
    setModalType('edit');
    setShowModal(true);
  }, []);

  // Función para crear nueva categoría
  const handleCreateCategory = useCallback(() => {
    setSelectedCategory(null);
    setModalType('create');
    setShowModal(true);
  }, []);

  // Función para cerrar modal
  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setSelectedCategory(null);
    setIsSubmitting(false);
  }, []);

  // Función para guardar categoría (crear o actualizar)
  const handleSaveCategory = useCallback(async (categoryData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const token = localStorage.getItem("authToken");
      if (isTokenExpired(token)) {
        toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem("authToken");
        router.push('/login');
        return;
      }

      if (modalType === 'create') {
        await CategoryService.createCategory(categoryData, token);
        toast?.success('Categoría creada exitosamente');
      } else if (modalType === 'edit' && selectedCategory) {
        await CategoryService.updateCategory(selectedCategory.id, categoryData, token);
        toast?.success('Categoría actualizada exitosamente');
      }

      handleCloseModal();
      await loadCategories();
    } catch (err) {
      let errorMessage = 'Error desconocido al guardar';
      if (err.message && err.message.includes("Forbidden")) {
        errorMessage = 'Acceso denegado: No tienes permiso para ' + (modalType === 'create' ? 'crear' : 'actualizar') + ' categorías.';
        toast.error(errorMessage);
        localStorage.removeItem("authToken");
        router.push('/login');
      } else if (err.message) {
        errorMessage = err.message;
      }
      toast?.error(`Error al guardar: ${errorMessage}`);
      console.error('Error saving category:', err);
      throw err; // Re-throw to keep modal open on error
    } finally {
      setIsSubmitting(false);
    }
  }, [modalType, selectedCategory, handleCloseModal, loadCategories, router]);

  // Función para acciones en cada fila
  const cellAcciones = useCallback(({ row }) => {
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
          checked={Boolean(category.active)}
          onChange={() => toggleCategoryStatus(category.id, category.active)}
          title={category.active ? "Desactivar" : "Activar"}
        />
      </div>
    );
  }, [handleViewCategory, handleEditCategory, toggleCategoryStatus]);

  // Configuración de columnas
  const columns = [
    {
      header: "ID",
      accessorKey: "id",
      cell: info => info.getValue() || '-',
    },
    {
      header: "Nombre",
      accessorKey: "name",
      cell: info => info.getValue() || 'Sin nombre',
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
        try {
          return date ? new Date(date).toLocaleDateString('es-ES') : '-';
        } catch {
          return '-';
        }
      },
    },
    {
      header: "Acciones",
      id: "acciones",
      cell: cellAcciones,
    },
  ];

  // Configuración de campos para el modal universal
  const getModalFields = () => {
    return [
      {
        name: 'name',
        label: 'Nombre',
        type: 'text',
        required: true,
        placeholder: 'Ingrese el nombre de la categoría',
        minLength: 2,
        maxLength: 100,
        errorMessage: 'El nombre es requerido',
        helpText: 'Mínimo 2 caracteres, máximo 100'
      },
      {
        name: 'description',
        label: 'Descripción',
        type: 'textarea',
        required: false,
        placeholder: 'Ingrese una descripción opcional',
        maxLength: 500,
        rows: 4,
        helpText: 'Descripción opcional de la categoría (máximo 500 caracteres)'
      },
      {
        name: 'active',
        label: 'Categoría activa',
        type: 'checkbox',
        required: false,
        defaultValue: true
      }
    ];
  };
  const showFields = [
    {
      name: 'name',
      label: 'Nombre',
      type: 'text'
    },
    {
      name: 'description',
      label: 'Descripción',
      type: 'textarea',
      fullWidth: true,
      maxDisplayLength: 100
    },
    {
      name: 'active',
      label: 'Estado',
      type: 'boolean',
      trueText: 'Activo',
      falseText: 'Inactivo'
    },
  ];
  // Componente de estado de conexión
  const ConnectionStatus = () => {
    const statusConfig = {
      checking: {
        color: 'bg-yellow-100 border-yellow-400 text-yellow-700',
        text: 'Verificando conexión...'
      },
      connected: {
        color: 'bg-green-100 border-green-400 text-green-700',
        text: 'Conectado al servidor'
      },
      disconnected: {
        color: 'bg-red-100 border-red-400 text-red-700',
        text: 'Sin conexión al servidor'
      },
      error: {
        color: 'bg-red-100 border-red-400 text-red-700',
        text: 'Error de conexión'
      }
    };

    const config = statusConfig[connectionStatus] || statusConfig.error;

    return (
      <div className={`${config.color} border px-4 py-3 rounded mb-4`}>
        <div className="flex items-center justify-between">
          <span>{config.text}</span>
          {connectionStatus !== 'connected' && (
            <button
              onClick={checkConnectionAndLoad}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Conectando...' : 'Reconectar'}
            </button>
          )}
        </div>
      </div>
    );
  };

  // Estadísticas de categorías
  const categoryStats = {
    total: categories.length,
    active: categories.filter(cat => cat.active).length,
    inactive: categories.filter(cat => !cat.active).length
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
            </div>

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
                    <small className="text-xs mt-2 block">
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
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm ml-4 disabled:opacity-50"
                  >
                    {loading ? 'Cargando...' : 'Reintentar'}
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
                  showAddButton={true}
                  onAdd={handleCreateCategory}
                />
              </div>
            )}

            {/* Información adicional */}
            {!loading && !error && categories.length > 0 && (
              <div className="mt-4 text-sm text-gray-300">
                Total de categorías: {categoryStats.total} |
                Activas: {categoryStats.active} |
                Inactivas: {categoryStats.inactive}
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />

      {/* Modal Universal */}
      {showModal && (modalType === 'create' || modalType === 'edit') && (
        <CreateModal
          showModal={showModal}
          onClose={handleCloseModal}
          onSave={handleSaveCategory}
          title={modalType === 'create' ? 'Nueva Categoría' : 'Editar Categoría'}
          fields={getModalFields()}
          initialData={selectedCategory || {}}
        />
      )}
      {showModal && modalType === 'view' && (
        <ShowModal
          showModal={showModal}
          onClose={handleCloseModal}
          title="Detalles de la Categoría"
          data={selectedCategory}
          fields={showFields}
        />
      )}
    </div>
  );
}
