"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from 'app/components/header';
import Footer from 'app/components/footer';
import LibraryService from 'app/services/api/library';
import PublicGameService from 'app/services/api/publicGames';
import { toast } from 'react-hot-toast';

function SelectGameContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const requestedGameId = searchParams.get('requested');

    const [library, setLibrary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!requestedGameId) {
            setError('No se especificó un juego para intercambiar.');
            setLoading(false);
            return;
        }

        const fetchLibrary = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) {
                    toast.error("Debes iniciar sesión para ver tu biblioteca.");
                    router.push('/login');
                    return;
                }
                const data = await LibraryService.getUserLibrary(token);
                const filteredLibrary = data.filter(game => game.id.toString() !== requestedGameId);
                setLibrary(filteredLibrary);
            } catch (err) {
                setError('Error al cargar tu biblioteca.');
            } finally {
                setLoading(false);
            }
        };

        fetchLibrary();
    }, [requestedGameId, router]);

    const handleSelectGame = (offeredGameId) => {
        router.push(`/exchange/confirm?requested=${requestedGameId}&offered=${offeredGameId}`);
    };

    if (loading) return <div className="text-center p-10">Cargando tu biblioteca...</div>;
    if (error) return <div className="text-center p-10 text-red-400">{error}</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8">Selecciona un Juego para Intercambiar</h1>
            <p className="text-center text-gray-400 mb-8">Elige uno de los juegos de tu biblioteca para ofrecer a cambio.</p>
            
            {library.length === 0 ? (
                <p className="text-center text-gray-500">No tienes juegos en tu biblioteca para intercambiar.</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {library.map(game => (
                        <div key={game.id} className="bg-gray-800 p-4 rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-105" onClick={() => handleSelectGame(game.id)}>
                            <img src={PublicGameService.getImageUrl(game.imagePath)} alt={game.title} className="w-full h-40 object-cover rounded-md mb-3" />
                            <h3 className="text-md font-semibold truncate">{game.title}</h3>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function SelectGameForExchangePage() {
    return (
        <div className="flex flex-col min-h-screen hero_area">
            <Header />
            <main className="flex-1 bg-gradient-to-b from-[#06174d] via-black to-[#06174d] text-white p-4 md:p-8">
                <Suspense fallback={<div className="text-center p-10">Cargando...</div>}>
                    <SelectGameContent />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
