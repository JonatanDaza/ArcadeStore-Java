export default function GamesGallery({ juegos = [], titulo = "Juegos" }) {
  return (
    <section className="w-full">
      <h2 className="text-center mb-5 text-2xl font-bold">{titulo}</h2>
      <div className="flex justify-center flex-wrap gap-5 juegos-galeria">
        {juegos.length > 0 ? (
          juegos.map(juego => (
            <div
              key={juego.id}
              className="bg-[#2b2b2b] border border-[#333] rounded-lg w-[250px] text-center p-3 shadow transition-transform duration-300 juego-tarjeta hover:scale-105"
            >
              <img
                src={`/images/${juego.image}`}
                alt={juego.titulo}
                className="w-full rounded-lg mb-2"
              />
              <h3 className="text-lg font-bold my-2">{juego.titulo}</h3>
              <p className="text-sm text-white mb-3">{juego.descripcion?.slice(0, 100) ?? ""}{juego.descripcion?.length > 100 ? "..." : ""}</p>
              <a href={`/games/details/${juego.id}`}>
                <button className="bg-black text-white px-4 py-2 rounded hover:bg-[#06174d] transition">
                  Detalles
                </button>
              </a>
            </div>
          ))
        ) : (
          <p className="text-white">No hay juegos disponibles.</p>
        )}
      </div>
    </section>
  );
}