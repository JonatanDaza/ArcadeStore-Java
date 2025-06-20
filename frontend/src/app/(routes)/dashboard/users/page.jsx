"use client";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import Table from "@/app/components/Table";
import ActionButton from "@/app/components/ActionButton";

// Botón personalizado para cambiar rol
function ButtonChangeRole({ onClick, children }) {
  return (
    <button
      className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded font-semibold transition text-xs"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// Acciones de usuario
function cellCambiarRol({ row }) {
  return (
    <ButtonChangeRole
      onClick={() => {
        // lógica para cambiar rol
      }}
    >
      {row.original.rol === "admin" ? "Convertir a Usuario" : "Convertir a Admin"}
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

// Columnas para usuarios
const columns = [
  {
    header: "Nombre",
    accessorKey: "nombre",
    cell: info => info.getValue(),
  },
  {
    header: "Email",
    accessorKey: "email",
    cell: info => info.getValue(),
  },
  {
    header: "Rol",
    accessorKey: "rol",
    cell: info => info.getValue(),
  },
  {
    header: "Estado",
    accessorKey: "estado",
    cell: info => info.getValue(),
  },
  {
    header: "Cambiar rol",
    id: "cambiar_rol",
    cell: cellCambiarRol,
  },
  {
    header: "Activar usuario",
    id: "activar_usuario",
    cell: cellActivarUsuario,
  },
];

// Datos simulados
const data = [
  {
    nombre: "jhorman Calderon",
    email: "jhormancalderon60@gmail.com",
    rol: "admin",
    estado: "Activo",
  },
  {
    nombre: "Ana Pérez",
    email: "ana.perez@email.com",
    rol: "usuario",
    estado: "Inactivo",
  },
  {
    nombre: "Carlos Ruiz",
    email: "carlos.ruiz@email.com",
    rol: "usuario",
    estado: "Activo",
  },
];

export default function UsersPage() {
  return (
    <div className="flex flex-col min-h-screen hero_area">
      <Header />
      <main className="flex-1 w-full min-h-[80vh] bg-gradient-to-b from-[#06174d] via-black to-[#06174d] p-5">
        <div
          className="max-w-7xl mx-auto rounded-xl shadow-xl p-8"
          style={{ background: "#232323" }}
        >
          <h1 className="text-2xl font-bold mb-6 custom_heading">
            Lista de Usuarios
          </h1>
          <div className="overflow-x-auto rounded-lg border border-[#444] shadow-lg">
            <Table columns={columns} data={data} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}