'use client';

import { useParams, useRouter } from "next/navigation";

// Simulación de datos de juegos
const mockGames = {
  "1": {
    id: "1",
    title: "GTA V",
    description: "Un juego de mundo abierto lleno de acción y aventuras.",
    genre: "Accion",
    price: 60000,
    image: "/images/GTAV.png",
    requisitos: {
      min: {
        os: "Windows 7/8/10 (64 bits)",
        cpu: "Intel Core 2 Quad CPU Q6600 @ 2.40GHz",
        ram: "4 GB",
        gpu: "NVIDIA 9800 GT 1GB / AMD HD 4870 1GB",
        storage: "72 GB disponibles"
      },
      rec: {
        os: "Windows 10 (64 bits)",
        cpu: "Intel Core i5 3470 @ 3.2GHZ",
        ram: "8 GB",
        gpu: "NVIDIA GTX 660 2GB / AMD HD7870 2GB",
        storage: "72 GB disponibles"
      }
    }
  },
  "2": {
    id: "2",
    title: "Dragon Ball Sparking Zero",
    description: "Un juego de peleas y aventuras en el universo Dragon Ball.",
    genre: "Aventura",
    price: 70000,
    image: "/images/Dragon ball sparking zero.png",
    requisitos: {
      min: {
        os: "Windows 10 (64 bits)",
        cpu: "Intel Core i3-4160",
        ram: "4 GB",
        gpu: "NVIDIA GTX 750Ti",
        storage: "40 GB disponibles"
      },
      rec: {
        os: "Windows 10 (64 bits)",
        cpu: "Intel Core i5-7600K",
        ram: "8 GB",
        gpu: "NVIDIA GTX 1060",
        storage: "40 GB disponibles"
      }
    }
  },
  "3": {
    id: "3",
    title: "HALO 4",
    description: "Un shooter de ciencia ficción y estrategia.",
    genre: "Estrategia",
    price: 50000,
    image: "/images/HALO4.png",
    requisitos: {
      min: {
        os: "Windows 7 (64 bits)",
        cpu: "AMD Phenom II X4 960T / Intel i3550",
        ram: "8 GB",
        gpu: "AMD HD 6850 / NVIDIA GeForce GTS 450",
        storage: "55 GB disponibles"
      },
      rec: {
        os: "Windows 10 (64 bits)",
        cpu: "AMD FX-4100 / Intel i7-870",
        ram: "8 GB",
        gpu: "AMD Radeon R7 360 / NVIDIA GTX 560",
        storage: "55 GB disponibles"
      }
    }
  },
  "4": {
    id: "4",
    title: "Fortnite",
    description: "Battle Royale gratuito con mecánicas de construcción únicas.",
    genre: "Accion",
    price: 0, // Gratuito
    image: "/images/fornite.jpeg",
    requisitos: {
      min: {
        os: "Windows 7/8/10 (64 bits)",
        cpu: "Intel Core i3-3225 / AMD Phenom II X6 1100T",
        ram: "4 GB",
        gpu: "Intel HD 4000 / AMD Radeon HD 7870",
        storage: "26 GB disponibles"
      },
      rec: {
        os: "Windows 10 (64 bits)",
        cpu: "Intel Core i5-7300U / AMD Ryzen 3 1300X",
        ram: "8 GB",
        gpu: "NVIDIA GTX 960 / AMD R9 280",
        storage: "26 GB disponibles"
      }
    }
  }
};

