import React from "react";

export default function SidebarPerfil({
  userName,
  sidebarOptions,
  selected,
  setSelected,
  setShowLogoutModal,
}) {
  return (
    <aside className="w-65 bg-black border-r border-[#333] p-8 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-center flex-1">
          Perfil de {userName}
        </h1>
      </div>
      <nav className="flex flex-col gap-4 flex-1">
        {sidebarOptions.map((option) => (
          <button
            key={option.key}
            onClick={() => setSelected(option.key)}
            className={`text-left px-4 py-3 rounded-lg transition-colors ${
              selected === option.key
                ? "bg-[#333f] text-white font-semibold"
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
  );
}
