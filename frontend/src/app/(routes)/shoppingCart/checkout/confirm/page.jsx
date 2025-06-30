"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from 'app/components/header';
import Footer from 'app/components/footer';

export default function OrderConfirmationPage() {
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Generar datos de la orden (en una app real, esto vendría del servidor)
        const generateOrderData = () => {
            const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;
            const estimatedDelivery = new Date();
            estimatedDelivery.setDate(estimatedDelivery.getDate() + 3); // 3 días después

            return {
                orderNumber,
                date: new Date().toLocaleDateString('es-CO'),
                estimatedDelivery: estimatedDelivery.toLocaleDateString('es-CO'),
                status: 'Confirmado',
                email: 'usuario@ejemplo.com' // En una app real, esto vendría del formulario
            };
        };

        setOrderData(generateOrderData());
        setLoading(false);

        // Opcional: limpiar cualquier dato restante del checkout
        localStorage.removeItem('checkoutData');
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <section className="flex-1 bg-gradient-to-b from-[#06174d] via-black to-[#06174d] text-white py-10 flex items-center justify-center">
                    <div className="text-xl">Cargando confirmación...</div>
                </section>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
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
                                    <span className="font-bold text-[#3a6aff]">{orderData.orderNumber}</span>
                                </div>
                                
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Fecha:</span>
                                    <span className="font-semibold">{orderData.date}</span>
                                </div>
                                
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Estado:</span>
                                    <span className="font-semibold text-green-400">{orderData.status}</span>
                                </div>
                                
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Entrega estimada:</span>
                                    <span className="font-semibold">{orderData.estimatedDelivery}</span>
                                </div>
                            </div>
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
                                    const orderInfo = `Pedido: ${orderData.orderNumber}\nFecha: ${orderData.date}\nEstado: ${orderData.status}`;
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