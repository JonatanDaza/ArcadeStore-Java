'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:8085/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          username,
          passwordHash: password, // Debe coincidir con el DTO del backend
        }),
      });

      if (res.ok) {
        setSuccess("Registro exitoso. Ahora puedes iniciar sesión.");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        const text = await res.text();
        setError(text || "Error al registrar");
      }
    } catch (err) {
      setError("Error de red o servidor");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#06174d]">
      <main className="flex-1 font-poppins text-white flex flex-col items-center justify-center bg-gradient-to-b from-[#06174d] via-black to-[#06174d] p-0">
        <div className="bg-[#222] border border-[#333] rounded-lg shadow-lg p-8 w-full max-w-lg crear-juego-container">
          <h1 className="text-3xl font-bold mb-6 text-center">Registro</h1>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block mb-1 font-semibold">Nombre de usuario:</label>
              <input
                type="text"
                name="username"
                id="username"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded bg-[#444] text-white border border-[#555] focus:outline-none focus:ring-2 focus:ring-[#06174d]"
                placeholder="Ingresa tu nombre de usuario"
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1 font-semibold">Correo electrónico:</label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded bg-[#444] text-white border border-[#555] focus:outline-none focus:ring-2 focus:ring-[#06174d]"
                placeholder="correo@ejemplo.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-1 font-semibold">Contraseña:</label>
              <input
                type="password"
                name="password"
                id="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded bg-[#444] text-white border border-[#555] focus:outline-none focus:ring-2 focus:ring-[#06174d]"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            {success && (
              <div className="text-green-500 text-sm text-center">{success}</div>
            )}
            <div className="text-center text-sm mt-2">
              ¿Tienes una cuenta?{" "}
              <a href="/login" className="text-[#61dafb] hover:underline">
                Inicia sesión aquí
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded hover:bg-[#06174d] transition font-bold"
            >
              Registrarse
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}