'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false, confirm: false, name: false });
  const router = useRouter();

  const generateUserId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!email || !password || !confirm || !name) {
      setTouched({ email: true, password: true, confirm: true, name: true });
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

    // Verificar si el email ya existe
    const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    if (existingUsers.some(user => user.email === email)) {
      setError("Este correo electrónico ya está registrado.");
      setLoading(false);
      return;
    }

    // Crear nuevo usuario
    const newUser = {
      id: generateUserId(),
      email: email,
      password: password, // En producción, esto debería estar hasheado
      name: name,
      nick: name.toLowerCase().replace(/\s+/g, ''),
      createdAt: new Date().toISOString()
    };

    // Guardar en localStorage
    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));

    // Auto-login después del registro
    localStorage.setItem("userEmail", newUser.email);
    localStorage.setItem("userRole", "user");
    localStorage.setItem("userName", newUser.name);
    localStorage.setItem("userNick", newUser.nick);
    localStorage.setItem("id", newUser.id);

    // Disparar evento para que otros componentes se enteren del cambio
    window.dispatchEvent(new Event('storage'));

    setSuccess("Registro exitoso. Redirigiendo...");
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
              <label htmlFor="name" className="block mb-1 font-semibold">Nombre completo:</label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, name: true }))}
                className="w-full px-4 py-2 rounded bg-[#444] text-white border border-[#555] focus:outline-none focus:ring-2 focus:ring-[#06174d]"
                placeholder="Ingresa tu nombre completo"
              />
              {touched.name && !name && (
                <div className="text-red-500 text-xs mt-1">Este campo es obligatorio.</div>
              )}
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
                onBlur={() => setTouched(t => ({ ...t, email: true }))}
                className="w-full px-4 py-2 rounded bg-[#444] text-white border border-[#555] focus:outline-none focus:ring-2 focus:ring-[#06174d]"
                placeholder="correo@ejemplo.com"
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
                placeholder="Mínimo 6 caracteres"
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
                placeholder="Repite tu contraseña"
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