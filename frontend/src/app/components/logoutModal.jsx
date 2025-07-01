import React from "react";
import { useRouter } from "next/navigation";

export default function LogoutModal({ isOpen, onClose }) {
  const router = useRouter();
  
  const handleConfirmLogout = () => {
    try {
      // Limpiar datos de autenticación
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userSession');
      localStorage.removeItem('id'); // Agregado basado en tu código principal
      
      // Cerrar modal
      onClose();
      
      // Redireccionar al inicio en lugar de /login
      router.push('/');
      
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Aún así cerrar el modal y redireccionar
      onClose();
      router.push('/');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#333] p-8 rounded-lg max-w-md w-full mx-4">
        <h3 className="text-xl font-bold mb-4 text-white">Cerrar sesión</h3>
        <p className="text-gray-300 mb-6">
          ¿Estás seguro que deseas cerrar sesión?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors text-white"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-white"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}