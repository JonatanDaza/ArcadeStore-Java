'use client';

import { useState } from "react";
import Header from "app/components/header";
import Footer from "app/components/footer";
import GameFilters from "app/components/GameFilters";
import GamesGallery from "app/components/GamesGallery";

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

  // Filtrado simple en frontend (puedes reemplazar por fetch a backend)
  const juegosFiltrados = juegos.filter(juego => {
    const matchSearch = !filtros.search || juego.titulo.toLowerCase().includes(filtros.search.toLowerCase());
    const matchCategoria = !filtros.categoria || juego.categoria == filtros.categoria;
    const matchMin = !filtros.minPrice || juego.precio >= Number(filtros.minPrice);
    const matchMax = !filtros.maxPrice || juego.precio <= Number(filtros.maxPrice);
    return matchSearch && matchCategoria && matchMin && matchMax;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 font-poppins text-white flex flex-row  bg-gradient-to-b from-[#06174d] via-black to-[#06174d] p-5 m-0"
      >
        <GameFilters categorias={categorias} onFilter={setFiltros} />
        <div className="flex-1 px-4">
          <GamesGallery juegos={juegosFiltrados} titulo="Juegos Disponibles" />
        </div>
      </main>
      <Footer />
    </div>
  );
}