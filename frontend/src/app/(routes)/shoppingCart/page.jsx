"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from 'app/components/header';
import Footer from 'app/components/footer';

export default function ShoppingCartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Cargar items del carrito desde localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('shoppingCart');
        if (savedCart) {
            // Filtrar duplicados basándose en el ID
            const items = JSON.parse(savedCart);
            const uniqueItems = items.filter((item, index, self) =>
                index === self.findIndex(i => i.id === item.id)
            );
            setCartItems(uniqueItems);
            // Actualizar localStorage con items únicos
            localStorage.setItem('shoppingCart', JSON.stringify(uniqueItems));
        }
        setLoading(false);
    }, []);

    // Función para eliminar un item del carrito
    const removeItem = (itemId) => {
        const updatedCart = cartItems.filter(item => item.id !== itemId);
        setCartItems(updatedCart);
        localStorage.setItem('shoppingCart', JSON.stringify(updatedCart));
    };

    // Función para limpiar todo el carrito
    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('shoppingCart');
    };

    // Separar juegos gratuitos de los pagos
    const freeGames = cartItems.filter(item => item.price === 0);
    const paidGames = cartItems.filter(item => item.price > 0);

    // Calcular el total solo de juegos pagos
    const calculateTotal = () => {
        return paidGames.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    // Función para "descargar" juegos gratuitos
    const handleDownloadFreeGames = () => {
        if (freeGames.length === 0) return;

        // Simular descarga/activación de juegos gratuitos
        const gameNames = freeGames.map(game => game.title).join(', ');

        // Aquí podrías agregar los juegos a la biblioteca del usuario
        // Por ejemplo, guardar en localStorage como juegos adquiridos
        const existingLibrary = JSON.parse(localStorage.getItem('userLibrary') || '[]');
        const newGames = freeGames.filter(game =>
            !existingLibrary.some(libGame => libGame.id === game.id)
        );

        if (newGames.length > 0) {
            const updatedLibrary = [...existingLibrary, ...newGames.map(game => ({
                ...game,
                downloadedAt: new Date().toISOString()
            }))];
            localStorage.setItem('userLibrary', JSON.stringify(updatedLibrary));
        }

        // Remover juegos gratuitos del carrito
        const updatedCart = cartItems.filter(item => item.price > 0);
        setCartItems(updatedCart);
        localStorage.setItem('shoppingCart', JSON.stringify(updatedCart));

        alert(`¡Juegos descargados exitosamente!\n${gameNames}\n\nYa están disponibles en tu biblioteca.`);
    };

    // Función para proceder al checkout solo con juegos pagos
    const handleCheckout = () => {
        if (paidGames.length === 0) return;

        // Guardar solo los juegos pagos para el checkout
        const checkoutData = {
            items: paidGames,
            total: calculateTotal(),
            timestamp: new Date().toISOString()
        };

        // Guardar datos del checkout en localStorage para pasarlos a la página de pago
        localStorage.setItem('checkoutData', JSON.stringify(checkoutData));

        // Redirigir a la página de checkout/pago
        router.push('/shoppingCart/checkout');
    };

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <section className="flex-1 bg-gradient-to-b from-[#06174d] via-black to-[#06174d] text-white py-10 flex items-center justify-center">
                    <div className="text-xl">Cargando carrito...</div>
                </section>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <section className="flex-1 bg-gradient-to-b from-[#06174d] via-black to-[#06174d] text-white py-10">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-4xl font-bold text-[#3a6aff]">Carrito de Compras</h1>
                        <button
                            onClick={() => router.back()}
                            className="text-gray-400 hover:text-red-400 transition text-3xl font-bold bg-[#222] rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
                            title="Volver"
                            aria-label="Volver"
                            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
                        >
                            ×
                        </button>
                    </div>

                    {cartItems.length === 0 ? (
                        <div className="bg-[#222] p-8 rounded-2xl shadow-2xl text-center">
                            <div className="text-6xl mb-4">🛒</div>
                            <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
                            <p className="text-gray-300 mb-6">¡Explora nuestra tienda y encuentra juegos increíbles!</p>
                            <button
                                onClick={() => router.push('/store')}
                                className="bg-[#3a6aff] hover:bg-[#2952ff] px-6 py-3 rounded-lg transition-colors font-semibold"
                            >
                                Explorar Juegos
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Lista de items del carrito */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Juegos Gratuitos */}
                                {freeGames.length > 0 && (
                                    <div>
                                        <h2 className="text-2xl font-bold mb-4 text-green-400">🎁 Juegos Gratuitos</h2>
                                        <div className="space-y-4">
                                            {freeGames.map((item) => (
                                                <div key={item.id} className="bg-[#222] p-6 rounded-2xl shadow-lg flex items-center gap-6 border-l-4 border-green-400">
                                                    <img
                                                        src={item.image || '/images/default-game.png'}
                                                        alt={item.title}
                                                        className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                                                        onError={(e) => {
                                                            e.target.src = '/images/default-game.png';
                                                        }}
                                                    />

                                                    <div className="flex-grow">
                                                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                                        {item.category && (
                                                            <span className="inline-block bg-[#3a6aff] text-white text-xs px-3 py-1 rounded-full mb-2">
                                                                {item.category}
                                                            </span>
                                                        )}
                                                        <p className="text-2xl font-bold text-green-400">
                                                            GRATIS
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors text-sm"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Juegos de Pago */}
                                {paidGames.length > 0 && (
                                    <div>
                                        <h2 className="text-2xl font-bold mb-4 text-[#3a6aff]">💳 Juegos de Pago</h2>
                                        <div className="space-y-4">
                                            {paidGames.map((item) => (
                                                <div key={item.id} className="bg-[#222] p-6 rounded-2xl shadow-lg flex items-center gap-6">
                                                    <img
                                                        src={item.image || '/images/default-game.png'}
                                                        alt={item.title}
                                                        className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                                                        onError={(e) => {
                                                            e.target.src = '/images/default-game.png';
                                                        }}
                                                    />

                                                    <div className="flex-grow">
                                                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                                        {item.category && (
                                                            <span className="inline-block bg-[#3a6aff] text-white text-xs px-3 py-1 rounded-full mb-2">
                                                                {item.category}
                                                            </span>
                                                        )}
                                                        <p className="text-2xl font-bold text-[#3a6aff]">
                                                            ${item.price.toLocaleString("es-CO")}
                                                        </p>
                                                        <p className="text-sm text-gray-400">
                                                            Cantidad: {item.quantity}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors text-sm"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Resumen del carrito */}
                            <div className="lg:col-span-1">
                                <div className="bg-[#222] p-6 rounded-2xl shadow-lg sticky top-4 space-y-6">
                                    {/* Sección de juegos gratuitos */}
                                    {freeGames.length > 0 && (
                                        <div className="border-b border-gray-600 pb-6">
                                            <h3 className="text-xl font-bold mb-4 text-green-400">🎁 Juegos Gratuitos</h3>
                                            <div className="space-y-2 mb-4">
                                                {freeGames.map((item) => (
                                                    <div key={item.id} className="flex justify-between text-sm">
                                                        <span className="truncate mr-2">{item.title}</span>
                                                        <span className="font-semibold text-green-400">GRATIS</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                onClick={handleDownloadFreeGames}
                                                className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg transition-colors font-semibold"
                                            >
                                                Obtener Juegos Gratuitos
                                            </button>
                                        </div>
                                    )}

                                    {/* Sección de juegos de pago */}
                                    {paidGames.length > 0 && (
                                        <div>
                                            <h3 className="text-xl font-bold mb-4 text-[#3a6aff]">💳 Resumen de Compra</h3>
                                            <div className="space-y-2 mb-4">
                                                {paidGames.map((item) => (
                                                    <div key={item.id} className="flex justify-between text-sm">
                                                        <span className="truncate mr-2">{item.title} x{item.quantity}</span>
                                                        <span className="font-semibold">
                                                            ${(item.price * item.quantity).toLocaleString("es-CO")}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            <hr className="border-gray-600 mb-4" />

                                            <div className="flex justify-between text-xl font-bold mb-6">
                                                <span>Total a Pagar:</span>
                                                <span className="text-[#3a6aff]">
                                                    ${calculateTotal().toLocaleString("es-CO")}
                                                </span>
                                            </div>

                                            <button
                                                onClick={handleCheckout}
                                                className="w-full bg-[#3a6aff] hover:bg-[#2952ff] py-3 rounded-lg transition-colors font-semibold text-lg"
                                            >
                                                Proceder al Pago
                                            </button>
                                        </div>
                                    )}

                                    {/* Botón para limpiar carrito */}
                                    <button
                                        onClick={clearCart}
                                        className="w-full bg-gray-600 hover:bg-gray-700 py-2 rounded-lg transition-colors text-sm"
                                    >
                                        Limpiar Carrito
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
            <Footer />
        </div>
    );
}