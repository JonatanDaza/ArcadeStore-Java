"use client";
import Header from "app/components/header";
import Footer from "app/components/footer";
import Table from "app/components/Table";
import ActionButton from "app/components/ActionButton";
import Sidebar from "app/components/sidebar";
import SalesService, { getAllSales } from "app/services/api/sales";
import { useState, useEffect, useCallback } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import ShowModal from "@/components/modalShow";
import { jwtDecode } from 'jwt-decode';

export default function SalesPage() {
  // Estados para manejar los datos y la UI
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [selectedSale, setSelectedSale] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

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

  // Función para cargar todas las ventas
  const loadSales = useCallback(async () => {
    try {
      setError(null);
      const token = localStorage.getItem("authToken");
      if (isTokenExpired(token)) {
        toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem("authToken");
        router.push('/login');
        return;
      }
      const data = await SalesService.getAllSales(token);
      setSales(Array.isArray(data) ? data : []);
    } catch (err) {
      let errorMessage = 'Error desconocido al cargar ventas';
      if (err.message && err.message.includes("Forbidden")) {
        errorMessage = 'Acceso denegado: No tienes permiso para ver las ventas. Por favor, verifica tus credenciales o contacta al administrador.';
        toast.error(errorMessage);
        localStorage.removeItem("authToken");
        router.push('/login');
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setSales([]);
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
      const isConnected = await SalesService.checkConnection(token);

      if (!isConnected) {
        setConnectionStatus('disconnected');
        setError('No se pudo conectar al servidor. Verifica que el backend esté ejecutándose.');
        return;
      }

      setConnectionStatus('connected');
      await loadSales();
    } catch (err) {
      setConnectionStatus('error');
      const errorMessage = err.message || 'Error de conexión desconocido';
      setError(errorMessage);
      console.error('Connection error:', err);
    } finally {
      setLoading(false);
    }
  }, [loadSales, router]);
  useEffect(() => {
    if (!loading && sales.length === 0) {
      toast('No hay ventas disponibles para mostrar', { icon: 'ℹ️' });
    }
  }, [loading, sales]);

  // Verificar conexión al montar el componente
  useEffect(() => {
    checkConnectionAndLoad();
  }, [checkConnectionAndLoad]);

  // Función para manejar la visualización de detalles
  const handleViewSale = useCallback((sale) => {
    setSelectedSale(sale);
    setShowModal(true);
  }, []);

  // Función para cerrar modal
  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setSelectedSale(null);
  }, []);

  // Función para generar y descargar reporte PDF
  const handleGenerateReport = useCallback(async () => {
    if (loading) {
      toast.error('Los datos aún se están cargando. Por favor espera...');
      return;
    }

    try {
      setIsGeneratingReport(true);
      const token = localStorage.getItem("authToken");
      if (isTokenExpired(token)) {
        toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem("authToken");
        router.push('/login');
        return;
      }
      if (!sales || sales.length === 0) {
        toast.error('No se puede generar el PDF porque no existen ventas registradas.');
        return;
      }

      const query = buildFilterQuery(filters);

      const response = await fetch(`http://localhost:8085/api/sales/report/pdf?${query}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
      link.href = url;
      link.download = `reporte-ventas-${dateStr}-${timeStr}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Reporte PDF descargado exitosamente');
    } catch (err) {
      let errorMessage = 'Error desconocido al generar reporte';
      if (err.message?.includes("Forbidden")) {
        errorMessage = 'Acceso denegado: No tienes permiso para generar reportes.';
        toast.error(errorMessage);
        localStorage.removeItem("authToken");
        router.push('/login');
      } else if (err.message) {
        errorMessage = err.message;
      }
      toast.error(`Error al generar reporte: ${errorMessage}`);
      console.error('Error generating report:', err);
    } finally {
      setIsGeneratingReport(false);
    }
  }, [router, loading, sales]);

  const buildFilterQuery = (filters) => {
    const query = new URLSearchParams();
    for (const key in filters) {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        query.append(key, filters[key]);
      }
    }
    return query.toString();
  };

  const [filters, setFilters] = useState({
    active: '',       // "true" o "false"
    username: '',
    gameName: '',
    paymentMethod: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
  });

  // Función para convertir datos a CSV
  const convertToCSV = (data) => {
    if (!data || data.length === 0) return '';

    // Definir headers del CSV
    const headers = [
      'ID',
      'Fecha de Venta',
      'Usuario',
      'Juego',
      'Monto Total',
      'Método de Pago',
      'Fecha Creación',
      'Estado'
    ];

    // Crear filas de datos
    const rows = data.map(sale => [
      sale.id || '',
      sale.saleDate ? new Date(sale.saleDate).toLocaleString('es-ES') : '',
      sale.user ? (sale.user.username || sale.user.name || 'Usuario') : 'Sin usuario',
      sale.game ? (sale.game.name || sale.game.title || 'Juego') : 'Sin juego',
      sale.totalAmount ? formatCurrency(sale.totalAmount) : '$0.00',
      sale.paymentMethod || 'No especificado',
      sale.createdAt ? new Date(sale.createdAt).toLocaleDateString('es-ES') : '',
      sale.active ? 'Activo' : 'Inactivo'
    ]);

    // Combinar headers y filas
    const csvContent = [
      headers.join(','),
      ...rows.map(row =>
        row.map(field =>
          // Escapar campos que contengan comas, comillas o saltos de línea
          typeof field === 'string' && (field.includes(',') || field.includes('"') || field.includes('\n'))
            ? `"${field.replace(/"/g, '""')}"`
            : field
        ).join(',')
      )
    ].join('\n');

    return csvContent;
  };

  // Función para descargar CSV
  const handleDownloadCSV = useCallback(() => {
    try {
      if (!sales || sales.length === 0) {
        toast.error('No hay datos de ventas para exportar');
        return;
      }

      // Convertir datos a CSV
      const csvContent = convertToCSV(sales);

      // Crear blob con BOM para UTF-8 (para acentos)
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], {
        type: 'text/csv;charset=utf-8;'
      });

      // Crear URL temporal
      const url = window.URL.createObjectURL(blob);

      // Crear elemento de descarga
      const link = document.createElement('a');
      link.href = url;

      // Generar nombre del archivo con fecha actual
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
      link.download = `ventas-tabla-${dateStr}-${timeStr}.csv`;

      // Descargar
      document.body.appendChild(link);
      link.click();

      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`CSV descargado con ${sales.length} registros`);
    } catch (err) {
      toast.error('Error al generar archivo CSV');
      console.error('Error generating CSV:', err);
    }
  }, [sales]);

  const handleDownloadSalePdf = useCallback(async (saleId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (isTokenExpired(token)) {
        toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem("authToken");
        router.push('/login');
        return;
      }

      const response = await fetch(`http://localhost:8085/api/sales/report/pdf/${saleId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          toast.error(`La venta con ID ${saleId} no fue encontrada`);
        } else if (response.status === 403) {
          toast.error("No tienes permisos para generar el reporte");
          localStorage.removeItem("authToken");
          router.push("/login");
        } else {
          toast.error(`Error ${response.status}: ${response.statusText}`);
        }
        return;
      }

      const contentType = response.headers.get("Content-Type");
      const blob = await response.blob();

      // Validación: si NO es PDF, lee el texto y lanza error
      if (!response.ok || !contentType?.includes("application/pdf")) {
        const errorText = await blob.text();
        console.error("Error al descargar PDF:", errorText);
        toast.error("No se pudo generar el PDF: " + errorText);
        return;
      }

      // Crear enlace de descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
      link.href = url;
      link.download = `reporte-venta-${saleId}-${dateStr}-${timeStr}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Reporte descargado exitosamente");

      link.href = url;
      link.download = `reporte-venta-${saleId}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`Reporte PDF de la venta ${saleId} descargado`);
    } catch (err) {
      toast.error("Error al generar el reporte individual");
      console.error("Error generando PDF individual:", err);
    }
  }, [router]);
  // Función para formatear moneda
  const formatCurrency = (amount) => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  // Función para acciones en cada fila
  const cellAcciones = useCallback(({ row }) => {
    const sale = row.original;

    return (
      <div className="flex gap-2">
        <ActionButton
          type="view"
          title="Ver detalles"
          onClick={() => handleViewSale(sale)}
        />
        <button
          onClick={() => handleDownloadSalePdf(sale.id)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-xs"
          title="Descargar PDF"
        >
          📄 PDF
        </button>
      </div>
    );
  }, [handleViewSale, handleDownloadSalePdf]);

  // Configuración de columnas
  const columns = [
    {
      header: "ID",
      accessorKey: "id",
      cell: info => info.getValue() || '-',
    },
    {
      header: "Fecha de Venta",
      accessorKey: "saleDate",
      cell: info => {
        const date = info.getValue();
        try {
          return date ? new Date(date).toLocaleString('es-ES') : '-';
        } catch {
          return '-';
        }
      },
    },
    {
      header: "Usuario",
      accessorKey: "user",
      cell: info => {
        const user = info.getValue();
        return user ? user.username || user.name || 'Usuario' : 'Sin usuario';
      },
    },
    {
      header: "Juego",
      accessorKey: "game",
      cell: info => {
        const game = info.getValue();
        return game ? game.name || game.title || 'Juego' : 'Sin juego';
      },
    },
    {
      header: "Monto Total",
      accessorKey: "totalAmount",
      cell: info => formatCurrency(info.getValue()),
    },
    {
      header: "Método de Pago",
      accessorKey: "paymentMethod",
      cell: info => {
        const method = info.getValue();
        return method || 'No especificado';
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

  // Campos para mostrar en el modal de detalles
  const showFields = [
    {
      name: 'id',
      label: 'ID de Venta',
      type: 'text'
    },
    {
      name: 'saleDate',
      label: 'Fecha de Venta',
      type: 'datetime'
    },
    {
      name: 'user',
      label: 'Usuario',
      type: 'object',
      displayKey: 'username',
      fallbackKey: 'name'
    },
    {
      name: 'game',
      label: 'Juego',
      type: 'object',
      displayKey: 'name',
      fallbackKey: 'title'
    },
    {
      name: 'totalAmount',
      label: 'Monto Total',
      type: 'currency'
    },
    {
      name: 'paymentMethod',
      label: 'Método de Pago',
      type: 'text'
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

  // Estadísticas de ventas
  const salesStats = {
    total: sales.length,
    active: sales.filter(sale => sale.active).length,
    inactive: sales.filter(sale => !sale.active).length,
    totalRevenue: sales.reduce((sum, sale) => sum + (parseFloat(sale.totalAmount) || 0), 0),
    averageSale: sales.length > 0 ? sales.reduce((sum, sale) => sum + (parseFloat(sale.totalAmount) || 0), 0) / sales.length : 0,
    paymentMethods: [...new Set(sales.map(sale => sale.paymentMethod).filter(Boolean))].length
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 lg:mb-6">
              <h1 className="text-xl lg:text-2xl font-bold custom_heading">
                Lista de Ventas
              </h1>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleDownloadCSV}
                  disabled={loading || !sales.length}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  📄 Descargar Tabla (CSV)
                </button>
                {!loading && sales.length > 0 && (
                  <button
                    onClick={handleGenerateReport}
                    disabled={isGeneratingReport}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                  >
                    {isGeneratingReport ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Generando...
                      </>
                    ) : (
                      <>
                        📋 Generar Reporte PDF
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Estados de carga y error */}
            {loading && (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                <span className="ml-3 text-white">Cargando ventas...</span>
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

            {/* Tabla de ventas */}
            {!loading && !error && connectionStatus === 'connected' && (
              <div className="overflow-x-auto rounded-lg shadow-lg">
                <Table
                  columns={columns}
                  data={sales}
                  emptyMessage="No hay ventas disponibles"
                  showAddButton={false}
                />
              </div>
            )}

            {/* Información adicional y estadísticas */}
            {!loading && !error && sales.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-1">
                <div className="mt-4 text-sm text-gray-300">
                  <strong>Estadísticas Generales:</strong><br />
                  Total de ventas: {salesStats.total}<br />
                </div>
                <div className="mt-4 text-sm text-gray-300">
                  <strong>Ingresos:</strong><br />
                  Total: {formatCurrency(salesStats.totalRevenue)}<br />
                  Promedio por venta: {formatCurrency(salesStats.averageSale)}
                </div>
                <div className="mt-4 text-sm text-gray-300">
                  <strong>Métodos de Pago:</strong><br />
                  Diferentes métodos: {salesStats.paymentMethods}<br />
                  Más común: {sales.length > 0 ?
                    Object.entries(
                      sales.reduce((acc, sale) => {
                        const method = sale.paymentMethod || 'No especificado';
                        acc[method] = (acc[method] || 0) + 1;
                        return acc;
                      }, {})
                    ).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A'
                    : 'N/A'
                  }
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />

      {/* Modal de detalles */}
      {showModal && (
        <ShowModal
          showModal={showModal}
          onClose={handleCloseModal}
          title="Detalles de la Venta"
          data={selectedSale}
          fields={showFields}
        />
      )}
    </div>
  );
}