import React from 'react';

const RecentGames = ({ juegosRecientes = [] }) => {
  // Datos de ejemplo si no se pasan props
  const defaultGames = [
    {
      id: 1,
      titulo: "Red Dead Redemption 2",
      descripcion: "es una épica aventura de mundo abierto ambientada en el ocaso de la era del salvaje oeste americano. Únete a Arthur Morgan y la banda de Van der Linde...",
      image: "HALO4.png"
    },
    {
      id: 2,
      titulo: "Cyberpunk 2077",
      descripcion: "Un RPG de mundo abierto ambientado en Night City, una megalópolis obsesionada con el poder, el glamour y la modificación corporal. Juegas como V, un mercenario en busca de un implante único...",
      image: "GTAV.png"
    },
    {
      id: 3,
      titulo: "The Witcher 3",
      descripcion: "Como Geralt de Rivia, un cazador de monstruos conocido como brujo, embárcate en una aventura épica en un mundo fantástico rico en contenido y opciones significativas...",
      image: "FARCRY3.jpeg"
    }
  ];

  const recentGames = juegosRecientes.length > 0 ? juegosRecientes : defaultGames;

  const limitText = (text, limit = 150) => {
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  };

  return (
    <div className="py-16 flex-1">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-[#3a6aff] fw-blod mb-10">
          Juegos Recientes
        </h2>
        {(recentGames || []).map((juego, index) => (
          <section
            className="flex flex-col md:flex-row items-center mb-12 rounded-lg"
            key={juego.id}
          >
            <div className={`md:w-1/2 ${index % 2 !== 0 ? "md:order-2" : ""}`}>
              <img
                src={`/images/${juego.image}`}
                alt={juego.titulo}
                className="w-full h-auto"
              />
            </div>
            <div className="md:w-1/2 p-8">
              <h3 className="text-3xl font-bold text-[#3a6aff] fw-blod mb-10">
                {juego.titulo}
              </h3>
              <p className="mb-4 text-[#fff] leading-relaxed">
                {limitText(juego.descripcion, 150)}
              </p>
              <a
                href={`/tienda/${juego.id}`}
                className="inline-block bg-[#fff] hover:bg-[#3a6aff] text-black py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Más información
              </a>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default RecentGames;