"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from 'app/components/header';
import Footer from 'app/components/footer';
import PublicGameService from 'app/services/api/publicGames';
import { toast } from 'react-hot-toast';
import { FaExchangeAlt, FaArrowLeft } from 'react-icons/fa';
import ExchangeService from 'app/services/api/exchangeService';

// Componente para mostrar la tarjeta de un juego
function GameCard({ game, type }) {
    const [imageError, setImageError] = useState(false);

    if (!game) {
        return (
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-center animate-pulse">
                <div className="w-full h-48 bg-gray-700 rounded-md mb-3"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto"></div>
            </div>
        );
    }

    const imageUrl = imageError 
        ? '/images/default-game.png' 
        : PublicGameService.getImageUrl(game.imagePath);

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-center flex flex-col h-full">
            <h3 className="text-lg font-semibold mb-2 text-yellow-400">{type}</h3>
            <div className="flex-grow flex flex-col justify-center">
                <img 
                    src={imageUrl} 
                    alt={game.title} 
                    className="w-full h-48 object-cover rounded-md mb-3"
                    onError={() => setImageError(true)}
                />
                <h4 className="text-md font-semibold truncate text-white">{game.title}</h4>
                <p className="text-sm text-gray-400">{game.category?.name || 'Sin categoría'}</p>
            </div>
        </div>
    );
}

function ExchangeConfirmationContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const requestedGameId = searchParams.get('requested');
    const offeredGameId = searchParams.get('offered');

    const [requestedGame, setRequestedGame] = useState(null);
    const [offeredGame, setOfferedGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [finalAmount, setFinalAmount] = useState(0);
    const [commission, setCommission] = useState(0);

    useEffect(() => {
        if (!requestedGameId || !offeredGameId) {
            setError('Faltan datos para el intercambio.');
            setLoading(false);
            return;
        }

        const fetchGames = async () => {
            try {
                const [reqGameData, offGameData] = await Promise.all([
                    PublicGameService.getGameById(requestedGameId),
                    PublicGameService.getGameById(offeredGameId)
                ]);
                setRequestedGame(reqGameData);
                setOfferedGame(offGameData);

                // --- Lógica de cálculo de intercambio ---
                if (reqGameData && offGameData && typeof reqGameData.price === 'number' && typeof offGameData.price === 'number') {
                    const requestedPrice = reqGameData.price;
                    const offeredPrice = offGameData.price;
                    let commissionAmount = 0;

                    // La comisión del 10% se aplica a menos que el juego solicitado sea muy barato
                    // Condición: "si el precio del juego solicitado es menor un 10% del juego ofrecido el costo por el intercambio es gratis"
                    if (requestedPrice >= (offeredPrice * 0.10)) {
                        commissionAmount = offeredPrice * 0.10;
                    }

                    // El monto final es la diferencia de precios más la comisión (si aplica)
                    const totalAmount = (requestedPrice - offeredPrice) + commissionAmount;

                    setCommission(commissionAmount);
                    setFinalAmount(totalAmount);
                }
            } catch (err) {
                setError('Error al cargar los detalles de los juegos.');
                toast.error('No se pudieron cargar los juegos para el intercambio.');
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, [requestedGameId, offeredGameId]);

    const handleConfirmExchange = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            toast.error('Debes iniciar sesión para confirmar el intercambio.');
            router.push('/login');
            return;
        }

        const toastId = toast.loading('Iniciando intercambio...');
      try {
        // Paso 1: Crear el intercambio para obtener su ID y el costo real del backend.
        const exchangeDetails = { requestedGameId, offeredGameId };
        const createdExchange = await ExchangeService.createExchange(exchangeDetails, token);
        
        toast.dismiss(toastId);

        // Paso 2: Decidir el siguiente paso basado en el costo.
        if (createdExchange.additionalCost > 0) {
          // Hay un costo, redirigir a la página de pago.
          const paymentDetails = {
            isExchange: true,
            exchangeId: createdExchange.id, // ✅ Guardamos el ID del intercambio
            items: [{
              id: `exchange-${createdExchange.id}`,
              title: `Excedente por Intercambio: ${createdExchange.requestedGameTitle}`,
              price: createdExchange.additionalCost,
              image: PublicGameService.getImageUrl(requestedGame.imagePath),
              quantity: 1,
            }],
            total: createdExchange.additionalCost,
          };
          localStorage.setItem('paymentIntent', JSON.stringify(paymentDetails));
          toast.loading('Redirigiendo al pago...');
          router.push('/exchange/checkout');

        } else {
          // No hay costo, completar el intercambio inmediatamente.
          const completeToastId = toast.loading('Confirmando intercambio gratuito...');
          await ExchangeService.completeExchange(createdExchange.id, token);
          toast.success('¡Intercambio realizado con éxito!', { id: completeToastId });
          router.push(`/exchange/receipt/${createdExchange.id}`);
        }

      } catch (error) {
        toast.dismiss(toastId);
        console.error("Error durante el proceso de intercambio:", error);
        const errorMessage = error.response?.data?.message || error.message || 'No se pudo iniciar el intercambio.';
        toast.error(errorMessage);
        }
    };

    if (loading) return <div className="text-center p-10">Cargando detalles del intercambio...</div>;
    if (error) return <div className="text-center p-10 text-red-400">{error}</div>;
    if (!requestedGame || !offeredGame) return <div className="text-center p-10 text-gray-400">No se pudieron cargar los datos de los juegos.</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-300 hover:text-white mb-6">
                <FaArrowLeft />
                Volver
            </button>
            <h1 className="text-3xl font-bold text-center mb-8">Confirmar Intercambio</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <GameCard game={offeredGame} type="Juego que ofreces" />
                <div className="text-center">
                    <FaExchangeAlt className="text-5xl text-green-400 mx-auto" />
                </div>
                <GameCard game={requestedGame} type="Juego que solicitas" />
            </div>

            {/* Resumen de la transacción */}
            {finalAmount !== null && (
                <div className="mt-10 p-6 bg-gray-900 rounded-lg shadow-inner max-w-md mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-4 text-yellow-400">Resumen del Intercambio</h2>
                    <div className="space-y-3 text-lg">
                        <div className="flex justify-between">
                            <span className="text-gray-300">Valor del juego solicitado:</span>
                            <span className="font-semibold text-white">${(requestedGame.price || 0).toLocaleString('es-CO')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-300">Crédito por tu juego:</span>
                            <span className="font-semibold text-green-400">-${(offeredGame.price || 0).toLocaleString('es-CO')}</span>
                        </div>
                        {commission > 0 && (
                            <div className="flex justify-between">
                                <span className="text-gray-300">Comisión de servicio:</span>
                                <span className="font-semibold text-red-400">+${commission.toLocaleString('es-CO')}</span>
                            </div>
                        )}
                        <div className="border-t border-gray-700 my-2"></div>
                        <div className="flex justify-between text-xl">
                            <span className="font-bold text-yellow-400">
                                {finalAmount > 0 ? 'Excedente a pagar:' : (finalAmount < 0 ? 'Saldo a tu favor:' : 'Total:')}
                            </span>
                            <span className="font-bold text-white">${Math.abs(finalAmount).toLocaleString('es-CO')}</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="text-center mt-12">
                <button 
                    onClick={handleConfirmExchange}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform hover:scale-105"
                >
                    {finalAmount > 0 ? `Pagar $${finalAmount.toLocaleString('es-CO')} y Confirmar` : 'Confirmar Intercambio'}
                </button>
            </div>
        </div>
    );
}

export default function ExchangeConfirmationPage() {
    return (
        <div className="flex flex-col min-h-screen hero_area">
            <Header />
            <main className="flex-1 bg-gradient-to-b from-[#06174d] via-black to-[#06174d] text-white p-4 md:p-8">
                <Suspense fallback={<div className="text-center p-10">Cargando...</div>}>
                    <ExchangeConfirmationContent />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
