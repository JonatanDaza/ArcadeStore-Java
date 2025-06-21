'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { User, Mail, Phone, MapPin, Edit2, Save, X } from "lucide-react";

const sidebarOptions = [
  { key: "info", label: "Información personal" },
  { key: "orders", label: "Mis pedidos" },
  { key: "favorites", label: "Favoritos" },
  { key: "settings", label: "Configuración" },
];

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id;

  const [selected, setSelected] = useState("info");
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userNotFound, setUserNotFound] = useState(false);

  // Estado para la información del usuario
  const [userInfo, setUserInfo] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  const [editedInfo, setEditedInfo] = useState({ ...userInfo });

  // Simular carga de datos del usuario por ID
  useEffect(() => {
    const loadUserData = async () => {
      if (!userId) {
        setUserNotFound(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Simular llamada a API para obtener datos del usuario
        const mockUsers = {
          "123": {
            id: "123",
            name: "Juan Pérez",
            email: "juan.perez@email.com",
            phone: "+57 300 123 4567",
            address: "Calle 123 #45-67, Bogotá, Colombia"
          },
          "456": {
            id: "456",
            name: "María García",
            email: "maria.garcia@email.com",
            phone: "+57 310 987 6543",
            address: "Carrera 45 #23-12, Medellín, Colombia"
          },
          "789": {
            id: "789",
            name: "Carlos López",
            email: "carlos.lopez@email.com",
            phone: "+57 320 456 7890",
            address: "Avenida 68 #15-30, Cali, Colombia"
          }
        };

        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1000));

        const userData = mockUsers[userId];
        if (userData) {
          setUserInfo(userData);
          setEditedInfo(userData);
          setUserNotFound(false);
        } else {
          setUserNotFound(true);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        setUserNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [userId]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedInfo({ ...userInfo });
  };

  const handleSave = () => {
    setUserInfo({ ...editedInfo });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedInfo({ ...userInfo });
    setIsEditing(false);
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    router.push('/');
  };

  // Pantalla de carga
  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#06174d] text-white font-sans items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3a6aff] mx-auto mb-4"></div>
          <p className="text-gray-300">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  // Usuario no encontrado
  if (userNotFound) {
    return (
      <div className="flex min-h-screen bg-[#06174d] text-white font-sans items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold mb-4 text-red-400">404</h1>
          <h2 className="text-2xl font-bold mb-4">Usuario no encontrado</h2>
          <p className="text-gray-300 mb-6">El perfil que buscas no existe o ha sido eliminado.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-[#3a6aff] hover:bg-[#2952ff] px-6 py-3 rounded-lg transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // Renderiza el contenido principal según la opción seleccionada
  function renderContent() {
    switch (selected) {
      case "info":
        return (
          <div className="max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Información personal</h2>
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 bg-[#3a6aff] hover:bg-[#2952ff] px-4 py-2 rounded-lg transition-colors"
                >
                  <Edit2 size={16} />
                  Editar
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      value={editedInfo.name}
                      onChange={(e) => setEditedInfo({ ...editedInfo, name: e.target.value })}
                      className="w-full px-4 py-3 bg-[#333] border border-[#555] rounded-lg text-white focus:outline-none focus:border-[#3a6aff]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      value={editedInfo.email}
                      onChange={(e) => setEditedInfo({ ...editedInfo, email: e.target.value })}
                      className="w-full px-4 py-3 bg-[#333] border border-[#555] rounded-lg text-white focus:outline-none focus:border-[#3a6aff]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={editedInfo.phone}
                      onChange={(e) => setEditedInfo({ ...editedInfo, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-[#333] border border-[#555] rounded-lg text-white focus:outline-none focus:border-[#3a6aff]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Dirección
                    </label>
                    <textarea
                      value={editedInfo.address}
                      onChange={(e) => setEditedInfo({ ...editedInfo, address: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-[#333] border border-[#555] rounded-lg text-white focus:outline-none focus:border-[#3a6aff] resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg transition-colors font-medium"
                  >
                    <Save size={16} />
                    Guardar cambios
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg transition-colors font-medium"
                  >
                    <X size={16} />
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#333] p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <User className="text-[#3a6aff]" size={20} />
                      <h3 className="font-semibold text-lg">Nombre</h3>
                    </div>
                    <p className="text-gray-300">{userInfo.name}</p>
                  </div>

                  <div className="bg-[#333] p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Mail className="text-[#3a6aff]" size={20} />
                      <h3 className="font-semibold text-lg">Email</h3>
                    </div>
                    <p className="text-gray-300">{userInfo.email}</p>
                  </div>

                  <div className="bg-[#333] p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Phone className="text-[#3a6aff]" size={20} />
                      <h3 className="font-semibold text-lg">Teléfono</h3>
                    </div>
                    <p className="text-gray-300">{userInfo.phone}</p>
                  </div>

                  <div className="bg-[#333] p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <MapPin className="text-[#3a6aff]" size={20} />
                      <h3 className="font-semibold text-lg">Dirección</h3>
                    </div>
                    <p className="text-gray-300">{userInfo.address}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case "orders":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6">Mis pedidos</h2>
            <div className="bg-[#333] p-6 rounded-lg">
              <p className="text-gray-300">No tienes pedidos recientes.</p>
            </div>
          </div>
        );
      case "favorites":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6">Favoritos</h2>
            <div className="bg-[#333] p-6 rounded-lg">
              <p className="text-gray-300">No tienes juegos marcados como favoritos.</p>
            </div>
          </div>
        );
      case "settings":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6">Configuración</h2>
            <div className="bg-[#333] p-6 rounded-lg">
              <p className="text-gray-300">Opciones de configuración de tu cuenta.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="flex min-h-screen bg-[#06174d] text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#222] border-r border-[#333] p-8 flex flex-col">
        <h1 className="text-2xl font-bold mb-8 text-center">
          Perfil de {userInfo.name}
        </h1>
        <nav className="flex flex-col gap-4 flex-1">
          {sidebarOptions.map(option => (
            <button
              key={option.key}
              onClick={() => setSelected(option.key)}
              className={`text-left px-4 py-3 rounded-lg transition-colors ${
                selected === option.key
                  ? "bg-[#3a6aff] text-white font-semibold"
                  : "hover:bg-[#333] text-gray-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </nav>
        
        {/* Cerrar sesión al final */}
        <div className="mt-8 pt-4 border-t border-[#333]">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full text-left px-4 py-3 rounded-lg transition-colors hover:bg-red-600/20 text-red-400 hover:text-red-300"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">{renderContent()}</main>

      {/* Modal de confirmación de logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#333] p-8 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Cerrar sesión</h3>
            <p className="text-gray-300 mb-6">¿Estás seguro que deseas cerrar sesión?</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}