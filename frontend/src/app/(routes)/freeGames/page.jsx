'use client';

import Header from "@/app/components/header";
import Footer from "@/app/components/footer";

export default function FreeGamesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#06174d]">
      <Header />
      <main
        className="flex-1 font-poppins text-white flex flex-col"
        style={{
          backgroundImage:
            "linear-gradient(135deg, #000 20%, #06174d 90%, #000 -50%)",
          margin: 0,
        }}
      >
        {/* Aquí puedes agregar más componentes o contenido específico de la página de juegos */}
      <h1>Juegos Free to play</h1>
        {/* Tu contenido aquí */}
      </main>
      <Footer />
    </div>
  );
}