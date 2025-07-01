"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from 'app/components/header';
import Footer from 'app/components/footer';
import LibraryService from 'app/services/api/library';
import GameCard from 'app/components/GameCard';
import toast, { Toaster } from 'react-hot-toast';

export default function Orders() {
    const [library, setLibrary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchLibrary = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                toast.error("Debes iniciar sesión para ver tu biblioteca.");
                router.push('/login');
                return;
            }

            try {
                const data = await LibraryService.getUserLibrary(token);
                setLibrary(data || []);
            } catch (err) {
                const errorMessage = err.message || "Error al cargar tu biblioteca.";
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchLibrary();
    }, [router]);

    return (
        <div className="flex flex-col w-auto h-auto">
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
            <main className="flex-1 text-white">
                <section className="">
                    <div className="max-w-auto mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[#3a6aff]">Mis Juegos</h1>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto px-4 pb-12">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 bg-red-900/20 border border-red-500 rounded-lg">
                            <p className="text-red-400">{error}</p>
                        </div>
                    ) : library.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {library.map(game => (
                                <GameCard key={game.id} game={game} isOwned={true} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-[#222] rounded-2xl">
                            <h2 className="text-2xl font-bold mb-4">Tu biblioteca está vacía</h2>
                            <p className="text-gray-400 mb-6">¡Explora la tienda para encontrar tu próximo juego favorito!</p>
                            <button
                                onClick={() => router.push('/games')}
                                className="bg-[#3a6aff] hover:bg-[#2952ff] px-8 py-3 rounded-lg transition-colors font-semibold"
                            >
                                Ir a la Tienda
                            </button>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}