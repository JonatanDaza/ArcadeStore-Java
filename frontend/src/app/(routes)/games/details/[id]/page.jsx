'use client';

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Header from "app/components/header";
import Footer from "app/components/footer";
import PublicGameService from "app/services/api/publicGames";

export default function GameDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params?.id;
  
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (gameId) {
      loadGameDetails();
    }
  }, [gameId]);

  const loadGameDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const gameData = await PublicGameService.getGameById(gameId);
      setGame(gameData);
    } catch (err) {
      setError(err.message || 'Error al cargar el juego');
      console.error('Error loading game details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!game) return;

    try {
      const existingCart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
      const existingItemIndex = existingCart.findIndex(item => item.id === game.id);
      
      if (existingItemIndex !== -1) {
        existingCart[existingItemIndex].quantity += 1;
      } else {
        const cartItem = {
          id: game.id,
          title: game.title,
          price: game.price,
          image: game.imagePath,
          category: game.category?.name,
          quantity: 1
        };
        existingCart.push(cartItem);
      }
      
      localStorage.setItem('shoppingCart', JSON.stringify(existingCart));
      
      if (game.price === 0) {
        toast.success("¡Juego gratuito añadido a la biblioteca!");
      } else {
        toast.success("¡Juego agregado al carrito!");
      }
      
      router.push('/shoppingCart');
    } catch (error) {
      toast.error('Error al agregar al carrito');
      console.error('Error adding to cart:', error);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-[#06174d] via-black to-[#06174d] text-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3a6aff] mx-auto mb-4"></div>
            <p>Cargando detalles del juego...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-[#06174d] via-black to-[#06174d] text-white">
          <div className="text-center max-w-md">
            <h1 className="text-4xl font-bold mb-4 text-red-400">404</h1>
            <h2 className="text-2xl font-bold mb-4">Juego no encontrado</h2>
            <p className="text-gray-300 mb-6">
              {error || 'El juego que buscas no existe o ha sido eliminado.'}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.back()}
                className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg transition-colors"
              >
                Volver
              </button>
              <button
                onClick={() => router.push('/store')}
                className="bg-[#3a6aff] hover:bg-[#2952ff] px-6 py-3 rounded-lg transition-colors"
              >
                Ver tienda
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const imageUrl = imageError 
    ? '/images/default-game.png' 
    : PublicGameService.getImageUrl(game.imagePath);

  // Parsear requisitos si vienen como string
  const parseRequirements = (reqString) => {
    if (!reqString) return null;
    
    try {
      // Si ya es un objeto, devolverlo
      if (typeof reqString === 'object') return reqString;
      
      // Si es string, intentar parsearlo como texto simple
      const lines = reqString.split('\n').filter(line => line.trim());
      const requirements = {};
      
      lines.forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
          const cleanKey = key.trim().toLowerCase();
          const value = valueParts.join(':').trim();
          
          if (cleanKey.includes('so') || cleanKey.includes('sistema')) {
            requirements.os = value;
          } else if (cleanKey.includes('cpu') || cleanKey.includes('procesador')) {
            requirements.cpu = value;
          } else if (cleanKey.includes('ram') || cleanKey.includes('memoria')) {
            requirements.ram = value;
          } else if (cleanKey.includes('gpu') || cleanKey.includes('gráficos') || cleanKey.includes('tarjeta')) {
            requirements.gpu = value;
          } else if (cleanKey.includes('almacenamiento') || cleanKey.includes('espacio')) {
            requirements.storage = value;
          }
        }
      });
      
      return Object.keys(requirements).length > 0 ? requirements : null;
    } catch (e) {
      return null;
    }
  };

  const minRequirements = parseRequirements(game.requisiteMinimum);
  const recRequirements = parseRequirements(game.requisiteRecommended);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 bg-gradient-to-b from-[#06174d] via-black to-[#06174d] text-white font-sans flex items-center justify-center p-2">
        <div className="bg-[#222] rounded-2xl shadow-2xl flex flex-col lg:flex-row w-full max-w-6xl min-h-[600px] overflow-hidden relative">
          <button
            onClick={() => router.back()}
            className="absolute top-6 right-8 z-50 text-gray-400 hover:text-red-400 transition text-3xl font-bold bg-[#222] rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
            title="Volver"
            aria-label="Volver"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
          >
            ×
          </button>
          
          <div className="flex-shrink-0 flex items-center justify-center bg-black lg:w-[40%] w-full p-8">
            <img
              src={imageUrl}
              alt={game.title}
              className="w-full h-auto object-contain rounded-xl shadow-lg"
              onError={handleImageError}
            />
          </div>
          
          <div className="flex-1 p-10 flex flex-col">
            <h1 className="text-5xl font-extrabold mb-3">{game.title}</h1>
            
            {game.category && (
              <span className="inline-block bg-[#3a6aff] text-white text-sm px-4 py-2 rounded-full mb-6 w-fit font-semibold">
                {game.category.name}
              </span>
            )}
            
            <p className="text-gray-300 mb-8 text-lg">
              {game.description || 'Sin descripción disponible'}
            </p>
            
            <div className="flex items-center gap-8 mb-10">
              <button
                className={`px-8 py-4 rounded-lg transition-colors font-semibold text-lg ${
                  game.price === 0 
                    ? "bg-green-600 hover:bg-green-700" 
                    : "bg-[#3a6aff] hover:bg-[#2952ff]"
                }`}
                onClick={handleAddToCart}
              >
                {game.price === 0 ? "Obtener gratis" : "Agregar al carrito"}
              </button>
              <span className="text-3xl font-bold text-[#3a6aff]">
                {game.price === 0 ? "" : `$${game.price.toLocaleString("es-CO")}`}
              </span>
            </div>
            
            {/* Apartado de requisitos del sistema */}
            {(minRequirements || recRequirements) && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 text-[#3a6aff]">Requisitos del sistema</h2>
                <div className="flex flex-col md:flex-row gap-8">
                  {minRequirements && (
                    <div className="flex-1 bg-[#181c2f] rounded-xl p-6">
                      <h3 className="font-semibold mb-3 text-white text-lg">Mínimos</h3>
                      <ul className="text-gray-300 text-base space-y-2">
                        {minRequirements.os && <li><b>SO:</b> {minRequirements.os}</li>}
                        {minRequirements.cpu && <li><b>CPU:</b> {minRequirements.cpu}</li>}
                        {minRequirements.ram && <li><b>RAM:</b> {minRequirements.ram}</li>}
                        {minRequirements.gpu && <li><b>Gráficos:</b> {minRequirements.gpu}</li>}
                        {minRequirements.storage && <li><b>Almacenamiento:</b> {minRequirements.storage}</li>}
                        {!minRequirements.os && !minRequirements.cpu && (
                          <li className="text-gray-400 italic">{game.requisiteMinimum}</li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  {recRequirements && (
                    <div className="flex-1 bg-[#181c2f] rounded-xl p-6">
                      <h3 className="font-semibold mb-3 text-white text-lg">Recomendados</h3>
                      <ul className="text-gray-300 text-base space-y-2">
                        {recRequirements.os && <li><b>SO:</b> {recRequirements.os}</li>}
                        {recRequirements.cpu && <li><b>CPU:</b> {recRequirements.cpu}</li>}
                        {recRequirements.ram && <li><b>RAM:</b> {recRequirements.ram}</li>}
                        {recRequirements.gpu && <li><b>Gráficos:</b> {recRequirements.gpu}</li>}
                        {recRequirements.storage && <li><b>Almacenamiento:</b> {recRequirements.storage}</li>}
                        {!recRequirements.os && !recRequirements.cpu && (
                          <li className="text-gray-400 italic">{game.requisiteRecommended}</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}