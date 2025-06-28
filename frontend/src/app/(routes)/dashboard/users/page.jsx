"use client";
import Header from "app/components/header";
import Footer from "app/components/footer";
import Table from "app/components/Table";
import ActionButton from "app/components/ActionButton";
import Sidebar from "app/components/sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { getAllUsers, cambiarRolUsuario } from "app/services/api/users";

// Botón personalizado para cambiar rol
function ButtonChangeRole({ onClick, children, disabled }) {
  return (
    <button
      className={`bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded font-semibold transition text-xs ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// Acciones de usuario
function cellCambiarRol({ row, reloadUsers }) {
  const loggedUserId = localStorage.getItem("id");
  const isSelf = String(row.original.id) === String(loggedUserId);

  return (
    <ButtonChangeRole
      onClick={async () => {
        if (isSelf) return; // Previene acción si es el mismo usuario
        try {
          const token = localStorage.getItem("authToken");
          await cambiarRolUsuario(row.original.id, token);
          reloadUsers(); // Recarga la lista de usuarios
        } catch (e) {
          alert("No se pudo cambiar el rol");
        }
      }}
      disabled={isSelf}
    >
      {row.original.role?.name?.toLowerCase() === "admin"
        ? "Convertir a Usuario"
        : "Convertir a Admin"}
    </ButtonChangeRole>
  );
}

function cellActivarUsuario({ row }) {
  return row.original.estado === "Activo" ? null : (
    <ActionButton
      type="activate"
      title="Activar usuario"
      onClick={() => {
        // lógica para activar usuario
      }}
    />
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const role = decoded.role?.toLowerCase();
        setIsAuthenticated(role === "admin");
        if (role !== "admin") {
          router.replace("/login");
        }
      } catch (err) {
        setIsAuthenticated(false);
        router.replace("/login");
      }
    } else {
      setIsAuthenticated(false);
      router.replace("/login");
    }
  }, [router]);

  const reloadUsers = () => {
    setLoading(true);
    const token = localStorage.getItem("authToken");
    getAllUsers(token)
      .then(setUsers)
      .catch(() => setError("No se pudieron cargar los usuarios"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isAuthenticated) {
      reloadUsers();
    }
  }, [isAuthenticated]);

  // Mueve la definición de columns aquí:
  const columns = [
    { header: "Nombre", accessorKey: "username", cell: info => info.getValue() },
    { header: "Email", accessorKey: "email", cell: info => info.getValue() },
    { header: "Rol", accessorKey: "role.name", cell: info => info.row.original.role?.name || "" },
    { header: "Estado", accessorKey: "active", cell: info => info.getValue() ? "Activo" : "Inactivo" },
    {
      header: "Cambiar Rol",
      cell: info => cellCambiarRol({ row: info.row, reloadUsers }),
    },
    {
      header: "Activar usuario",
      id: "activar_usuario",
      cell: cellActivarUsuario,
    },
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen hero_area">
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 min-w-0 bg-gradient-to-b from-[#06174d] via-black to-[#06174d] p-3 lg:p-5">
          <div className="w-auto h-auto pt-3">
            <h1 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6 custom_heading">
              Lista de Usuarios
            </h1>
            {loading && <div>Cargando usuarios...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {!loading && !error && (
              <div className="overflow-x-auto rounded-lg shadow-lg">
                <Table columns={columns} data={users} />
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}