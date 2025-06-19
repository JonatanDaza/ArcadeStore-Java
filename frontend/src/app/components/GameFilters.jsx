import { useState } from "react";

export default function GameFilters({ categorias = [], onFilter }) {
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleFilter = () => {
    onFilter({ search, categoria, minPrice, maxPrice });
  };

  const clearSearch = () => {
    setSearch("");
    handleFilter();
  };

  const clearPrice = () => {
    setMinPrice("");
    setMaxPrice("");
    handleFilter();
  };

  return (
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
          onKeyUp={e => e.key === "Enter" && handleFilter()}
        />
        <button
          className="bg-black text-white px-4 py-2 rounded-r hover:bg-[#06174d] transition"
          onClick={handleFilter}
        >
          Buscar
        </button>
        {search && (
          <button
            className="ml-2 bg-black text-white px-3 py-2 rounded hover:bg-[#575d6d] transition"
            onClick={clearSearch}
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
          onChange={e => { setCategoria(e.target.value); handleFilter(); }}
        >
          <option value="">Todas las Categorías</option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nombre_categoria}</option>
          ))}
        </select>
      </div>
      {/* Filtro por precio */}
      <div className="mb-4 px-3 filter-group">
        <label className="block mb-1 text-[#ddd]">Filtrar por Rango de Precio:</label>
        <input
          type="number"
          placeholder="Precio Mínimo"
          className="w-full px-2 py-2 rounded bg-[#444] text-white border border-[#555] mb-2"
          value={minPrice}
          onChange={e => { setMinPrice(e.target.value); handleFilter(); }}
        />
        <input
          type="number"
          placeholder="Precio Máximo"
          className="w-full px-2 py-2 rounded bg-[#444] text-white border border-[#555]"
          value={maxPrice}
          onChange={e => { setMaxPrice(e.target.value); handleFilter(); }}
        />
        {(minPrice || maxPrice) && (
          <button
            className="bg-black text-white px-4 py-2 rounded mt-3 w-full hover:bg-[#575d6d] transition"
            onClick={clearPrice}
          >
            Limpiar Precio
          </button>
        )}
      </div>
    </aside>
  );
}