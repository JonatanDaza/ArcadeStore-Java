'use client';

import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:8085/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          passwordHash: password,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("authToken", data.token);

        // Decodifica el token y guarda los datos del usuario
        const decoded = jwtDecode(data.token);
        localStorage.setItem("userRole", decoded.role || "user");
        localStorage.setItem("userName", decoded.username || decoded.email || "");
        localStorage.setItem("id", decoded.id || "");
        localStorage.setItem("userNick", decoded.username || "");

        // Redirección según el rol
        if ((decoded.role || "").toLowerCase() === "admin") {
          router.push("/dashboard");
        } else {
          router.push("/");
        }
      } else {
        const text = await res.text();
        setError(text || "Correo o contraseña incorrectos");
      }
    } catch (err) {
      setError("Error de red o servidor");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#06174d]">
      <main className="flex-1 font-poppins text-white flex flex-col items-center justify-center bg-gradient-to-b from-[#06174d] via-black to-[#06174d] p-0">
        <div className="bg-[#222] border border-[#333] rounded-lg shadow-lg p-8 w-full max-w-lg crear-juego-container">
          <h1 className="text-3xl font-bold mb-6 text-center">Iniciar sesión</h1>
          <form className="space-y-5" onSubmit={handleSubmit}>
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
              />
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            {success && <div className="text-green-500 text-sm text-center">{success}</div>}
            <div className="text-center text-sm mt-2">
              ¿Tienes una cuenta?{" "}
              <a href="/register" className="text-[#61dafb] hover:underline">
                Registrate aquí
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded hover:bg-[#06174d] transition font-bold"
            >
              Iniciar sesión
            </button>
          </form>
        </div>
      </main>
      <Toaster
        position="top-right"
        containerStyle={{ top: '8rem' }}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}