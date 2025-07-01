import { User, Mail, Edit2, Save, X } from "lucide-react";
import { MdPassword } from "react-icons/md";

export default function PersonalInfo({
  userInfo,
  isEditing,
  editedInfo,
  setEditedInfo,
  handleEdit,
  handleSave,
  handleCancel,
}) {
  return (
    <div className="max-w-auto">
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
        <div className="space-y-6 flex flex-col-1">
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
              <p className="text-gray-300">{userInfo.username}</p>
            </div>
            <div className="bg-[#333] p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="text-[#3a6aff]" size={20} />
                <h3 className="font-semibold text-lg">Email</h3>
              </div>
              <p className="text-gray-300">{userInfo.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}