"use client";
import Header from "app/components/header";
import Footer from "app/components/footer";
import Table from "app/components/Table";
import ActionButton, { ToggleSwitch } from "app/components/ActionButton";
import Sidebar from "app/components/sidebar";

// Define las funciones fuera del array
function cellNo(info) {
  return info.row.index + 1;
}
function cellImagenTitulo({ row }) {
  return (
    <div className="flex items-center gap-2">
      <img
        src={`/images/${row.original.imagen}`}
        alt={row.original.titulo}
        className="w-12 h-12 object-cover rounded"
      />
      <span>{row.original.titulo}</span>
    </div>
  );
}
function cellAcciones({ row }) {
  return (
    <div className="flex gap-2">
      <ActionButton
        type="highlight"
        onClick={() => {
          // lógica para destacar
        }}
        title="Destacar"
      />

      <ActionButton
        type="view"
        onClick={() => {
          // lógica para ver detalles
        }}
        title="Ver detalles"
      />
      
      <ActionButton
        type="edit"
        onClick={() => {
          // lógica para editar
        }}
        title="Editar"
      />
      
      <ToggleSwitch
        checked={row.original.estado === "Activo"}
        onChange={() => {
          // lógica para activar/desactivar
        }}
        title={row.original.estado === "Activo" ? "Desactivar" : "Activar"}
      />
      
    </div>
  );
}

// Ejemplo de columnas para juegos
const columns = [
  {
    header: "No",
    accessorKey: "id",
    cell: cellNo,
  },
  {
    header: "Imagen y Título",
    accessorKey: "titulo",
    cell: cellImagenTitulo,
  },
  { header: "Precio", accessorKey: "precio" },
  { header: "Descripción", accessorKey: "descripcion" },
  { header: "Requisitos Mínimos", accessorKey: "requisitos_minimos" },
  { header: "Requisitos Recomendados", accessorKey: "requisitos_recomendados" },
  { header: "Categoría", accessorKey: "categoria" },
  {
    header: "Estado",
    accessorKey: "estado",
    cell: info => (
      info.getValue() === "Activo" ? (
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

// Tus datos de juegos (puedes reemplazar por datos reales)
const data = [
  {
    id: 1,
    imagen: "GTAV.png",
    titulo: "GTA V",
    precio: 100000,
    descripcion: "Acción y aventura en un mundo abierto inspirado en Los Santos.",
    requisitos_minimos: "Sistema operativo: Windows 10, RAM: 8GB, GPU: GTX 660",
    requisitos_recomendados: "Sistema operativo: Windows 11, RAM: 16GB, GPU: GTX 1060",
    categoria: "Acción y aventura",
    estado: "Activo",
  },
  {
    id: 2,
    imagen: "call of duty black ops 6.jpg",
    titulo: "Call of Duty: Black Ops 2",
    precio: 200000,
    descripcion: "Juego en primera persona que combina campaña futurista y multijugador.",
    requisitos_minimos: "Sistema Operativo: Windows Vista, RAM: 2GB, GPU: GeForce 8600GT",
    requisitos_recomendados: "Desconocidos o pendientes de publicar.",
    categoria: "Shooter",
    estado: "Activo",
  },
  {
    id: 3,
    imagen: "HALO4.png",
    titulo: "HALO 4",
    precio: 90,
    descripcion: "Juego de disparos en primera persona que sigue las aventuras del Jefe Maestro.",
    requisitos_minimos: "SO: Windows 7, Procesador: Intel Core i3",
    requisitos_recomendados: "SO: Windows 10, Procesador: Intel Core i5",
    categoria: "Shooter",
    estado: "Inactivo",
  },
  {
    id: 4,
    imagen: "Assasin's creed valhalla.jpg",
    titulo: "Assassin's Creed",
    precio: 500000,
    descripcion: "Acción y aventura donde encarnas a un asesino en distintas épocas históricas.",
    requisitos_minimos: "Procesador: AMD Ryzen 5, RAM: 8GB",
    requisitos_recomendados: "Procesador: AMD Ryzen 7, RAM: 16GB",
    categoria: "Acción y aventura",
    estado: "Activo",
  },
];

export default function GamesPage() {
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
              Lista de Juegos
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
export const gamesData = data;