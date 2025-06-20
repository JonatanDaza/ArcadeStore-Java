'use client';

import { useState } from "react";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import GameFilters from "@/app/components/GameFilters";
import GamesGallery from "@/app/components/GamesGallery";

// Simulación de datos (reemplaza por fetch real)
const categorias = [
  { id: 1, nombre_categoria: "Acción" },
  { id: 2, nombre_categoria: "Aventura" },
  { id: 3, nombre_categoria: "Estrategia" },
];
const juegosData = [
  {
    id: 1,
    titulo: "Juego 1",
    descripcion: "Descripción del juego 1...",
    imagen: "juego1.jpg",
    categoria: 1,
    precio: 50000,
  },
  {
    id: 2,
    titulo: "Juego 2",
    descripcion: "Descripción del juego 2...",
    imagen: "juego2.jpg",
    categoria: 2,
    precio: 70000,
  },
  // ...otros juegos
];

export default function GamesPage() {
  const [filtros, setFiltros] = useState({});
  const [juegos] = useState(juegosData);

  // Paginación
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Filtrado simple en frontend (puedes reemplazar por fetch a backend)
  const juegosFiltrados = juegos.filter(juego => {
    const matchSearch = !filtros.search || juego.titulo.toLowerCase().includes(filtros.search.toLowerCase());
    const matchCategoria = !filtros.categoria || juego.categoria == filtros.categoria;
    const matchMin = !filtros.minPrice || juego.precio >= Number(filtros.minPrice);
    const matchMax = !filtros.maxPrice || juego.precio <= Number(filtros.maxPrice);
    return matchSearch && matchCategoria && matchMin && matchMax;
  });

  const total = juegosFiltrados.length;
  const lastPage = Math.ceil(total / pageSize);
  const paginated = juegosFiltrados.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="flex flex-col min-h-screen bg-[#06174d]">
      <Header />
      <div className="flex flex-row dashboard flex-1 min-h-[80vh] bg-gradient-to-b from-[#06174d] via-black to-[#06174d] p-5 m-0">
        <GameFilters categorias={categorias} onFilter={setFiltros} />
        <div className="flex-1 px-4 py-8">
          <GamesGallery juegos={paginated} titulo="Juegos Disponibles" />
          {/* Paginación */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-white text-sm">
              Mostrando {total === 0 ? 0 : (page - 1) * pageSize + 1} a {Math.min(page * pageSize, total)} de {total} registros
            </div>
            <nav>
              <ul className="inline-flex -space-x-px">
                <li>
                  <button
                    className={`px-3 py-2 rounded-l border border-[#333] bg-[#2b2b2b] text-white ${page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#575d6d]"}`}
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    &laquo;
                  </button>
                </li>
                {[...Array(lastPage)].map((_, i) => (
                  <li key={i}>
                    <button
                      className={`px-3 py-2 border border-[#333] bg-[#2b2b2b] text-white ${page === i + 1 ? "bg-[#06174d] font-bold" : "hover:bg-[#575d6d]"}`}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    className={`px-3 py-2 rounded-r border border-[#333] bg-[#2b2b2b] text-white ${page === lastPage || lastPage === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#575d6d]"}`}
                    onClick={() => setPage(page + 1)}
                    disabled={page === lastPage || lastPage === 0}
                  >
                    &raquo;
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}