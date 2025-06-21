"use client";
import Header from "app/components/header";
import Footer from "app/components/footer";
import Table from "app/components/Table";
import { HiOutlineDocumentText } from "react-icons/hi2";
import Sidebar from "app/components/sidebar";

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
  return (
    <ButtonPDF
      onClick={() => {
        // lógica para descargar/ver PDF
      }}
    />
  );
}

// Columnas para intercambios
const columns = [
  {
    header: "ID",
    accessorKey: "id",
    cell: info => info.getValue(),
  },
  {
    header: "Usuario",
    accessorKey: "usuario",
    cell: info => info.getValue(),
  },
  {
    header: "Juego Solicitado",
    accessorKey: "juegoSolicitado",
    cell: info => info.getValue(),
  },
  {
    header: "Juego Ofrecido",
    accessorKey: "juegoOfrecido",
    cell: info => info.getValue(),
  },
  {
    header: "Fecha",
    accessorKey: "fecha",
    cell: info => info.getValue(),
  },
  {
    header: "Estado",
    accessorKey: "estado",
    cell: info => info.getValue(),
  },
  {
    header: "Acciones",
    id: "acciones",
    cell: cellAcciones,
  },
];

// Datos simulados
const data = [
  {
    id: 1,
    usuario: "jhorman Calderon",
    juegoSolicitado: "Call of duty: Black ops 6",
    juegoOfrecido: "Dragon ball Sparking Zero",
    fecha: "2025-04-13",
    estado: "Completado",
  },
  // Puedes agregar más datos de prueba aquí
];

export default function ExchangesPage() {
  return (
    <div className="flex flex-col min-h-screen hero_area">
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 min-w-0 bg-gradient-to-b from-[#06174d] via-black to-[#06174d] p-3 lg:p-5">
          <div
            className="w-auto h-auto rounded-xl shadow-xl p-4 lg:p-6 xl:p-8"
            style={{ background: "#232323" }}
          >
            <h1 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6 custom_heading">
              Lista de Intercambios
            </h1>
            <div className="overflow-x-auto rounded-lg border border-[#444] shadow-lg">
              <Table columns={columns} data={data} />
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}