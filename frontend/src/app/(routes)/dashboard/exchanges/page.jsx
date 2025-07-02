"use client";
import { useState, useEffect, useCallback } from "react";
import Header from "app/components/header";
import Footer from "app/components/footer";
import Table from "app/components/Table";
import { HiOutlineDocumentText } from "react-icons/hi2";
import Sidebar from "app/components/sidebar";
import { toast } from "react-hot-toast";
import ExchangeService from "@/services/api/exchangeService";
import { Toaster } from "react-hot-toast";

// Botón PDF solo icono + texto
function ButtonPDF({ onClick }) {
  return (
    <button
      className="flex items-center gap-2 border border-blue-500 text-blue-500 px-3 py-1 rounded transition hover:bg-blue-500 hover:text-white font-semibold text-xs"
      onClick={onClick}
    >
      <HiOutlineDocumentText size={18} />
      PDF
    </button>
  );
}

// Acciones de la tabla
function cellAcciones({ row }) {
  const exchange = row.original;

  return (
    <ButtonPDF
      onClick={async () => {
        try {
          const token = localStorage.getItem("authToken");
          await ExchangeService.downloadExchangeReport(row.original.id, token);
          toast.success("PDF generado correctamente");
        } catch (err) {
          toast.error(err.message || "Error generando PDF");
        }
      }}
    />
  );
}


// Columnas para intercambios
const columns = [
  {
    header: "ID",
    accessorKey: "id",
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
    header: "Juego Solicitado",
    accessorKey: "requestedGameTitle",
  },
  {
    header: "Juego Ofrecido",
    accessorKey: "offeredGameTitle",
  },
  {
    header: "Fecha",
    accessorKey: "exchangeDate",
    cell: (info) => {
      const date = info.getValue();
      return date ? new Date(date).toLocaleString('es-CO') : 'N/A';
    },
  },
  {
    header: "Costo Adicional",
    accessorKey: "additionalCost",
    cell: (info) => {
      const cost = info.getValue();
      return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(cost);
    },
  },
  {
    header: "Estado",
    accessorKey: "status",
  },
  {
    header: "Acciones",
    id: "acciones",
    cell: cellAcciones,
  },
  //   {
  //   header: "ID",
  //   accessorKey: "id",
  //   cell: info => info.getValue() || '-',
  // },
  // {
  //   header: "Fecha de Venta",
  //   accessorKey: "saleDate",
  //   cell: info => {
  //     const date = info.getValue();
  //     try {
  //       return date ? new Date(date).toLocaleString('es-ES') : '-';
  //     } catch {
  //       return '-';
  //     }
  //   },
  // },
  // {
  //   header: "Usuario",
  //   accessorKey: "user",
  //   cell: info => {
  //     const user = info.getValue();
  //     return user ? user.username || user.name || 'Usuario' : 'Sin usuario';
  //   },
  // },
  // {
  //   header: "Juego",
  //   accessorKey: "game",
  //   cell: info => {
  //     const game = info.getValue();
  //     return game ? game.name || game.title || 'Juego' : 'Sin juego';
  //   },
  // },
  // {
  //   header: "Monto Total",
  //   accessorKey: "totalAmount",
  //   cell: info => formatCurrency(info.getValue()),
  // },
  // {
  //   header: "Método de Pago",
  //   accessorKey: "paymentMethod",
  //   cell: info => {
  //     const method = info.getValue();
  //     return method || 'No especificado';
  //   },
  // },
  // {
  //   header: "Fecha Creación",
  //   accessorKey: "createdAt",
  //   cell: info => {
  //     const date = info.getValue();
  //     try {
  //       return date ? new Date(date).toLocaleDateString('es-ES') : '-';
  //     } catch {
  //       return '-';
  //     }
  //   },
  // },
  // {
  //   header: "Estado",
  //   accessorKey: "active",
  //   cell: info => (
  //     info.getValue() ? (
  //       <span className="inline-block px-4 py-1 text-xs font-semibold rounded-full bg-green-200/80 text-green-800 text-center min-w-[90px]">
  //         Activo
  //       </span>
  //     ) : (
  //       <span className="inline-block px-4 py-1 text-xs font-semibold rounded-full bg-red-200/80 text-red-700 text-center min-w-[90px]">
  //         Inactivo
  //       </span>
  //     )
  //   ),
  // },
  // {
  //   header: "Acciones",
  //   id: "acciones",
  //   cell: cellAcciones,
  // },
];

export default function ExchangesPage() {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExchanges = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("No estás autenticado. Redirigiendo al login...");
        // Opcional: redirigir al login
        // window.location.href = '/login';
        setLoading(false);
        return;
      }
      const data = await ExchangeService.getAllExchanges(token);
      setExchanges(data);
    } catch (err) {
      const errorMessage = err.message || "Error al cargar los intercambios.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExchanges();
  }, [fetchExchanges]);

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
          <div
            className="w-auto h-auto pt-3"
          >
            <h1 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6 custom_heading">
              Lista de Intercambios
            </h1>
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                <span className="ml-4 text-white">Cargando intercambios...</span>
              </div>
            ) : error ? (
              <div className="text-center p-8 bg-red-900/50 text-red-300 rounded-lg">
                <p><strong>Error:</strong> {error}</p>
                <button onClick={fetchExchanges} className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">
                  Reintentar
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg shadow-lg">
                <Table columns={columns} data={exchanges} />
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}