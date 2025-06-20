"use client";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import Table from "@/app/components/Table";
import ActionButton from "@/app/components/ActionButton";

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
        type="edit"
        onClick={() => {
          // lógica para editar
        }}
      >
        Editar
      </ActionButton>
      {row.original.estado === "Activo" ? (
        <ActionButton
          type="deactivate"
          onClick={() => {
            // lógica para desactivar
          }}
        >
          Desactivar
        </ActionButton>
      ) : (
        <ActionButton
          type="activate"
          onClick={() => {
            // lógica para activar
          }}
        >
          Activar
        </ActionButton>
      )}
      <ActionButton
        type="view"
        onClick={() => {
          // lógica para ver detalles
        }}
      >
        Ver
      </ActionButton>

      <ActionButton
        type="highlight"
        onClick={() => {
          // lógica para ver detalles
        }}
      >
        Ver
      </ActionButton>
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
  { header: "Estado", accessorKey: "estado" },
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
    imagen: "gta-v.jpg",
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
    imagen: "call-of-duty.jpg",
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
    imagen: "halo-4.jpg",
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
    imagen: "assassins-creed.jpg",
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
      <main className="flex-1 w-full min-h-[80vh] bg-gradient-to-br from-black to-[#06174d] p-5">
        <div
          className="max-w-7xl mx-auto rounded-xl shadow-xl p-8"
          style={{ background: "#232323" }}
        >
          <h1 className="text-2xl font-bold mb-6 custom_heading">
            Lista de Juegos
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