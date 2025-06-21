'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setTouched({ email: true, password: true });
      setLoading(false);
      return;
    }

    // Simulación de autenticación (reemplaza con lógica real)
    if (email === "admin@arcade.com" && password === "123456") {
      // Guardar datos de admin en localStorage
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userRole", "admin");
      localStorage.setItem("userName", "Administrador");
      localStorage.setItem("userNick", "admin");
      localStorage.setItem("userId", "123");
      router.push("/");
    } else {
      setError("Correo o contraseña incorrectos.");
    }
    setLoading(false);
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
                onBlur={() => setTouched(t => ({ ...t, email: true }))}
                className="w-full px-4 py-2 rounded bg-[#444] text-white border border-[#555] focus:outline-none focus:ring-2 focus:ring-[#06174d]"
              />
              {touched.email && !email && (
                <div className="text-red-500 text-xs mt-1">Este campo es obligatorio.</div>
              )}
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
                onBlur={() => setTouched(t => ({ ...t, password: true }))}
                className="w-full px-4 py-2 rounded bg-[#444] text-white border border-[#555] focus:outline-none focus:ring-2 focus:ring-[#06174d]"
              />
              {touched.password && !password && (
                <div className="text-red-500 text-xs mt-1">Este campo es obligatorio.</div>
              )}
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <div className="text-center text-sm mt-2">
              ¿No tienes una cuenta?{" "}
              <a href="/register" className="text-[#61dafb] hover:underline">
                Regístrate aquí
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded hover:bg-[#06174d] transition font-bold"
              disabled={loading}
            >
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}