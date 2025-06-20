"use client";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import Table from "@/app/components/Table";
import ActionButton from "@/app/components/ActionButton";

// Función para acciones
function cellAcciones({ row }) {
  return (
    <div className="flex gap-2">
      <ActionButton
        type="edit"
        title="Editar"
        onClick={() => {
          // lógica para editar
        }}
      />
      {row.original.activo ? (
        <ActionButton
          type="deactivate"
          title="Desactivar"
          onClick={() => {
            // lógica para desactivar
          }}
        />
      ) : (
        <ActionButton
          type="activate"
          title="Activar"
          onClick={() => {
            // lógica para activar
          }}
        />
      )}
      <ActionButton
        type="view"
        title="Ver detalles"
        onClick={() => {
          // lógica para ver detalles
        }}
      />
      <ActionButton
        type="highlight"
        title="Destacar"
        onClick={() => {
          // lógica para destacar
        }}
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
    header: "Activo",
    accessorKey: "activo",
    cell: info => info.getValue() ? "Activo" : "Inactivo",
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
    activo: true,
  },
  {
    id: 2,
    nombre: "Shooter",
    descripcion: "Juegos de disparos en primera o tercera persona.",
    activo: true,
  },
  {
    id: 3,
    nombre: "Deportes",
    descripcion: "Juegos de fútbol, baloncesto y más.",
    activo: false,
  },
  {
    id: 4,
    nombre: "Estrategia",
    descripcion: "Juegos de gestión y táctica.",
    activo: true,
  },
];

export default function CategoriesPage() {
  return (
    <div className="flex flex-col min-h-screen hero_area">
      <Header />
      <main className="flex-1 w-full min-h-[80vh] bg-gradient-to-b from-[#06174d] via-black to-[#06174d] p-5">
        <div
          className="max-w-7xl mx-auto rounded-xl shadow-xl p-8"
          style={{ background: "#232323" }}
        >
          <h1 className="text-2xl font-bold mb-6 custom_heading">
            Lista de Categorías
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