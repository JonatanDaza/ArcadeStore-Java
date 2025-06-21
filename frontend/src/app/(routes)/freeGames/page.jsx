'use client';

import { useState } from "react";
import Header from "app/components/header";
import Footer from "app/components/footer";
import GamesGallery from "app/components/GamesGallery";

// Simulación de datos (reemplaza por fetch real)
const categorias = [
  { id: 1, nombre_categoria: "Acción" },
  { id: 2, nombre_categoria: "Puzzle" },
  { id: 3, nombre_categoria: "Aventura" },
];
const juegosGratisData = [
  {
    id: 1,
    titulo: "Juego Gratis 1",
    descripcion: "Descripción del juego gratis 1...",
    imagen: "juegog1.jpg",
    categoria: 1,
  },
  {
    id: 2,
    titulo: "Juego Gratis 2",
    descripcion: "Descripción del juego gratis 2...",
    imagen: "juegog2.jpg",
    categoria: 2,
  },
  // ...otros juegos gratis
];

export default function FreeGamesPage() {
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("");
  // Simula paginación (puedes reemplazar por lógica real)
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Filtrado simple en frontend
  const juegosFiltrados = juegosGratisData.filter(juego => {
    const matchSearch = !search || juego.titulo.toLowerCase().includes(search.toLowerCase());
    const matchCategoria = !categoria || juego.categoria == categoria;
    return matchSearch && matchCategoria;
  });

  const total = juegosFiltrados.length;
  const lastPage = Math.ceil(total / pageSize);
  const paginated = juegosFiltrados.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="flex flex-col min-h-screen bg-[#06174d]">
      <Header />
      <div className="flex flex-row dashboard flex-1 min-h-[80vh] bg-gradient-to-b from-[#06174d] via-black to-[#06174d] p-5 m-0">
        {/* Sidebar de filtros */}
        <aside className="w-auto bg-[#2b2b2b] text-white border border-[#333] rounded-lg p-2 h-full min-w-[260px] max-w-xs sidebar">
          <h2 className="text-center mb-5 text-xl font-bold">Filtros</h2>
          {/* Barra de búsqueda */}
          <div className="flex p-3 mb-5 bg-[#2b2b2b] rounded search-bar">
            <input
              type="text"
              placeholder="Buscar juegos..."
              className="flex-grow px-3 py-2 rounded-l bg-[#444] text-white border-none outline-none"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyUp={e => e.key === "Enter"}
            />
            <button
              className="bg-black text-white px-4 py-2 rounded-r hover:bg-[#06174d] transition"
              onClick={() => setSearch(search)}
            >
              Buscar
            </button>
            {search && (
              <button
                className="ml-2 bg-black text-white px-3 py-2 rounded hover:bg-[#575d6d] transition"
                onClick={() => setSearch("")}
              >
                Limpiar
              </button>
            )}
          </div>
          {/* Filtro por categoría */}
          <div className="mb-4 px-3 filter-group">
            <label className="block mb-1 text-[#ddd]">Filtrar por Categoría:</label>
            <select
              className="w-full px-2 py-2 rounded bg-[#444] text-white border border-[#555]"
              value={categoria}
              onChange={e => { setCategoria(e.target.value); setPage(1); }}
            >
              <option value="">Todas las Categorías</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre_categoria}</option>
              ))}
            </select>
          </div>
        </aside>
        {/* Galería de juegos */}
        <main className="flex-1 px-4 py-8">

          <GamesGallery
            juegos={paginated}
            titulo="Juegos Gratis"
            buttonText="Ver Detalles"
            buttonLinkPrefix="/tienda/"
          />
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
        </main>
      </div>
      <Footer />
    </div>
  );
}