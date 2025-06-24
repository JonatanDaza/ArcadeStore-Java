"use client";
import Header from "app/components/header";
import Footer from "app/components/footer";
import Table from "app/components/Table";
import ActionButton, { ToggleSwitch } from "app/components/ActionButton";
import Sidebar from "app/components/sidebar";

// Función para acciones
function cellAcciones({ row }) {
  return (

    
    <div className="flex gap-2">

      <ActionButton
        type="view"
        title="Ver detalles"
        onClick={() => {
          // lógica para ver detalles
        }}
      />
      <ActionButton
        type="edit"
        title="Editar"
        onClick={() => {
          // lógica para editar
        }}
      />      
      
      <ToggleSwitch
        checked={row.original.estado === "activo"}
        onChange={() => {
          // lógica para cambiar el estado
        }}
        title={row.original.estado === "activo" ? "Desactivar" : "Activar"}
      />
    </div>
  );
}

// Columnas para categorías
const columns = [
  {
    header: "ID",
    accessorKey: "id",
    cell: info => info.getValue(),
  },
  {
    header: "Nombre",
    accessorKey: "nombre",
    cell: info => info.getValue(),
  },
  {
    header: "Descripcion",
    accessorKey: "descripcion",
    cell: info => info.getValue(),
  },
  {
    header: "Estado",
    accessorKey: "estado",
    cell: info => (
      info.getValue() === "activo" || info.getValue() === "Activo" ? (
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

// Datos simulados
const data = [
  {
    id: 1,
    nombre: "Acción y aventura",
    descripcion: "Juegos con mucha acción y exploración.",
    estado: "activo",
  },
  {
    id: 2,
    nombre: "Shooter",
    descripcion: "Juegos de disparos en primera o tercera persona.",
    estado: "activo",
  },
  {
    id: 3,
    nombre: "Deportes",
    descripcion: "Juegos de fútbol, baloncesto y más.",
    estado: "inactivo",
  },
  {
    id: 4,
    nombre: "Estrategia",
    descripcion: "Juegos de gestión y táctica.",
    estado: "activo",
  },
];

export default function CategoriesPage() {
  return (
    <div className="flex flex-col min-h-screen hero_area">
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 min-w-0 bg-gradient-to-b from-[#06174d] via-black to-[#06174d] p-3 lg:p-5">
          <div
            className="w-auto h-auto pt-3"
          >
            <h1 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6 custom_heading">
              Lista de Categorías
            </h1>
            <div className="overflow-x-auto rounded-lg shadow-lg">
              <Table columns={columns} data={data} />
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}