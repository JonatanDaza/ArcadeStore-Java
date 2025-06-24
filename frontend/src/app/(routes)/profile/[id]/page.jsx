'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import PersonalInfo from "app/components/personalInfo";
import Orders from "app/components/orders";
import Favorites from "app/components/favorites";
import Settings from "app/components/settings";
import SidebarPerfil from "app/components/sidebarPerfil";
import LogoutModal from "app/components/logoutModal";

const sidebarOptions = [
  { key: "info", label: "Información personal" },
  { key: "orders", label: "Mis pedidos" },
  { key: "favorites", label: "Favoritos" },
  { key: "settings", label: "Configuración" },
];

// Botón de salir como componente
function ExitButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed top-6 right-8 z-50 text-gray-400 hover:text-red-400 transition text-3xl font-bold bg-[#222] rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
      title="Salir al inicio"
      aria-label="Salir al inicio"
      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
    >
      ×
    </button>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const urlUserId = params?.id;

  const [sessionUserId, setSessionUserId] = useState(null);
  const [selected, setSelected] = useState("info");
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userNotFound, setUserNotFound] = useState(false);

  const [userInfo, setUserInfo] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  const [editedInfo, setEditedInfo] = useState({ ...userInfo });

  useEffect(() => {
    const storedId = localStorage.getItem("id");
    setSessionUserId(storedId);

    if (storedId && urlUserId && storedId !== urlUserId) {
      router.replace(`/profile/${storedId}`);
    }
    // if (!storedId) router.replace("/login");
  }, [urlUserId, router]);

  useEffect(() => {
    const loadUserData = async () => {
      if (!urlUserId) {
        setUserNotFound(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const mockUsers = {
          "123": {
            id: "123",
            name: "Juan Pérez",
            email: "admin@arcade.com",
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

        await new Promise(resolve => setTimeout(resolve, 1000));

        const userData = mockUsers[urlUserId];
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
  }, [urlUserId]);

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

  function renderContent() {
    switch (selected) {
      case "info":
        return (
          <PersonalInfo
            userInfo={userInfo}
            isEditing={isEditing}
            editedInfo={editedInfo}
            setEditedInfo={setEditedInfo}
            handleEdit={handleEdit}
            handleSave={handleSave}
            handleCancel={handleCancel}
          />
        );
      case "orders":
        return <Orders />;
      case "favorites":
        return <Favorites />;
      case "settings":
        return <Settings />;
      default:
        return null;
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#06174d] via-black to-[#06174d] text-white font-sans relative ">
      <SidebarPerfil
        userName={userInfo.name}
        sidebarOptions={sidebarOptions}
        selected={selected}
        setSelected={setSelected}
        setShowLogoutModal={setShowLogoutModal}
      />
      <main className="flex-1 p-10 relative">
        <ExitButton onClick={() => router.push('/')} />
        {renderContent()}
      </main>
      {showLogoutModal && (
        <LogoutModal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
        />
      )}
    </div>
  );
}