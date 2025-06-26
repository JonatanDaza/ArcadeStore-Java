'use client';

import { useState } from "react";
import Header from "app/components/header";
import Footer from "app/components/footer";
import GamesGallery from "app/components/GamesGallery";
import GameFilters from "app/components/GameFilters";
// import PaginationGames from "@/components/paginationGames";

// Simulación de datos (reemplaza por fetch real)
const categorias = [
  { id: 1, nombre_categoria: "Accion" },
  { id: 2, nombre_categoria: "Aventura" },
  { id: 3, nombre_categoria: "Estrategia" },
];

// Datos de juegos - solo juegos gratuitos (precio 0 o marcados como free-to-play)
const juegosGratisData = [
  {
    id: 4,
    titulo: "Fortnite",
    descripcion: "Battle Royale gratuito con construcción",
    image: "fornite.jpeg",
    categoria: { nombre_categoria: "Accion" },
    precio: 0, // Gratuito
    esFreeToPlay: true,
  },
  // {
  //   id: 2,
  //   titulo: "League of Legends",
  //   descripcion: "MOBA competitivo gratuito",
  //   image: "lol.png",
  //   categoria: { nombre_categoria: "Estrategia" },
  //   precio: 0, // Gratuito
  //   esFreeToPlay: true,
  // },
  // {
  //   id: 3,
  //   titulo: "Genshin Impact",
  //   descripcion: "RPG de mundo abierto gratuito",
  //   image: "genshin.png",
  //   categoria: { nombre_categoria: "Aventura" },
  //   precio: 0, // Gratuito
  //   esFreeToPlay: true,
  // },
  // {
  //   id: 4,
  //   titulo: "Apex Legends",
  //   descripcion: "Battle Royale gratuito con héroes",
  //   image: "apex.png",
  //   categoria: { nombre_categoria: "Accion" },
  //   precio: 0, // Gratuito
  //   esFreeToPlay: true,
  // },
  // {
  //   id: 5,
  //   titulo: "Valorant",
  //   descripcion: "Shooter táctico competitivo gratuito",
  //   image: "valorant.png",
  //   categoria: { nombre_categoria: "Accion" },
  //   precio: 0, // Gratuito
  //   esFreeToPlay: true,
  // },
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

  // Filtrar solo juegos gratuitos y aplicar filtros adicionales
  const juegosFiltrados = juegosGratisData.filter(juego => {
    // Primero verificar que el juego sea gratuito
    const esGratuito = juego.precio === 0 || juego.esFreeToPlay === true;
    
    if (!esGratuito) return false; // Si no es gratuito, excluirlo
    
    // Aplicar filtros adicionales solo a juegos gratuitos
    const matchSearch = !filtros.search || juego.titulo.toLowerCase().includes(filtros.search.toLowerCase());
    const categoriaSeleccionada = categorias.find(cat => String(cat.id) === String(filtros.categoria))?.nombre_categoria;
    const matchCategoria = !filtros.categoria || juego.categoria?.nombre_categoria === categoriaSeleccionada;
    
    // Para juegos gratuitos, los filtros de precio no son tan relevantes, pero los mantenemos
    const matchMasDe = !filtros.masDe || juego.precio >= Number(filtros.masDe);
    const matchMenosDe = !filtros.menosDe || juego.precio <= Number(filtros.menosDe);
    
    return matchSearch && matchCategoria && matchMasDe && matchMenosDe;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 font-poppins text-white flex flex-row bg-gradient-to-b from-[#06174d] via-black to-[#06174d] p-5 m-0">
        <div className="flex-1 px-4">
          <GameFilters categorias={categorias} onFilter={setFiltros} />
          <GamesGallery juegos={juegosFiltrados} titulo="Juegos Gratuitos Disponibles" />
          {juegosFiltrados.length === 0 && (
            <div className="text-center text-gray-400 mt-8">
              <p>No se encontraron juegos gratuitos con los filtros aplicados.</p>
            </div>
          )}
        </div>
      </main>
      {/* <PaginationGames/> */}
      <Footer />
    </div>
  );
}