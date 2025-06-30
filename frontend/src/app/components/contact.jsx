'use client';

import { useState } from "react";

export default function Contact() {
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
    <div className="flex flex-col min-h-auto">
      <main className="flex-1 font-poppins text-white flex flex-col items-center justify-center">
        <div className="border border-black rounded-lg shadow-lg p-4 w-lg max-w-lg bg-gradient-to-br from-gray-800 via-gray-950 to-gray-900">
          <h1 className="text-3xl font-bold p-1 text-center">Contáctenos</h1>
          {enviado ? (
            <div className="text-green-400 text-center mb-4">¡Mensaje enviado correctamente!</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-1">
              <div>
                <label htmlFor="nombre" className="block mb-1 font-semibold">Nombre:</label>
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  required
                  value={form.nombre}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-gray-300 text-white border border-black focus:outline-none focus:ring-2 focus:ring-[#06174d]"
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
                  className="w-full px-4 py-2 rounded bg-gray-300 text-white border border-black focus:outline-none focus:ring-2 focus:ring-[#06174d]"
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
                  className="w-full px-4 py-2 rounded bg-gray-300 text-white border border-black focus:outline-none focus:ring-2 focus:ring-[#06174d]"
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
                  className="w-full h-20 rounded bg-gray-300 text-white border border-black focus:outline-none focus:ring-2 focus:ring-[#06174d]"
                />
              </div>
              <button
                type="submit"
                className="w-full p-3 hover:text-black font-bold inline-block bg-gray-800 hover:bg-[#3a6aff] text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Enviar mensaje
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}