'use client';

import { useState } from "react";
import { motion } from "framer-motion";

export default function Contact({ onClose }) {
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
    setEnviado(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-gray-800 via-gray-950 to-gray-900 rounded-lg shadow-xl p-6 w-80"
    >
      <div className="relative">
        <button
          className="absolute top-0 right-0 text-white text-xl font-bold hover:text-red-400"
          onClick={onClose}
        >
          &times;
        </button>
        <h1 className="text-xl font-bold text-white mb-4 text-center">Contáctenos</h1>
        {enviado ? (
          <div className="text-green-400 text-center mb-4">¡Mensaje enviado correctamente!</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2 text-white">
            <div>
              <label htmlFor="nombre" className="block mb-1">Nombre:</label>
              <input
                type="text"
                name="nombre"
                id="nombre"
                required
                value={form.nombre}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-gray-300 text-black border border-black focus:outline-none focus:ring-2 focus:ring-[#3a6aff]"
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1">Correo electrónico:</label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-gray-300 text-black border border-black focus:outline-none focus:ring-2 focus:ring-[#3a6aff]"
              />
            </div>
            <div>
              <label htmlFor="asunto" className="block mb-1">Asunto:</label>
              <input
                type="text"
                name="asunto"
                id="asunto"
                required
                value={form.asunto}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-gray-300 text-black border border-black focus:outline-none focus:ring-2 focus:ring-[#3a6aff]"
              />
            </div>
            <div>
              <label htmlFor="mensaje" className="block mb-1">Mensaje:</label>
              <textarea
                name="mensaje"
                id="mensaje"
                rows={3}
                required
                value={form.mensaje}
                onChange={handleChange}
                className="w-full rounded bg-gray-300 text-black border border-black focus:outline-none focus:ring-2 focus:ring-[#3a6aff]"
              />
            </div>
            <button
              type="submit"
              className="w-full p-3 font-bold bg-gray-800 hover:bg-[#3a6aff] text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Enviar mensaje
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
}
