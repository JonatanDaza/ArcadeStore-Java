'use client';

import GameCard from './GameCard';

export default function GameGrid({ games, onAddToCart, ownedGameIds = new Set(), loading = false, error = null }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3a6aff]"></div>
        <span className="ml-3 text-white">Cargando juegos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-red-400 font-bold mb-2">Error al cargar juegos</h3>
          <p className="text-gray-300 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!games || games.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
          <h3 className="text-white font-bold mb-2">No hay juegos disponibles</h3>
          <p className="text-gray-400">Vuelve más tarde para ver nuevos juegos.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {games.map((game) => (
        <GameCard 
          key={game.id} 
          game={game} 
          onAddToCart={onAddToCart}
          isOwned={ownedGameIds ? ownedGameIds.has(game.id) : false} />
      ))}
    </div>
  );
};

