'use client';

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import Header from "app/components/header";
import Footer from "app/components/footer";
import PublicGameService from "app/services/api/publicGames";
import LibraryService from "app/services/api/library";
import { FaDownload, FaExchangeAlt } from 'react-icons/fa';

export default function GameDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params?.id;
  
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [isOwned, setIsOwned] = useState(false);
  const [installing, setInstalling] = useState(false);
  

  const fetchGameDetails = useCallback(async () => {
    if (!gameId) return;

    try {
      setLoading(true);
      setError(null);
      
      const gameData = await PublicGameService.getGameById(gameId);
      setGame(gameData);

      const token = localStorage.getItem('authToken');
      if (token) {
        const libraryData = await LibraryService.getUserLibrary(token);
        const ownedGameIds = new Set(libraryData.map(g => g.id.toString()));
        setIsOwned(ownedGameIds.has(gameId.toString()));
      }
    } catch (err) {
      setError(err.message || 'Error al cargar el juego');
      toast.error('Error al cargar el juego.');
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  useEffect(() => {
    fetchGameDetails();
  }, [fetchGameDetails]);

  const handleAddToCart = useCallback(() => {
    if (!game) return;

    try {
      const existingCart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
      const existingItemIndex = existingCart.findIndex(item => item.id === game.id);
      
      if (existingItemIndex !== -1) {
        toast.success(`¡${game.title} ya está en el carrito!`);
      } else {
        const cartItem = {
          id: game.id,
          title: game.title,
          price: game.price,
          image: PublicGameService.getImageUrl(game.imagePath),
          category: game.category?.name,
          quantity: 1
        };
        existingCart.push(cartItem);
        localStorage.setItem('shoppingCart', JSON.stringify(existingCart));
        toast.success(`¡${game.title} añadido al carrito!`);
      }
      
      // Redirigir al carrito
      router.push('/shoppingCart');
    } catch (error) {
      toast.error('Error al agregar al carrito');
      console.error('Error adding to cart:', error);
    }
    }, [game, router]);

  const handleInstallClick = async () => {
    setInstalling(true);
    toast.loading('Iniciando instalación...', { id: 'install-toast' });
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`¡${game.title} instalado correctamente!`, { id: 'install-toast' });
    } catch (error) {
      toast.error(`Error al instalar ${game.title}`, { id: 'install-toast' });
    } finally {
      setInstalling(false);
    }
  };

  const handleExchangeClick = () => {
    toast.info('La función de intercambio estará disponible próximamente.');
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

  // Función para parsear requisitos de texto plano a estructura organizada
  const parseRequirements = (reqString) => {
    if (!reqString || reqString.trim() === '') {
      return null;
    }
    
    console.log('📋 Parseando requisitos:', reqString);
    
    try {
      // Si ya es un objeto JSON, devolverlo
      if (typeof reqString === 'object') {
        return reqString;
      }
      
      // Si es string, intentar parsearlo como JSON primero
      try {
        const parsed = JSON.parse(reqString);
        if (typeof parsed === 'object') {
          return parsed;
        }
      } catch (e) {
        // No es JSON válido, continuar con parsing de texto
      }
      
      // Parsear como texto plano
      const lines = reqString.split('\n').filter(line => line.trim());
      const requirements = {};
      
      lines.forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex !== -1) {
          const key = line.substring(0, colonIndex).trim().toLowerCase();
          const value = line.substring(colonIndex + 1).trim();
          
          if (key.includes('so') || key.includes('sistema') || key.includes('os') || key.includes('operating')) {
            requirements.os = value;
          } else if (key.includes('cpu') || key.includes('procesador') || key.includes('processor')) {
            requirements.cpu = value;
          } else if (key.includes('ram') || key.includes('memoria') || key.includes('memory')) {
            requirements.ram = value;
          } else if (key.includes('gpu') || key.includes('gráficos') || key.includes('tarjeta') || key.includes('graphics') || key.includes('video')) {
            requirements.gpu = value;
          } else if (key.includes('almacenamiento') || key.includes('espacio') || key.includes('storage') || key.includes('disk') || key.includes('disco')) {
            requirements.storage = value;
          } else if (key.includes('directx')) {
            requirements.directx = value;
          } else if (key.includes('red') || key.includes('network') || key.includes('internet')) {
            requirements.network = value;
          }
        }
      });
      
      console.log('📋 Requisitos parseados:', requirements);
      return Object.keys(requirements).length > 0 ? requirements : null;
    } catch (e) {
      console.error('Error parsing requirements:', e);
      return null;
    }
  };

  // Función para mostrar requisitos como texto plano si no se pueden parsear
  const renderRequirementsText = (reqString) => {
    if (!reqString || reqString.trim() === '') {
      return <p className="text-gray-400 italic">No especificado</p>;
    }
    
    return (
      <div className="text-gray-400 text-sm whitespace-pre-line">
        {reqString}
      </div>
    );
  };

  // Función para renderizar requisitos estructurados
  const renderStructuredRequirements = (requirements) => {
    if (!requirements) {
      return <p className="text-gray-400 italic">No especificado</p>;
    }

    return (
      <div className="space-y-3 text-sm">
        {requirements.os && (
          <div>
            <span className="font-semibold text-gray-300">SO:</span>
            <span className="text-gray-400 ml-2">{requirements.os}</span>
          </div>
        )}
        {requirements.cpu && (
          <div>
            <span className="font-semibold text-gray-300">CPU:</span>
            <span className="text-gray-400 ml-2">{requirements.cpu}</span>
          </div>
        )}
        {requirements.ram && (
          <div>
            <span className="font-semibold text-gray-300">RAM:</span>
            <span className="text-gray-400 ml-2">{requirements.ram}</span>
          </div>
        )}
        {requirements.gpu && (
          <div>
            <span className="font-semibold text-gray-300">Gráficos:</span>
            <span className="text-gray-400 ml-2">{requirements.gpu}</span>
          </div>
        )}
        {requirements.storage && (
          <div>
            <span className="font-semibold text-gray-300">Almacenamiento:</span>
            <span className="text-gray-400 ml-2">{requirements.storage}</span>
          </div>
        )}
        {requirements.directx && (
          <div>
            <span className="font-semibold text-gray-300">DirectX:</span>
            <span className="text-gray-400 ml-2">{requirements.directx}</span>
          </div>
        )}
        {requirements.network && (
          <div>
            <span className="font-semibold text-gray-300">Red:</span>
            <span className="text-gray-400 ml-2">{requirements.network}</span>
          </div>
        )}
      </div>
    );
  };

  // Parsear los requisitos del backend
  const minRequirements = parseRequirements(game.requisiteMinimum);
  const recRequirements = parseRequirements(game.requisiteRecommended);

  // Verificar si hay requisitos para mostrar
  const hasRequirements = game.requisiteMinimum || game.requisiteRecommended;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 bg-gradient-to-b from-[#06174d] via-black to-[#06174d] text-white font-sans flex items-center justify-center p-4">
        <div className="bg-[#3a3a3a] rounded-2xl shadow-2xl flex flex-col lg:flex-row w-full max-w-6xl min-h-[600px] overflow-hidden relative">
          <button
            onClick={() => router.back()}
            className="absolute top-4 right-4 z-50 text-gray-400 hover:text-white transition text-2xl font-bold bg-transparent rounded-full w-8 h-8 flex items-center justify-center"
            title="Cerrar"
            aria-label="Cerrar"
          >
            ×
          </button>
          
          {/* Imagen del juego */}
          <div className="flex-shrink-0 flex items-center justify-center bg-black lg:w-[40%] w-full p-6">
            <img
              src={imageUrl}
              alt={game.title}
              className="w-full h-auto object-contain rounded-xl shadow-lg max-h-[500px]"
              onError={handleImageError}
            />
          </div>
          
          {/* Información del juego */}
          <div className="flex-1 p-8 flex flex-col">
            <h1 className="text-4xl font-extrabold mb-3 text-white">{game.title}</h1>
            
            {game.category && (
              <span className="inline-block bg-[#3a6aff] text-white text-sm px-4 py-2 rounded-full mb-6 w-fit font-semibold">
                {game.category.name}
              </span>
            )}
            
            <p className="text-gray-300 mb-6 text-base leading-relaxed">
              {game.description || 'Sin descripción disponible'}
            </p>
            
            {isOwned ? (
              <div className="flex items-center gap-4 mb-8">
                <button
                  onClick={handleInstallClick}
                  disabled={installing}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-colors font-semibold text-base w-full ${installing ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  <FaDownload />
                  {installing ? 'Instalando...' : 'Instalar'}
                </button>
                <button
                  onClick={handleExchangeClick}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-colors font-semibold text-base w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                >
                  <FaExchangeAlt />
                  Intercambiar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-6 mb-8">
                <button
                  className={`px-6 py-3 rounded-lg transition-colors font-semibold text-base ${game.price === 0 ? "bg-green-600 hover:bg-green-700" : "bg-[#3a6aff] hover:bg-[#2952ff]"}`}
                  onClick={handleAddToCart}
                >
                  {game.price === 0 ? "Obtener gratis" : "Agregar al carrito"}
                </button>
                <span className="text-2xl font-bold text-[#3a6aff]">
                  {game.price === 0 ? "" : `$${game.price.toLocaleString("es-CO")}`}
                </span>
              </div>
            )}
            
            {/* Requisitos del sistema - DATOS REALES DEL BACKEND */}
            {hasRequirements && (
              <div className="mt-4">
                <h2 className="text-2xl font-bold mb-6 text-[#3a6aff]">Requisitos del sistema</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Requisitos Mínimos */}
                  {game.requisiteMinimum && (
                    <div className="bg-[#2a2a3a] rounded-lg p-6">
                      <h3 className="font-bold mb-4 text-white text-lg">Mínimos</h3>
                      {minRequirements ? 
                        renderStructuredRequirements(minRequirements) : 
                        renderRequirementsText(game.requisiteMinimum)
                      }
                    </div>
                  )}
                  
                  {/* Requisitos Recomendados */}
                  {game.requisiteRecommended && (
                    <div className="bg-[#2a2a3a] rounded-lg p-6">
                      <h3 className="font-bold mb-4 text-white text-lg">Recomendados</h3>
                      {recRequirements ? 
                        renderStructuredRequirements(recRequirements) : 
                        renderRequirementsText(game.requisiteRecommended)
                      }
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mensaje si no hay requisitos */}
            {!hasRequirements && (
              <div className="mt-4">
                <h2 className="text-2xl font-bold mb-6 text-[#3a6aff]">Requisitos del sistema</h2>
                <div className="bg-[#2a2a3a] rounded-lg p-6">
                  <p className="text-gray-400 italic text-center">
                    Los requisitos del sistema no han sido especificados para este juego.
                  </p>
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