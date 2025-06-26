import React, { useState, useEffect } from 'react';

const GameCarousel = ({ featuredGames = [] }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-slide functionality
    useEffect(() => {
        if (featuredGames.length > 1) {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % featuredGames.length);
            }, 5000); // Change slide every 5 seconds

            return () => clearInterval(interval);
        }
    }, [featuredGames.length]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const limitText = (text, max) => {
        return text && text.length > max ? text.slice(0, max) + "..." : text || '';
    };

    return (
        <section className="relative h-[420px] md:h-[700px] overflow-hidden">
            {/* Carousel Container */}
            <div className="relative h-full">
                {/* Carousel Items */}
                <div className="relative h-full">
                    {featuredGames.map((juego, index) => (
                        <div
                            key={juego.id || index}
                            className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                }`}
                        >
                            {/* Background Image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                                style={{
                                    backgroundImage: `url('/images/${juego.image}')`,
                                }}
                            >
                                {/* Dark overlay */}
                                <div className="absolute inset-0 bg-black/40"></div>
                            </div>

                            {/* Content */}
                            <div className="relative z-10 h-full flex items-center">
                                <div className="container mx-auto px-4">
                                    <div className="grid md:grid-cols-12 gap-8 items-center h-full">
                                        {/* Text Content */}
                                        <div className="md:col-span-5 md:col-start-2">
                                            <div className="text-white space-y-6">
                                                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                                                    <span
                                                        className="block drop-shadow-lg"
                                                        style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)' }}
                                                    >
                                                        {juego.titulo}
                                                    </span>
                                                    <span
                                                        className="block text-2xl md:text-3xl mt-2"
                                                        style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)' }}
                                                    >
                                                        {juego.categoria?.nombre_categoria || juego.categoria || 'Sin Categoría'}
                                                    </span>
                                                </h1>

                                                <p
                                                    className="text-lg md:text-xl leading-relaxed max-w-lg"
                                                    style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 1)' }}
                                                >
                                                    {limitText(juego.descripcion, 200)}
                                                </p>

                                                <div className="pt-4">
                                                    <a
                                                        href={`/tienda/${juego.id}`}
                                                        className="inline-block bg-[#fff] hover:bg-[#3a6aff] text-black py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                                    >
                                                        Compra ahora
                                                    </a>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Image */}
                                        <div className="md:col-span-6 flex justify-center">
                                            <div className="relative">
                                                <img
                                                    src={`/images/${juego.image}`}
                                                    alt={juego.titulo}
                                                    className="w-full max-w-lg min-w-[320px] h-auto max-h-[500px] min-h-[320px] object-cover rounded-lg shadow-2xl"
                                                    style={{
                                                        filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3))',
                                                        background: '#222',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Carousel Indicators ABAJO */}
                            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 w-full flex justify-center">
                                <div className="flex space-x-2">
                                    {featuredGames.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => goToSlide(idx)}
                                            className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-[#000] scale-110' : 'bg-white/50 hover:bg-white/70'
                                                }`}
                                            aria-label={`Ir al slide ${idx + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GameCarousel;