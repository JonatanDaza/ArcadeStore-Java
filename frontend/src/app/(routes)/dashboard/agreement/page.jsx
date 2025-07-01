"use client";
import Header from "app/components/header";
import Footer from "app/components/footer";
import Table from "app/components/Table";
import ActionButton, { ToggleSwitch } from "app/components/ActionButton";
import Sidebar from "app/components/sidebar";
import AgreementService from "app/services/api/agreements";
import CreateModal from "app/components/modalCreate";
import { useState, useEffect, useCallback } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import ShowModal from "@/components/modalShow";
import { jwtDecode } from 'jwt-decode';

export default function AgreementsPage() {
  // Estados para manejar los datos y la UI
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [selectedAgreement, setSelectedAgreement] = useState(null);
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

  // Función para cargar todos los acuerdos
  const loadAgreements = useCallback(async () => {
    try {
      setError(null);
      const token = localStorage.getItem("authToken");
      if (isTokenExpired(token)) {
        toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem("authToken");
        router.push('/login');
        return;
      }
      const data = await AgreementService.getAllAgreements(token);
      setAgreements(Array.isArray(data) ? data : []);
    } catch (err) {
      let errorMessage = 'Error desconocido al cargar acuerdos';
      if (err.message && err.message.includes("Forbidden")) {
        errorMessage = 'Acceso denegado: No tienes permiso para ver los acuerdos. Por favor, verifica tus credenciales o contacta al administrador.';
        toast.error(errorMessage);
        localStorage.removeItem("authToken");
        router.push('/login');
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setAgreements([]);
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
      const isConnected = await AgreementService.checkConnection(token);

      if (!isConnected) {
        setConnectionStatus('disconnected');
        setError('No se pudo conectar al servidor. Verifica que el backend esté ejecutándose.');
        return;
      }

      setConnectionStatus('connected');
      await loadAgreements();
    } catch (err) {
      setConnectionStatus('error');
      const errorMessage = err.message || 'Error de conexión desconocido';
      setError(errorMessage);
      console.error('Connection error:', err);
    } finally {
      setLoading(false);
    }
  }, [loadAgreements, router]);

  // Verificar conexión al montar el componente
  useEffect(() => {
    checkConnectionAndLoad();
  }, [checkConnectionAndLoad]);

  // Función para alternar el estado de un acuerdo
  const toggleAgreementStatus = useCallback(async (agreementId, currentStatus) => {
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
          await AgreementService.deactivateAgreement(agreementId, token);
          setAgreements(prev =>
            prev.map(agreement =>
              agreement.id === agreementId
                ? { ...agreement, active: false }
                : agreement
            )
          );
          toast?.success('Acuerdo desactivado exitosamente');
        } catch (err) {
          toast?.error('Error al desactivar acuerdo, existe un juego asociado a este acuerdo.');
        }
      } else {
        try {
          await AgreementService.activateAgreement(agreementId, token);
          setAgreements(prev =>
            prev.map(agreement =>
              agreement.id === agreementId
                ? { ...agreement, active: true }
                : agreement
            )
          );
          toast?.success('Acuerdo activado exitosamente');
        } catch (err) {
          toast?.error('Error al activar acuerdo');
        }
      }
    } catch (err) {
      let errorMessage = 'Error desconocido al cambiar estado';
      if (err.message && err.message.includes("Forbidden")) {
        errorMessage = 'Acceso denegado: No tienes permiso para cambiar el estado de acuerdos.';
        toast.error(errorMessage);
        localStorage.removeItem("authToken");
        router.push('/login');
      } else if (err.message) {
        errorMessage = err.message;
      }
      toast?.error(`Error al cambiar estado: ${errorMessage}`);
      console.error('Error toggling agreement status:', err);
    }
  }, [router]);

  // Función para manejar la visualización de detalles
  const handleViewAgreement = useCallback((agreement) => {
    setSelectedAgreement(agreement);
    setModalType('view');
    setShowModal(true);
  }, []);

  // Función para manejar la edición
  const handleEditAgreement = useCallback((agreement) => {
    setSelectedAgreement(agreement);
    setModalType('edit');
    setShowModal(true);
  }, []);

  // Función para crear nuevo acuerdo
  const handleCreateAgreement = useCallback(() => {
    setSelectedAgreement(null);
    setModalType('create');
    setShowModal(true);
  }, []);

  // Función para cerrar modal
  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setSelectedAgreement(null);
    setIsSubmitting(false);
  }, []);

  // Función para guardar acuerdo (crear o actualizar)
  const handleSaveAgreement = useCallback(async (agreementData) => {
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
        await AgreementService.createAgreement(agreementData, token);
        toast?.success('Acuerdo creado exitosamente');
      } else if (modalType === 'edit' && selectedAgreement) {
        await AgreementService.updateAgreement(selectedAgreement.id, agreementData, token);
        toast?.success('Acuerdo actualizado exitosamente');
      }

      handleCloseModal();
      await loadAgreements();
    } catch (err) {
      let errorMessage = 'Error desconocido al guardar';
      if (err.message && err.message.includes("Forbidden")) {
        errorMessage = 'Acceso denegado: No tienes permiso para ' + (modalType === 'create' ? 'crear' : 'actualizar') + ' acuerdos.';
        toast.error(errorMessage);
        localStorage.removeItem("authToken");
        router.push('/login');
      } else if (err.message) {
        errorMessage = err.message;
      }
      toast?.error(`Error al guardar: ${errorMessage}`);
      console.error('Error saving agreement:', err);
      throw err; // Re-throw to keep modal open on error
    } finally {
      setIsSubmitting(false);
    }
  }, [modalType, selectedAgreement, handleCloseModal, loadAgreements, router]);

  // Función para acciones en cada fila
  const cellAcciones = useCallback(({ row }) => {
    const agreement = row.original;

    return (
      <div className="flex gap-2">
        <ActionButton
          type="view"
          title="Ver detalles"
          onClick={() => handleViewAgreement(agreement)}
        />
        <ActionButton
          type="edit"
          title="Editar"
          onClick={() => handleEditAgreement(agreement)}
        />

        <ToggleSwitch
          checked={Boolean(agreement.active)}
          onChange={() => toggleAgreementStatus(agreement.id, agreement.active)}
          title={agreement.active ? "Desactivar" : "Activar"}
        />
      </div>
    );
  }, [handleViewAgreement, handleEditAgreement, toggleAgreementStatus]);

  // Configuración de columnas
  const columns = [
    {
      header: "ID",
      accessorKey: "id",
      cell: info => info.getValue() || '-',
    },
    {
      header: "Empresa",
      accessorKey: "companyName",
      cell: info => info.getValue() || 'Sin empresa',
    },
    {
      header: "Detalles",
      accessorKey: "details",
      cell: info => {
        const details = info.getValue() || 'Sin detalles';
        return details.length > 50 ? `${details.substring(0, 50)}...` : details;
      },
    },
    {
      header: "Fecha Inicio",
      accessorKey: "startDate",
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
      header: "Fecha Fin",
      accessorKey: "endDate",
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
      header: "Acciones",
      id: "acciones",
      cell: cellAcciones,
    },
  ];

  // Configuración de campos para el modal universal
  const getModalFields = () => {
    return [
      {
        name: 'companyName',
        label: 'Nombre de la Empresa',
        type: 'text',
        required: true,
        placeholder: 'Ingrese el nombre de la empresa',
        minLength: 2,
        maxLength: 200,
        errorMessage: 'El nombre de la empresa es requerido',
        helpText: 'Nombre completo de la empresa o entidad'
      },
      {
        name: 'details',
        label: 'Detalles del Acuerdo',
        type: 'textarea',
        required: true,
        placeholder: 'Ingrese los detalles del acuerdo',
        maxLength: 100,
        rows: 3,
        errorMessage: 'Los detalles del acuerdo son requeridos',
        helpText: 'Descripción breve del acuerdo (máximo 100 caracteres)'
      },
      {
        name: 'startDate',
        label: 'Fecha de Inicio',
        type: 'datetime-local',
        required: true,
        errorMessage: 'La fecha de inicio es requerida',
        helpText: 'Fecha y hora de inicio del acuerdo'
      },
      {
        name: 'endDate',
        label: 'Fecha de Fin',
        type: 'datetime-local',
        required: false,
        helpText: 'Fecha y hora de finalización del acuerdo (opcional)'
      },
      {
        name: 'active',
        label: 'Acuerdo activo',
        type: 'checkbox',
        required: false,
        defaultValue: true
      }
    ];
  };

  const showFields = [
    {
      name: 'companyName',
      label: 'Nombre de la Empresa',
      type: 'text'
    },
    {
      name: 'details',
      label: 'Detalles del Acuerdo',
      type: 'textarea',
      fullWidth: true,
      maxDisplayLength: 100
    },
    {
      name: 'startDate',
      label: 'Fecha de Inicio',
      type: 'datetime'
    },
    {
      name: 'endDate',
      label: 'Fecha de Fin',
      type: 'datetime'
    },
    {
      name: 'createdAt',
      label: 'Fecha de Creación',
      type: 'datetime'
    },
    {
      name: 'updatedAt',
      label: 'Última Actualización',
      type: 'datetime'
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

  // Estadísticas de acuerdos
  const agreementStats = {
    total: agreements.length,
    active: agreements.filter(agreement => agreement.active).length,
    inactive: agreements.filter(agreement => !agreement.active).length,
    withEndDate: agreements.filter(agreement => agreement.endDate).length,
    withoutEndDate: agreements.filter(agreement => !agreement.endDate).length
  };

  return (
    <div className="flex flex-col min-h-screen hero_area">
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <Toaster
          position="top-right"
          containerStyle={{ top: '8rem' }}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />
        <main className="flex-1 min-w-0 bg-gradient-to-b from-[#06174d] via-black to-[#06174d] p-3 lg:p-5">
          <div className="w-auto h-auto pt-3">
            <div className="flex justify-between items-center mb-4 lg:mb-6">
              <h1 className="text-xl lg:text-2xl font-bold custom_heading">
                Lista de Acuerdos
              </h1>
            </div>

            {/* Estados de carga y error */}
            {loading && (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                <span className="ml-3 text-white">Cargando acuerdos...</span>
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

            {/* Tabla de acuerdos */}
            {!loading && !error && connectionStatus === 'connected' && (
              <div className="overflow-x-auto rounded-lg shadow-lg">
                <Table
                  columns={columns}
                  data={agreements}
                  emptyMessage="No hay acuerdos disponibles"
                  showAddButton={true}
                  onAdd={handleCreateAgreement}
                />
              </div>
            )}

            {/* Información adicional y estadísticas */}
            {!loading && !error && agreements.length > 0 && (
              <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="text-sm text-gray-300">
                  <strong>Estadísticas Generales:</strong><br />
                  Total de acuerdos: {agreementStats.total} |
                  Activos: {agreementStats.active} |
                  Inactivos: {agreementStats.inactive}
                </div>
                <div className="text-sm text-gray-300">
                  <strong>Fechas de Finalización:</strong><br />
                  Con fecha fin: {agreementStats.withEndDate} |
                  Sin fecha fin: {agreementStats.withoutEndDate}
                </div>
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
          onSave={handleSaveAgreement}
          title={modalType === 'create' ? 'Nuevo Acuerdo' : 'Editar Acuerdo'}
          fields={getModalFields()}
          initialData={selectedAgreement || {}}
        />
      )}
      {showModal && modalType === 'view' && (
        <ShowModal
          showModal={showModal}
          onClose={handleCloseModal}
          title="Detalles del Acuerdo"
          data={selectedAgreement}
          fields={showFields}
        />
      )}
    </div>
  );
}