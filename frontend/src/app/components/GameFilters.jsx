'use client';

import { useState, useEffect } from "react";

export default function GameFilters({ categorias = [], onFilter }) {
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("");
  const [masDe, setMasDe] = useState("");
  const [menosDe, setMenosDe] = useState("");

  // Aplica el filtro automáticamente cuando cambian los valores
  useEffect(() => {
    onFilter({
      search,
      categoria,
      masDe,
      menosDe,
    });
  }, [search, categoria, masDe, menosDe, onFilter]);

  const clearAll = () => {
    setSearch("");
    setCategoria("");
    setMasDe("");
    setMenosDe("");
    onFilter({ search: "", categoria: "", masDe: "", menosDe: "" });
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#2b2b2b] text-white border-b border-[#333] rounded-lg p-3 flex flex-wrap gap-4 items-center justify-between shadow-lg mb-6">
      {/* Barra de búsqueda */}
      <div className="flex flex-row items-center gap-2 flex-1 min-w-[200px]">
        <input
          type="text"
          placeholder="Buscar juegos..."
          className="flex-grow px-3 py-2 rounded bg-[#444] text-white border-none outline-none"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      
      {/* Filtro por categoría */}
      <div className="flex flex-row items-center gap-2">
        <label className="text-[#ddd] whitespace-nowrap">Categoría:</label>
        <select
          className="px-2 py-2 rounded bg-[#444] text-white border border-[#555]"
          value={categoria}
          onChange={e => setCategoria(e.target.value)}
        >
          <option value="">Todas</option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name || cat.nombre_categoria}
            </option>
          ))}
        </select>
      </div>
      
      {/* Filtro por precio */}
      <div className="flex flex-row items-center gap-2">
        <label className="text-[#ddd] whitespace-nowrap">Más de:</label>
        <input
          type="number"
          placeholder="0"
          className="w-24 px-2 py-2 rounded bg-[#444] text-white border border-[#555]"
          value={masDe}
          onChange={e => setMasDe(e.target.value)}
        />
        <label className="text-[#ddd] whitespace-nowrap">Menos de:</label>
        <input
          type="number"
          placeholder="999999"
          className="w-24 px-2 py-2 rounded bg-[#444] text-white border border-[#555]"
          value={menosDe}
          onChange={e => setMenosDe(e.target.value)}
        />
      </div>
      
      {/* Botón limpiar */}
      {(search || categoria || masDe || menosDe) && (
        <button
          className="bg-black text-white px-4 py-2 rounded hover:bg-[#575d6d] transition"
          onClick={clearAll}
        >
          Limpiar
        </button>
      )}
    </div>
  );
}