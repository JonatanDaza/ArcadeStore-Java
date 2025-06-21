'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false, confirm: false });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!email || !password || !confirm) {
      setTouched({ email: true, password: true, confirm: true });
      setError("Todos los campos son obligatorios.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      setLoading(false);
      return;
    }

    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    // Simulación de registro exitoso (reemplaza con lógica real)
    setSuccess("Registro exitoso. Redirigiendo...");
    localStorage.setItem("userEmail", email);
    setTimeout(() => {
      router.push("/");
    }, 1500);
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#06174d]">
      <main className="flex-1 font-poppins text-white flex flex-col items-center justify-center bg-gradient-to-b from-[#06174d] via-black to-[#06174d] p-0">
        <div className="bg-[#222] border border-[#333] rounded-lg shadow-lg p-8 w-full max-w-lg crear-juego-container">
          <h1 className="text-3xl font-bold mb-6 text-center">Registro</h1>
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
            <div>
              <label htmlFor="confirm" className="block mb-1 font-semibold">Confirmar contraseña:</label>
              <input
                type="password"
                name="confirm"
                id="confirm"
                required
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, confirm: true }))}
                className="w-full px-4 py-2 rounded bg-[#444] text-white border border-[#555] focus:outline-none focus:ring-2 focus:ring-[#06174d]"
              />
              {touched.confirm && !confirm && (
                <div className="text-red-500 text-xs mt-1">Este campo es obligatorio.</div>
              )}
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
              disabled={loading}
            >
              {loading ? "Registrando..." : "Registrarse"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}