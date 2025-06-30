'use client';

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import Header from "app/components/header";
import Footer from "app/components/footer";
import GameGrid from "app/components/GameGrid";
import GameFilters from "app/components/GameFilters";
import PublicGameService from "app/services/api/publicGames";
import CategoryService from "app/services/api/categories";

export default function FreeGamesPage() {
  const [freeGames, setFreeGames] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    search: "",
    categoria: "",
    masDe: "",
    menosDe: "",
  });

  // Cargar juegos gratuitos del backend
  const loadFreeGames = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🆓 Cargando juegos gratuitos...');

      // Verificar conexión
      const isConnected = await PublicGameService.checkConnection();
      if (!isConnected) {
        throw new Error('No se pudo conectar al servidor');
      }

      // Cargar juegos gratuitos
      const freeGamesData = await PublicGameService.getFreeGames();
      console.log('🆓 Juegos gratuitos recibidos:', freeGamesData);
      
      setFreeGames(freeGamesData || []);

    } catch (err) {
      setError(err.message || 'Error al cargar juegos gratuitos');
      console.error('Error loading free games:', err);
      setFreeGames([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar categorías
  const loadCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        const categoriesData = await CategoryService.getAllCategories(token);
        setCategorias(categoriesData || []);
      } else {
        setCategorias([
          { id: 1, name: "Accion" },
          { id: 2, name: "Aventura" },
          { id: 3, name: "Estrategia" },
        ]);
      }
    } catch (err) {
      console.warn('No se pudieron cargar las categorías:', err);
      setCategorias([
        { id: 1, name: "Accion" },
        { id: 2, name: "Aventura" },
        { id: 3, name: "Estrategia" },
      ]);
    }
  }, []);

  useEffect(() => {
    loadFreeGames();
    loadCategories();
  }, [loadFreeGames, loadCategories]);

  // Agregar al carrito
  const handleAddToCart = useCallback((game) => {
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
        toast.success('¡Juego gratuito añadido a la biblioteca!');
      } else {
        toast.success('¡Juego agregado al carrito!');
      }
      
    } catch (error) {
      toast.error('Error al agregar al carrito');
      console.error('Error adding to cart:', error);
    }
  }, []);

  // Filtrar juegos gratuitos
  const filteredGames = freeGames.filter(game => {
    const matchSearch = !filtros.search || 
      game.title?.toLowerCase().includes(filtros.search.toLowerCase()) ||
      game.description?.toLowerCase().includes(filtros.search.toLowerCase());
    
    const matchCategoria = !filtros.categoria || 
      game.category?.id?.toString() === filtros.categoria.toString();
    
    const matchMasDe = !filtros.masDe || game.price >= Number(filtros.masDe);
    const matchMenosDe = !filtros.menosDe || game.price <= Number(filtros.menosDe);
    
    return matchSearch && matchCategoria && matchMasDe && matchMenosDe;
  });

  console.log('🔍 Juegos gratuitos filtrados:', filteredGames);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 font-poppins text-white bg-gradient-to-b from-[#06174d] via-black to-[#06174d]">
        
        {/* Hero Section */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Juegos Gratuitos
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Descubre increíbles juegos sin costo alguno
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 pb-12">
          {/* Estado de conexión */}
          {error && (
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-red-400 font-bold mb-2">Error de conexión</h3>
                  <p className="text-gray-300 text-sm">{error}</p>
                </div>
                <button
                  onClick={loadFreeGames}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                >
                  {loading ? 'Cargando...' : 'Reintentar'}
                </button>
              </div>
            </div>
          )}

          <GameFilters categorias={categorias} onFilter={setFiltros} />
          
          {/* Información de debug */}
          <div className="mb-6 text-sm text-gray-400">
            <p>Juegos gratuitos disponibles: {freeGames.length}</p>
            <p>Mostrando: {filteredGames.length} juegos</p>
          </div>
          
          <GameGrid
            games={filteredGames}
            onAddToCart={handleAddToCart}
            loading={loading}
            error={error}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}