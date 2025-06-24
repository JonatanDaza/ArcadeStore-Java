'use client';

import { useState, useEffect } from "react";
import React from "react";
import Header from "./components/header";
import Footer from "./components/footer";
import CarouselClientes from "./components/carouselClients";
import GameCarousel from "./components/carouselGames";
import RecentGames from "./components/recentGames";

const HomePage = () => {
  // Obtener el rol del usuario desde localStorage o estado global
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [userNick, setUserNick] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Simulación: obtener datos del usuario autenticado
    const storedRole = localStorage.getItem("userRole");
    const storedName = localStorage.getItem("userName");
    const storedNick = localStorage.getItem("userNick");
    const storedId = localStorage.getItem("userId");

    setUserRole(storedRole);
    setUserName(storedName || "Arcade");
    setUserNick(storedNick || "ArcadeAdmin");
    setUserId(storedId || 123);
    setIsAuthenticated(!!storedRole);
  }, []);


  const featuredGames = [
    {
      id: 1,
      titulo: "GTA V",
      descripcion: "Un ... de mundo ...",
      image: "GTAV.png",
      categoria: { nombre_categoria: "..." }
    },
    {
      id: 2,
      titulo: "Dragon ball sparking zero",
      descripcion: "Un ... de mundo ...",
      image: "Dragon ball sparking zero.png",
      categoria: { nombre_categoria: "..." }
    },
    {
      id: 3,
      titulo: "HALO 4",
      descripcion: "Un ... de mundo ...",
      image: "HALO4.png",
      categoria: { nombre_categoria: "..." }
    },
    {
      id: 4,
      titulo: "FARCRY 3",
      descripcion: "Un ... de mundo ...",
      image: "FARCRY3.jpeg",
      categoria: { nombre_categoria: "..." }
    },
  ];

  const recentGames = [
    {
      id: 1,
      titulo: "Red Dead Redemption 2",
      descripcion: "es una épica aventura de mundo abierto ambientada en el ocaso de la era del salvaje oeste americano. Únete a Arthur Morgan y la banda de Van der Linde...",
      image: "Red Dead Redeption 2.png"
    },
    {
      id: 2,
      titulo: "Borderlands 2",
      descripcion: "Un RPG de mundo abierto ambientado en Night City, una megalópolis obsesionada con el poder, el glamour y la modificación corporal. Juegas como V, un mercenario en busca de un implante único...",
      image: "Borderlands 2.png"
    },
    {
      id: 3,
      titulo: "Dragon ball sparking zero",
      descripcion: "Como Geralt de Rivia, un cazador de monstruos conocido como brujo, embárcate en una aventura épica en un mundo fantástico rico en contenido y opciones significativas...",
      image: "Dragon ball sparking zero.png"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#06174d]">
      <Header
        isAuthenticated={isAuthenticated}
        userRole={userRole}
        userName={userName}
        userNick={userNick}
        userId={userId}
      />
      <main
        className="flex-1 font-poppins text-white flex flex-col"
        style={{
          backgroundImage:
            "linear-gradient(180deg, #000 -2%, #06174d 90%, #000 100%)",
          margin: 0,
        }}
      >
        {/* Solo muestra el carousel si hay juegos */}
        {featuredGames.length > 0 && (
          <GameCarousel featuredGames={featuredGames} />
        )}
        {/* Juegos Recientes */}
        {recentGames.length > 0 && (
          <RecentGames juegosRecientes={recentGames} />        )}
        {/* Service Section */}
        <section className="py-16 flex-1">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold fw-blod text-[#fff] mb-10">
              NUEVOS{" "}
              <span className="text-[#3a6aff] fw-blod">JUEGOS</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg">
                <h6 className="font-bold text-lg mb-2 text-gray-50">
                  COMPRA HOY
                </h6>
                <p className="mb-4 text-[#fff] leading-relaxed">
                  ¡No te pierdas nuestras ofertas de hoy! Aprovecha increíbles
                  descuentos en una selección de los mejores videojuegos de PC. Es
                  el momento perfecto para ampliar tu colección y disfrutar de
                  títulos únicos a precios irresistibles. La promoción es por
                  tiempo limitado.
                </p>
              </div>
              <div className="p-6 rounded-lg">
                <h6 className="font-bold text-lg mb-2 text-gray-50">
                  INTERCAMBIA VIDEOJUEGO
                </h6>
                <p className="mb-4 text-[#fff] leading-relaxed">
                  ¿Te gustaría probar algo nuevo? Aprovecha nuestra opción de
                  intercambio y renueva tu colección sin gastar de más. Puedes
                  cambiar tus juegos de PC usados por otros títulos de igual o
                  menor valor sin costo adicional. Si prefieres un juego de mayor
                  valor, solo tendrás que pagar la diferencia.
                </p>
              </div>
              <div className="p-6 rounded-lg">
                <h6 className="font-bold text-lg mb-2 text-gray-50">
                  COTIZA UN JUEGO
                </h6>
                <p className="mb-4 text-[#fff] leading-relaxed">
                  ¿Buscas el mejor precio para tu próximo videojuego? Con nuestra
                  opción de cotización personalizada, no solo te aseguramos el
                  precio ideal, sino que también puedes aprovechar nuestras
                  ofertas de hoy en una selección única de títulos de PC. ¡No dejes
                  pasar esta oportunidad para ampliar tu colección!
                </p>
              </div>
            </div>
            <div className="mt-8">
              <a
                href="/games"
                className="inline-block bg-[#fff] hover:bg-[#3a6aff] text-black py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Más información
              </a>
            </div>
          </div>
        </section>

        {/* Buy Section */}
        <section className="text-white py-16 flex-1">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">
              ¡TE INVITAMOS A CONOCER MÁS JUEGOS!
            </h2>
            <p className="mb-4">
              Explora nuestro catálogo y encuentra el título perfecto para ti.
              Reserva o intercambia tus videojuegos con al menos 7 días de
              anticipación para aprovechar precios especiales y descuentos
              exclusivos. ¡No te pierdas esta oportunidad de ampliar tu colección
              y disfrutar de los mejores juegos a precios increíbles!
            </p>
          </div>
          <br/>
          <br/>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">
              NUESTROS CLIENTES ESTAN FELICES...
            </h2>
            <p className="mb-4">
              El 25% de nuestros usuarios consiguió juegos de PC a precios
              increíbles, ¡por $100.000 o menos! Únete a ellos y encuentra los
              mejores títulos a precios inigualables. No dejes pasar esta
              oportunidad para ampliar tu colección y disfrutar de grandes
              aventuras.
            </p>
          <br/>
            {/* Carousel de clientes */}
            <CarouselClientes />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;