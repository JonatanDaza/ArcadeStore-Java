"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from 'app/components/header';
import Footer from 'app/components/footer';
import SalesService from 'app/services/api/sales';
import toast, { Toaster } from 'react-hot-toast';

export default function OrderConfirmationPage() {
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const orderId = searchParams.get('orderId');

        if (!orderId) {
            toast.error("No se encontró un ID de orden para mostrar.");
            router.push('/store');
            return;
        }

        const fetchOrderDetails = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                toast.error("Sesión no encontrada. Redirigiendo al login.");
                router.push('/login');
                return;
            }

            try {
                const data = await SalesService.getSaleDetails(orderId, token);
                if (data.success) {
                    setOrderData(data);
                } else {
                    throw new Error(data.message || "No se pudieron cargar los detalles de la orden.");
                }
            } catch (err) {
                setError(err.message || "Error al cargar los detalles de la orden.");
                toast.error(err.message || "Error al cargar los detalles de la orden.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [router, searchParams]);

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <section className="flex-1 bg-gradient-to-b from-[#06174d] via-black to-[#06174d] text-white py-10 flex items-center justify-center">
                    <div className="text-xl animate-pulse">Cargando confirmación...</div>
                </section>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <section className="flex-1 bg-gradient-to-b from-[#06174d] via-black to-[#06174d] text-white py-10 flex items-center justify-center">
                    <div className="text-center bg-red-900/50 p-8 rounded-lg">
                        <h2 className="text-2xl font-bold text-red-400 mb-4">Error al cargar la orden</h2>
                        <p className="text-gray-300 mb-6">{error}</p>
                        <button
                            onClick={() => router.push('/store')}
                            className="bg-[#3a6aff] hover:bg-[#2952ff] px-6 py-3 rounded-lg transition-colors font-semibold"
                        >
                            Volver a la Tienda
                        </button>
                    </div>
                </section>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <Toaster
                position="top-right"
                containerStyle={{ top: '8rem' }}
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#333',
                        color: '#fff',
                    },
                }}
            />
            <section className="flex-1 bg-gradient-to-b from-[#06174d] via-black to-[#06174d] text-white py-10">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-[#222] p-8 md:p-12 rounded-2xl shadow-2xl text-center">
                        {/* Icono de éxito */}
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>

                        {/* Título principal */}
                        <h1 className="text-4xl md:text-5xl font-bold text-green-400 mb-4">
                            ¡Pago Exitoso!
                        </h1>

                        <p className="text-xl text-gray-300 mb-8">
                            Tu pedido ha sido procesado correctamente
                        </p>

                        {/* Información del pedido */}
                        <div className="bg-[#333] rounded-xl p-6 mb-8 text-left max-w-md mx-auto">
                            <h2 className="text-2xl font-bold text-[#3a6aff] mb-4 text-center">
                                Detalles del Pedido
                            </h2>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Número de pedido:</span>
                                    <span className="font-bold text-[#3a6aff]">{orderData?.orderNumber || 'N/A'}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-300">Fecha:</span>
                                    <span className="font-semibold">{orderData?.createdAt ? new Date(orderData.createdAt).toLocaleDateString('es-CO') : 'N/A'}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-300">Estado:</span>
                                    <span className="font-semibold text-green-400">{orderData?.orderStatus || 'Confirmado'}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-300">Monto Total:</span>
                                    <span className="font-semibold text-green-400">
                                        ${(orderData?.totalAmount || 0).toLocaleString('es-CO')}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-300">Método de Pago:</span>
                                    <span className="font-semibold">{orderData?.paymentMethod || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Juegos Comprados */}
                        <div className="bg-[#333] rounded-xl p-6 mb-8 text-left max-w-md mx-auto">
                            <h3 className="text-xl font-bold text-white mb-4 text-center">Juegos Adquiridos</h3>
                            <ul className="space-y-2">
                                {orderData?.purchasedGames?.map(game => (
                                    <li key={game.id} className="text-gray-300 text-center">{game.title || 'Nombre no disponible'}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Información adicional */}
                        <div className="bg-blue-900/30 border border-blue-500/50 rounded-xl p-6 mb-8">
                            <div className="flex items-center justify-center mb-3">
                                <svg className="w-6 h-6 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <h3 className="text-lg font-semibold text-blue-400">Información importante</h3>
                            </div>
                            <div className="text-sm text-gray-300 space-y-2">
                                <p>• Recibirás un email de confirmación con los detalles de tu compra</p>
                                <p>• Los juegos digitales estarán disponibles inmediatamente en tu biblioteca</p>
                                <p>• Podrás descargar tus juegos desde tu perfil de usuario</p>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => router.push('/games')}
                                className="bg-[#3a6aff] hover:bg-[#2952ff] px-8 py-3 rounded-lg transition-colors font-semibold text-lg"
                            >
                                Seguir Comprando
                            </button>

                            <button
                                onClick={() => router.push('/library')}
                                className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg transition-colors font-semibold text-lg"
                            >
                                Ver Mis Juegos
                            </button>

                            <button
                                onClick={() => {
                                    const orderInfo = `Pedido: ${orderData?.orderNumber}\nFecha: ${new Date(orderData?.createdAt).toLocaleDateString('es-CO')}\nEstado: ${orderData?.orderStatus}`;
                                    navigator.clipboard.writeText(orderInfo);
                                    alert('Información del pedido copiada al portapapeles');
                                }}
                                className="bg-gray-600 hover:bg-gray-700 px-8 py-3 rounded-lg transition-colors font-semibold text-lg"
                            >
                                Copiar Info
                            </button>
                        </div>

                        {/* Mensaje de agradecimiento */}
                        <div className="mt-8 pt-6 border-t border-gray-600">
                            <p className="text-gray-400">
                                ¡Gracias por tu compra! Esperamos que disfrutes tus nuevos juegos.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}