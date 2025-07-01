"use client";

import { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from 'app/components/header';
import Footer from 'app/components/footer';
import ExchangeService from '@/services/api/exchangeService';
import { toast } from 'react-hot-toast';
import { CheckCircle, ArrowRight, Library } from 'lucide-react';

function ReceiptContent() {
    const params = useParams();
    const router = useRouter();
    const exchangeId = params?.id;

    const [exchange, setExchange] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!exchangeId) {
            setError('No se proporcionó un ID de intercambio.');
            setLoading(false);
            return;
        }

        const fetchExchange = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) {
                    toast.error("Sesión no encontrada. Redirigiendo al login.");
                    router.push('/login');
                    return;
                }
                const data = await ExchangeService.getExchangeById(exchangeId, token);
                setExchange(data);
            } catch (err) {
                setError('Error al cargar los detalles del recibo.');
                toast.error('Error al cargar el recibo.');
            } finally {
                setLoading(false);
            }
        };

        fetchExchange();
    }, [exchangeId, router]);

    if (loading) {
        return (
            <div className="text-center p-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                Cargando recibo...
            </div>
        );
    }

    if (error) {
        return <div className="text-center p-10 text-red-400">{error}</div>;
    }

    if (!exchange) {
        return <div className="text-center p-10 text-gray-400">No se encontraron detalles del intercambio.</div>;
    }

    return (
        <div className="max-w-2xl mx-auto bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-gray-700">
            <div className="text-center mb-8">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-white">¡Intercambio Completado!</h1>
                <p className="text-gray-400 mt-2">Tu biblioteca ha sido actualizada.</p>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 text-center text-gray-300">Resumen de la Transacción</h2>
                <div className="flex items-center justify-between text-center">
                    <div className="flex-1">
                        <p className="text-sm text-gray-500">Juego Ofrecido</p>
                        <p className="font-bold text-lg text-red-400">{exchange.offeredGameTitle}</p>
                    </div>
                    <ArrowRight className="w-8 h-8 text-blue-500 mx-4" />
                    <div className="flex-1">
                        <p className="text-sm text-gray-500">Juego Recibido</p>
                        <p className="font-bold text-lg text-green-400">{exchange.requestedGameTitle}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-400">ID de Intercambio:</span>
                    <span className="font-mono text-gray-300">#{exchange.id}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Fecha:</span>
                    <span className="text-gray-300">{new Date(exchange.exchangeDate).toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between border-t border-gray-700 pt-3 mt-3">
                    <span className="text-lg font-semibold text-gray-300">Costo Adicional Pagado:</span>
                    <span className="text-lg font-bold text-green-400">
                        {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(exchange.additionalCost)}
                    </span>
                </div>
            </div>

            <div className="mt-8 text-center">
                <button
                    onClick={() => router.push('/library')}
                    className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center mx-auto"
                >
                    <Library className="w-5 h-5 mr-2" />
                    Ir a mi Biblioteca
                </button>
            </div>
        </div>
    );
}

export default function ExchangeReceiptPage() {
    return (
        <div className="flex flex-col min-h-screen hero_area">
            <Header />
            <main className="flex-1 bg-gradient-to-b from-[#06174d] via-black to-[#06174d] text-white p-4 md:p-8 flex items-center justify-center">
                <Suspense fallback={<div className="text-center p-10">Cargando...</div>}>
                    <ReceiptContent />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}


    
