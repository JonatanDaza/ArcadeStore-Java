'use client';

import { useState } from "react";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";

export default function ContactPage() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
  });
  const [enviado, setEnviado] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Aquí puedes enviar el formulario a tu backend o servicio de correo
    setEnviado(true);
    // Limpia el formulario si quieres
    // setForm({ nombre: "", email: "", asunto: "", mensaje: "" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#06174d]">
      <Header />
      <main className="flex-1 font-poppins text-white flex flex-col items-center justify-center bg-gradient-to-b from-[#06174d] via-black to-[#06174d] p-6">
        <div className="bg-[#222] border border-[#333] rounded-lg shadow-lg p-8 w-full max-w-lg crear-juego-container">
          <h1 className="text-3xl font-bold mb-6 text-center">Contáctenos</h1>
          {enviado ? (
            <div className="text-green-400 text-center mb-4">¡Mensaje enviado correctamente!</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="nombre" className="block mb-1 font-semibold">Nombre:</label>
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  required
                  value={form.nombre}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-[#444] text-white border border-[#555] focus:outline-none focus:ring-2 focus:ring-[#06174d]"
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-1 font-semibold">Correo electrónico:</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-[#444] text-white border border-[#555] focus:outline-none focus:ring-2 focus:ring-[#06174d]"
                />
              </div>
              <div>
                <label htmlFor="asunto" className="block mb-1 font-semibold">Asunto:</label>
                <input
                  type="text"
                  name="asunto"
                  id="asunto"
                  required
                  value={form.asunto}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-[#444] text-white border border-[#555] focus:outline-none focus:ring-2 focus:ring-[#06174d]"
                />
              </div>
              <div>
                <label htmlFor="mensaje" className="block mb-1 font-semibold">Mensaje:</label>
                <textarea
                  name="mensaje"
                  id="mensaje"
                  rows={5}
                  required
                  value={form.mensaje}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-[#444] text-white border border-[#555] focus:outline-none focus:ring-2 focus:ring-[#06174d]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded hover:bg-[#06174d] transition font-bold"
              >
                Enviar mensaje
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}