export default function GameDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params?.id;
  const game = mockGames[gameId];

  if (!game) {
    return (
      <div className="flex min-h-screen bg-[#06174d] text-white items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold mb-4 text-red-400">404</h1>
          <h2 className="text-2xl font-bold mb-4">Juego no encontrado</h2>
          <p className="text-gray-300 mb-6">El juego que buscas no existe o ha sido eliminado.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-[#3a6aff] hover:bg-[#2952ff] px-6 py-3 rounded-lg transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
  //   if (game.price === 0) {
  //     alert("¡Juego gratuito añadido a la biblioteca!");
  //   } else {
  //     alert("¡Juego agregado al carrito!");
  //   }
  // };
  // const handleAddToCart = () => {
  // 1. Obtener el carrito actual del localStorage
  const existingCart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
  
  // 2. Verificar si el juego ya está en el carrito
  const existingItemIndex = existingCart.findIndex(item => item.id === game.id);
  
  if (existingItemIndex !== -1) {
    // Si ya existe, incrementar la cantidad
    existingCart[existingItemIndex].quantity += 1;
  } else {
    // Si no existe, agregarlo al carrito
    const cartItem = {
      id: game.id,
      title: game.title,
      price: game.price,
      image: game.image,
      genre: game.genre,
      quantity: 1
    };
    existingCart.push(cartItem);
  }
  // 3. Guardar el carrito actualizado en localStorage
  localStorage.setItem('shoppingCart', JSON.stringify(existingCart));
    
    // 4. Mostrar mensaje de confirmación
    if (game.price === 0) {
      alert("¡Juego gratuito añadido a la biblioteca!");
    } else {
      alert("¡Juego agregado al carrito!");
    }
    
    // 5. Redirigir al carrito de compras
    router.push('/shoppingCart');
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#06174d] via-black to-[#06174d] text-white font-sans flex items-center justify-center p-2">
      <div className="bg-[#222] rounded-2xl shadow-2xl flex flex-col lg:flex-row w-full max-w-6xl min-h-[600px] overflow-hidden relative">
        <button
          onClick={() => router.back()}
          className="absolute top-6 right-8 z-50 text-gray-400 hover:text-red-400 transition text-3xl font-bold bg-[#222] rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
          title="Volver"
          aria-label="Volver"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
        >
          ×
        </button>
        
        <div className="flex-shrink-0 flex items-center justify-center bg-black lg:w-[40%] w-full p-8">
          <img
            src={game.image}
            alt={game.title}
            className="w-full h-auto object-contain rounded-xl shadow-lg"
          />
        </div>
        
        <div className="flex-1 p-10 flex flex-col">
          <h1 className="text-5xl font-extrabold mb-3">{game.title}</h1>
          <span className="inline-block bg-[#3a6aff] text-white text-sm px-4 py-2 rounded-full mb-6 w-fit font-semibold">
            {game.genre}
          </span>
          <p className="text-gray-300 mb-8 text-lg">{game.description}</p>
          
          <div className="flex items-center gap-8 mb-10">
            <button
              className={`px-8 py-4 rounded-lg transition-colors font-semibold text-lg ${
                game.price === 0 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-[#3a6aff] hover:bg-[#2952ff]"
              }`}
              onClick={handleAddToCart}
            >
              {game.price === 0 ? "Obtener gratis" : "Agregar al carrito"}
            </button>
            <span className="text-3xl font-bold text-[#3a6aff]">
              {game.price === 0 ? "" : `$${game.price.toLocaleString("es-CO")}`}
            </span>
          </div>
          
          {/* Apartado de requisitos del sistema */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-[#3a6aff]">Requisitos del sistema</h2>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 bg-[#181c2f] rounded-xl p-6">
                <h3 className="font-semibold mb-3 text-white text-lg">Mínimos</h3>
                <ul className="text-gray-300 text-base space-y-2">
                  <li><b>SO:</b> {game.requisitos?.min.os}</li>
                  <li><b>CPU:</b> {game.requisitos?.min.cpu}</li>
                  <li><b>RAM:</b> {game.requisitos?.min.ram}</li>
                  <li><b>Gráficos:</b> {game.requisitos?.min.gpu}</li>
                  <li><b>Almacenamiento:</b> {game.requisitos?.min.storage}</li>
                </ul>
              </div>
              <div className="flex-1 bg-[#181c2f] rounded-xl p-6">
                <h3 className="font-semibold mb-3 text-white text-lg">Recomendados</h3>
                <ul className="text-gray-300 text-base space-y-2">
                  <li><b>SO:</b> {game.requisitos?.rec.os}</li>
                  <li><b>CPU:</b> {game.requisitos?.rec.cpu}</li>
                  <li><b>RAM:</b> {game.requisitos?.rec.ram}</li>
                  <li><b>Gráficos:</b> {game.requisitos?.rec.gpu}</li>
                  <li><b>Almacenamiento:</b> {game.requisitos?.rec.storage}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}