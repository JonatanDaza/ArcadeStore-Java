'use client';

import { useState } from "react";
import Header from "app/components/header";
import Footer from "app/components/footer";
import GamesGallery from "app/components/GamesGallery";
import GameFilters from "app/components/GameFilters";
import PaginationGames from "@/components/paginationGames";

// Simulación de datos (reemplaza por fetch real)
const categorias = [
  { id: 1, nombre_categoria: "Accion" },
  { id: 2, nombre_categoria: "Aventura" },
  { id: 3, nombre_categoria: "Estrategia" },
];
// correcto
// const [categorias, setCategorias] = useState([]);

// useEffect(() => {
//   fetch('/api/categorias') // Ajusta la ruta a tu API real
//     .then(res => res.json())
//     .then(data => setCategorias(data));
// }, []);
const juegosGratisData = [
  {
    id: 1,
    titulo: "GTA V",
    descripcion: "Un ... de mundo ...",
    image: "GTAV.png",
    categoria: { nombre_categoria: "Accion" },
    precio: 60000,
  },
  {
    id: 2,
    titulo: "Dragon ball sparking zero",
    descripcion: "Un ... de mundo ...",
    image: "Dragon ball sparking zero.png",
    categoria: { nombre_categoria: "Aventura" },
    precio: 70000,
  },
  {
    id: 3,
    titulo: "HALO 4",
    descripcion: "Un ... de mundo ...",
    image: "HALO4.png",
    categoria: { nombre_categoria: "Estrategia" },
    precio: 50000,
  },
];

export default function FreeGamesPage() {
  const [filtros, setFiltros] = useState({
    search: "",
    categoria: "",
    masDe: "",
    menosDe: "",
  });
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Filtrado simple en frontend (puedes reemplazar por fetch a backend)
  const juegosFiltrados = juegosGratisData.filter(juego => {
    const matchSearch = !filtros.search || juego.titulo.toLowerCase().includes(filtros.search.toLowerCase());
    const categoriaSeleccionada = categorias.find(cat => String(cat.id) === String(filtros.categoria))?.nombre_categoria;
    const matchCategoria = !filtros.categoria || juego.categoria?.nombre_categoria === categoriaSeleccionada;
    const matchMasDe = !filtros.masDe || juego.precio >= Number(filtros.masDe);
    const matchMenosDe = !filtros.menosDe || juego.precio <= Number(filtros.menosDe);
    return matchSearch && matchCategoria && matchMasDe && matchMenosDe;
  });


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 font-poppins text-white flex flex-row  bg-gradient-to-b from-[#06174d] via-black to-[#06174d] p-5 m-0"
      >
        {/* correcto */}
        {/* <GameFilters categorias={categorias} onFilter={handleFilter} />*/}
        <div className="flex-1 px-4">
          <GameFilters categorias={categorias} onFilter={setFiltros} />
          <GamesGallery juegos={juegosFiltrados} titulo="Juegos Disponibles" />
        </div>
      </main>
      {/* <PaginationGames/> */}
      <Footer />
    </div>
  );
}