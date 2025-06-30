'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PublicGameService from '../services/api/publicGames';

const RecentGames = ({ juegosRecientes = [] }) => {
  const router = useRouter();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    const loadRecentGames = async () => {
      try {
        if (juegosRecientes.length > 0) {
          // Usar los juegos pasados como props
          setGames(juegosRecientes);
        } else {
          // Cargar juegos recientes del backend
          const recentGames = await PublicGameService.getRecentGames();
          const mappedGames = recentGames.map(game => PublicGameService.mapGameData(game));
          setGames(mappedGames);
        }
      } catch (error) {
        console.error('Error loading recent games:', error);
        // Usar datos de ejemplo en caso de error
        setGames([
          {
            id: 1,
            titulo: "Red Dead Redemption 2",
            descripcion: "es una épica aventura de mundo abierto ambientada en el ocaso de la era del salvaje oeste americano. Únete a Arthur Morgan y la banda de Van der Linde...",
            image: "HALO4.png"
          },
          {
            id: 2,
            titulo: "Cyberpunk 2077",
            descripcion: "Un RPG de mundo abierto ambientado en Night City, una megalópolis obsesionada con el poder, el glamour y la modificación corporal. Juegas como V, un mercenario en busca de un implante único...",
            image: "GTAV.png"
          },
          {
            id: 3,
            titulo: "The Witcher 3",
            descripcion: "Como Geralt de Rivia, un cazador de monstruos conocido como brujo, embárcate en una aventura épica en un mundo fantástico rico en contenido y opciones significativas...",
            image: "FARCRY3.jpeg"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadRecentGames();
  }, [juegosRecientes]);

  const handleImageError = (gameId) => {
    setImageErrors(prev => ({
      ...prev,
      [gameId]: true
    }));
  };

  const handleViewDetails = (juegoId) => {
    // Redirigir a la página de detalles del juego
    router.push(`/games/${juegoId}`);
  };

  const getImageUrl = (game) => {
    if (imageErrors[game.id]) {
      return '/images/default-game.png';
    }
    
    // Si tiene imagePath del backend, usar el servicio
    if (game.imagePath) {
      return PublicGameService.getImageUrl(game.imagePath);
    }
    
    // Si tiene image del formato anterior, mantener compatibilidad
    if (game.image) {
      return `/images/${game.image}`;
    }
    
    return '/images/default-game.png';
  };

  const limitText = (text, limit = 150) => {
    return text && text.length > limit ? text.substring(0, limit) + '...' : text || '';
  };

  if (loading) {
    return (
      <div className="py-16 flex-1">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#3a6aff] fw-blod mb-10">
            Juegos Recientes
          </h2>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3a6aff]"></div>
            <span className="ml-3 text-white">Cargando juegos recientes...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 flex-1">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-[#3a6aff] fw-blod mb-10">
          Juegos Recientes
        </h2>
        {games.map((juego, index) => (
          <section
            className="flex flex-col md:flex-row items-center mb-12 rounded-lg"
            key={juego.id}
          >
            <div className={`md:w-1/2 ${index % 2 !== 0 ? "md:order-2" : ""}`}>
              <img
                src={getImageUrl(juego)}
                alt={juego.titulo}
                className="w-full h-auto rounded-lg"
                onError={() => handleImageError(juego.id)}
              />
            </div>
            <div className="md:w-1/2 p-8">
              <h3 className="text-3xl font-bold text-[#3a6aff] fw-blod mb-4">
                {juego.titulo}
              </h3>
              
              {/* Mostrar categoría si existe */}
              {juego.categoria && (
                <span className="inline-block bg-[#3a6aff] text-white text-sm px-3 py-1 rounded-full mb-4">
                  {juego.categoria.name}
                </span>
              )}
              
              {/* Mostrar precio */}
              {juego.precio !== undefined && (
                <div className="mb-4">
                  <span className="text-xl font-bold text-[#3a6aff]">
                    {juego.precio === 0 ? 'Gratis' : `$${juego.precio.toLocaleString('es-CO')}`}
                  </span>
                </div>
              )}
              
              <p className="mb-6 text-[#fff] leading-relaxed">
                {limitText(juego.descripcion, 150)}
              </p>
              
              <button
                onClick={() => handleViewDetails(juego.id)}
                className="inline-block bg-[#fff] hover:bg-[#3a6aff] text-black hover:text-white py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Más información
              </button>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default RecentGames;