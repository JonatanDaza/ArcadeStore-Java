'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Header from 'app/components/header';
import Footer from 'app/components/footer';
import GameGrid from 'app/components/GameGrid';
import PublicGameService from 'app/services/api/publicGames';
import CategoryService from 'app/services/api/categories';
import LibraryService from 'app/services/api/library';

export default function StorePage() {
  const router = useRouter();
  const [games, setGames] = useState([]);
  const [featuredGames, setFeaturedGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [priceFilter, setPriceFilter] = useState("");
  const [filterType, setFilterType] = useState("masDe"); // "masDe" or "menosDe"
  const [ownedGameIds, setOwnedGameIds] = useState(new Set());

  // Cargar juegos de pago (no gratuitos)
  const loadGames = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setConnectionStatus('checking');

      console.log('🔄 Iniciando carga de juegos de pago...');

      // Verificar conexión
      const isConnected = await PublicGameService.checkConnection();
      if (!isConnected) {
        setConnectionStatus('disconnected');
        setError('No se pudo conectar al servidor');
        return;
      }

      setConnectionStatus('connected');
      console.log('✅ Conexión establecida');

      // Cargar juegos de pago (no gratuitos)
      console.log('💰 Cargando juegos de pago...');
      const paidGames = await PublicGameService.getPaidGames();
      console.log('💰 Juegos de pago recibidos:', paidGames);
      setGames(paidGames || []);

      // Cargar juegos destacados (pueden incluir gratuitos)
      console.log('🌟 Cargando juegos destacados...');
      const featured = await PublicGameService.getFeaturedGames();
      console.log('🌟 Juegos destacados recibidos:', featured);
      setFeaturedGames(featured || []);

    } catch (err) {
      setConnectionStatus('error');
      setError(err.message || 'Error al cargar juegos');
      console.error('❌ Error loading games:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar categorías
  const loadCategories = useCallback(async () => {
    try {
      console.log('📂 Cargando categorías...');
      // Intentar cargar categorías (puede requerir autenticación)
      const token = localStorage.getItem("authToken");
      if (token) {
        const categoriesData = await CategoryService.getAllCategories(token);
        setCategories(categoriesData || []);
        console.log('📂 Categorías cargadas:', categoriesData);
      } else {
        console.log('📂 No hay token, usando categorías por defecto');
        setCategories([]);
      }
    } catch (err) {
      console.warn('⚠️ No se pudieron cargar las categorías:', err);
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    loadGames();
    loadCategories();
    setPriceFilter("");
    setFilterType("masDe");
  }, [loadGames, loadCategories]);

  useEffect(() => {
    const fetchLibrary = async () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const libraryData = await LibraryService.getUserLibrary(token);
                const ids = new Set(libraryData.map(game => game.id));
                setOwnedGameIds(ids);
            } catch (error) {
                console.warn("No se pudo cargar la biblioteca del usuario", error);
            }
        }
    };
    fetchLibrary();
  }, []);

  // Filtrar juegos
  const filteredGames = games.filter(game => {
    const matchesSearch = game.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' ||
      game.category?.id?.toString() === selectedCategory;

    const priceFilterNum = priceFilter ? Number(priceFilter) : (filterType === "masDe" ? 0 : Infinity);
    const matchesPrice = filterType === "masDe" ? game.price >= priceFilterNum : game.price <= priceFilterNum;

    return matchesSearch && matchesCategory && matchesPrice;
  });

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
          image: PublicGameService.getImageUrl(game.imagePath),
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

      router.push('/shoppingCart');

    } catch (error) {
      toast.error('Error al agregar al carrito');
      console.error('Error adding to cart:', error);
    }
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 bg-gradient-to-b from-[#06174d] via-black to-[#06174d] text-white">
        {/* Hero Section */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Tienda de Juegos
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Descubre los mejores juegos de pago disponibles
            </p>
          </div>
        </section>

        {/* Connection Status */}
        {connectionStatus !== 'connected' && (
          <div className="max-w-7xl mx-auto px-4 mb-6">
            <div className={`border px-4 py-3 rounded-lg ${connectionStatus === 'checking'
              ? 'bg-yellow-900/20 border-yellow-500 text-yellow-400'
              : 'bg-red-900/20 border-red-500 text-red-400'
              }`}>
              <div className="flex items-center justify-between">
                <span>
                  {connectionStatus === 'checking'
                    ? 'Verificando conexión...'
                    : 'Sin conexión al servidor'}
                </span>
                {connectionStatus !== 'checking' && (
                  <button
                    onClick={loadGames}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                  >
                    {loading ? 'Conectando...' : 'Reconectar'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <section className="max-w-4xl mx-auto px-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Buscar juegos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-[#222] text-white rounded-lg border border-gray-600 focus:border-[#3a6aff] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="text-gray-300">Categoría:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-[#222] text-white rounded-lg border border-gray-600 focus:border-[#3a6aff] focus:outline-none"
              >
                <option value="all">Todas</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-row items-center gap-2">
                <label className="text-gray-300">Precio:</label>
                <select
                  value={filterType}
                  onChange={e => setFilterType(e.target.value)}
                  className="px-2 py-3 bg-[#222] text-white rounded-lg border border-gray-600 focus:border-[#3a6aff] focus:outline-none"
                >
                  <option value="masDe">Más de</option>
                  <option value="menosDe">Menos de</option>
                </select>
                :
                <input
                  type="number"
                  placeholder={filterType === "masDe" ? "" : ""}
                  className="w-24 px-4 py-[10] bg-[#222] text-white rounded-lg border border-gray-600 focus:border-[#3a6aff] focus:outline-none"
                  value={priceFilter}
                  onChange={e => setPriceFilter(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Games */}
        {featuredGames.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 mb-12">
            <h2 className="text-3xl font-bold mb-6 text-[#3a6aff]">Juegos Destacados</h2>
            <GameGrid
              games={featuredGames}
              onAddToCart={handleAddToCart}
              ownedGameIds={ownedGameIds}
              loading={loading && featuredGames.length === 0}
              error={error && featuredGames.length === 0 ? error : null}
            />
          </section>
        )}

        {/* Paid Games */}
        <section className="max-w-7xl mx-auto px-4 pb-12">
          <GameGrid
            games={filteredGames}
            onAddToCart={handleAddToCart}
            ownedGameIds={ownedGameIds}
            loading={loading}
            error={error}
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}
