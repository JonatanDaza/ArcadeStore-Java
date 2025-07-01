'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import PersonalInfo from "app/components/personalInfo";
import Orders from "app/components/orders";
import Favorites from "app/components/favorites";
import Settings from "app/components/settings";
import SidebarPerfil from "app/components/sidebarPerfil";
import LogoutModal from "app/components/logoutModal";
// Corregir la ruta de importación
import { getUserById, updateUser } from "app/services/api/users";

const sidebarOptions = [
  { key: "info", label: "Información personal" },
  { key: "orders", label: "Mis juegos" },
  // { key: "favorites", label: "Favoritos" },
  // { key: "settings", label: "Configuración" },
];

// Función para obtener valores iniciales seguros
const getInitialUserInfo = () => ({
  id: null,
  username: "",
  email: "",
  passwordHash: "",
  active: true,
  role: null,
  createdAt: null,
  updatedAt: null
});

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
  const [saveLoading, setSaveLoading] = useState(false);

  // Inicializar con valores seguros
  const [userInfo, setUserInfo] = useState(getInitialUserInfo);
  const [editedInfo, setEditedInfo] = useState(getInitialUserInfo);

  // Verificar autenticación y autorización
  useEffect(() => {
    const storedId = localStorage.getItem("id");
    const token = localStorage.getItem("authToken");
    
    console.log("Auth check - storedId:", storedId, "urlUserId:", urlUserId, "hasToken:", !!token);
    
    if (!token) {
      console.log("No token found, redirecting to login");
      router.replace("/login");
      return;
    }

    setSessionUserId(storedId);

    // Verificar que el usuario solo pueda acceder a su propio perfil
    if (storedId && urlUserId && storedId !== urlUserId) {
      console.log("User trying to access different profile, redirecting");
      router.replace(`/profile/${storedId}`);
      return;
    }
    
    if (!storedId) {
      console.log("No stored ID, redirecting to login");
      router.replace("/login");
    }
  }, [urlUserId, router]);

  // Cargar datos del usuario
  useEffect(() => {
    const loadUserData = async () => {
      if (!urlUserId) {
        console.log("No urlUserId provided");
        setUserNotFound(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        
        console.log("Loading user data for ID:", urlUserId);
        
        if (!token) {
          console.log("No token during data load, redirecting");
          router.replace("/login");
          return;
        }

        console.log("Calling getUserById...");
        const userData = await getUserById(urlUserId, token);
        console.log("User data received:", userData);

        if (userData) {
          // Asegurar que todos los campos tengan valores seguros
          const safeUserData = {
            id: userData.id || null,
            username: userData.username || "",
            email: userData.email || "",
            passwordHash: userData.passwordHash || "",
            active: userData.active !== undefined ? userData.active : true,
            role: userData.role || null,
            createdAt: userData.createdAt || null,
            updatedAt: userData.updatedAt || null
          };
          
          setUserInfo(safeUserData);
          setEditedInfo(safeUserData);
          setUserNotFound(false);
          console.log("User data set successfully");
        } else {
          console.log("No user data returned");
          setUserNotFound(true);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        console.error("Error stack:", error.stack);
        
        if (error.message.includes('401') || error.message.includes('403')) {
          console.log("Authentication error, clearing session");
          localStorage.removeItem("authToken");
          localStorage.removeItem("id");
          router.replace("/login");
        } else {
          console.log("Setting user not found due to error");
          setUserNotFound(true);
        }
      } finally {
        setLoading(false);
        console.log("Loading finished");
      }
    };

    loadUserData();
  }, [urlUserId, router]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedInfo({ ...userInfo });
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        router.replace("/login");
        return;
      }

      // Solo enviar los campos que se pueden editar
      const editableData = {
        username: editedInfo.username || "",
        email: editedInfo.email || ""
      };

      const updatedUser = await updateUser(urlUserId, editableData, token);
      
      // Asegurar que la respuesta tenga valores seguros
      const safeUpdatedUser = {
        id: updatedUser.id || userInfo.id,
        username: updatedUser.username || "",
        email: updatedUser.email || "",
        passwordHash: updatedUser.passwordHash || userInfo.passwordHash,
        active: updatedUser.active !== undefined ? updatedUser.active : userInfo.active,
        role: updatedUser.role || userInfo.role,
        createdAt: updatedUser.createdAt || userInfo.createdAt,
        updatedAt: updatedUser.updatedAt || userInfo.updatedAt
      };
      
      setUserInfo(safeUpdatedUser);
      setIsEditing(false);
      
      console.log("Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error al actualizar el perfil. Por favor, inténtalo de nuevo.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedInfo({ ...userInfo });
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("id");
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
            saveLoading={saveLoading}
          />
        );
      case "orders":
        return <Orders userId={userInfo.id || null} />;
      case "favorites":
        return <Favorites userId={userInfo.id || null} />;
      case "settings":
        return <Settings userId={userInfo.id || null} />;
      default:
        return null;
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#06174d] via-black to-[#06174d] text-white font-sans relative">
      <SidebarPerfil
        userName={userInfo.username || "Usuario"}
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
          onConfirm={handleLogout}
        />
      )}
    </div>
  );
}