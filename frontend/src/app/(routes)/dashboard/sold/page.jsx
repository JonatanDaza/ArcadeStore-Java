"use client";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import Table from "@/app/components/Table";
import { FiEye } from "react-icons/fi";
import { HiOutlineDocumentText } from "react-icons/hi2";

// Botón PDF solo icono + texto
function ButtonPDF({ onClick }) {
  return (
    <button
      className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded transition text-xs"
      onClick={onClick}
    >
      <HiOutlineDocumentText size={18} />
      PDF
    </button>
  );
}

// Botón Show solo icono + texto
function ButtonShow({ onClick }) {
  return (
    <button
      className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded transition text-xs"
      onClick={onClick}
    >
      <FiEye size={18} />
      Show
    </button>
  );
}

// Acciones de la tabla
function cellAcciones({ row }) {
  return (
    <div className="flex gap-2">
      <ButtonShow
        onClick={() => {
          // lógica para mostrar detalles
        }}
      />
      <ButtonPDF
        onClick={() => {
          // lógica para descargar/ver PDF
        }}
      />
    </div>
  );
}

// Columnas para ventas
const columns = [
  {
    header: "No",
    accessorKey: "id",
    cell: info => info.row.index + 1,
  },
  {
    header: "Fecha Venta",
    accessorKey: "fechaVenta",
    cell: info => info.getValue(),
  },
  {
    header: "Usuario",
    accessorKey: "usuario",
    cell: info => info.getValue(),
  },
  {
    header: "Juego",
    accessorKey: "juego",
    cell: info => info.getValue(),
  },
  {
    header: "Precio",
    accessorKey: "precio",
    cell: info => info.getValue(),
  },
  {
    header: "Pedido",
    accessorKey: "pedido",
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
    fechaVenta: "2025-04-21",
    usuario: "jhorman Calderon",
    juego: "Bioshock Infinite",
    precio: 200000,
    pedido: 3,
  },
  // Puedes agregar más datos aquí
];

export default function SoldPage() {
  return (
    <div className="flex flex-col min-h-screen hero_area">
      <Header />
      <main className="flex-1 w-full min-h-[80vh] bg-gradient-to-b from-[#06174d] via-black to-[#06174d] p-5">
        <div
          className="max-w-7xl mx-auto rounded-xl shadow-xl p-8"
          style={{ background: "#232323" }}
        >
          <h1 className="text-2xl font-bold mb-6 custom_heading">
            Lista de Ventas
          </h1>
          <div className="overflow-x-auto rounded-lg border border-[#444] shadow-lg">
            <Table columns={columns} data={data} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}