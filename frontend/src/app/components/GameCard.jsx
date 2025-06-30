'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PublicGameService from 'app/services/api/publicGames';

export default function GameCard({ game, onAddToCart, isOwned }) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [installing, setInstalling] = useState(false);

  const handleImageError = (e) => {
    e.target.onerror = null; // Prevents infinite loops if the fallback also fails
    setImageError(true);
  };

  const handleViewDetails = (e) => {
    // Stop propagation to prevent parent link handlers if this is nested
    if (e && e.stopPropagation) e.stopPropagation();
    router.push(`/games/details/${game.id}`);
  };

  const handleAddToCartClick = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    onAddToCart(game); // Call the function passed via props
  };

  const handleInstallClick = async (e) => {
    e.stopPropagation();
    setInstalling(true);
    try {
      // Simulate installation
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`¡${game.title} instalado!`);
    } finally {
      setInstalling(false);
    }
  };

  return (
    <div className="bg-[#222] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer" onClick={handleViewDetails}>
      <div className="relative">
        <img
          src={imageError ? '/images/default-game.png' : PublicGameService.getImageUrl(game.imagePath)}
          alt={game.title}
          className="w-full h-48 object-cover"
          onError={handleImageError}
        />
        {game.highlighted && (
          <div className="absolute top-3 left-3 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
            Destacado
          </div>
        )}
        {game.price === 0 && !isOwned && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            Gratis
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="mb-3">
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-1" title={game.title} >
            {game.title}
          </h3>
          {game.category && (
            <span className="inline-block bg-[#3a6aff] text-white text-xs px-3 py-1 rounded-full">
              {game.category.name}
            </span>
          )}
        </div>

        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
          {game.description || 'Sin descripción disponible'}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-[#3a6aff]" >
            {game.price === 0 ? 'Gratis' : `$${game.price.toLocaleString('es-CO')}`}
          </span>
          
          <div className="flex gap-2">
            {isOwned ? (
              <>
                <button
                  onClick={handleViewDetails}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Detalles
                </button>
                <button onClick={handleInstallClick} disabled={installing} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${installing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white`}>
                  {installing ? 'Instalando...' : 'Instalar'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleViewDetails}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Detalles
                </button>
                <button
                  onClick={handleAddToCartClick}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${game.price === 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-[#3a6aff] hover:bg-[#2952ff]'} text-white`} 
                >
                  {game.price === 0 ? 'Obtener' : 'Agregar'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}