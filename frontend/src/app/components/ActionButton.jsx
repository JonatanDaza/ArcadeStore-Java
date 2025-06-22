import { FiEye, FiEdit2 } from "react-icons/fi";
import { MdStar } from "react-icons/md";
import { BsFillStarFill, BsPencilSquare, BsEyeFill } from "react-icons/bs";

// Switch personalizado
function ToggleSwitch({ checked, onChange, title }) {
  return (
    <label className="flex items-center cursor-pointer" title={title}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div
          className={`block w-10 h-6 rounded-full transition ${
            checked ? "bg-green-600" : "bg-red-600"
          }`}
        ></div>
        <div
          className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${
            checked ? "translate-x-4" : ""
          }`}
        ></div>
      </div>
    </label>
  );
}

// Íconos modernos y visuales
const icons = {
  view: (
    <BsEyeFill
      size={28} // antes 22
      className="text-yellow-500 hover:text-yellow-600 transition"
    />
  ),
  edit: (
    <BsPencilSquare
      size={28} // antes 22
      className="text-blue-500 hover:text-blue-700 transition"
    />
  ),
  highlight: (
    <BsFillStarFill
      size={28} // antes 22
      className="text-yellow-400 hover:text-yellow-600 transition"
    />
  ),
};

export default function ActionButton({
  type = "view",
  onClick,
  title,
  ...props
}) {
  if (type === "activate" || type === "deactivate") {
    return null;
  }
  return (
    <button
      className="flex items-center justify-center bg-transparent p-0 m-0 hover:scale-125 transition"
      onClick={onClick}
      title={title}
      style={{ boxShadow: "none", border: "none" }}
      {...props}
    >
      {icons[type]}
    </button>
  );
}

// Ejemplo de uso en cellAcciones:
function cellAcciones({ row }) {
  const isActive = row.original.estado === "Activo";
  return (
    <div className="flex gap-2 items-center">
      <ActionButton
        type="edit"
        title="Editar"
        onClick={() => {
          // lógica para editar
        }}
      />
      <ToggleSwitch
        checked={isActive}
        onChange={() => {
          // lógica para activar/desactivar
        }}
        title={isActive ? "Desactivar" : "Activar"}
      />
      <ActionButton
        type="view"
        title="Ver detalles"
        onClick={() => {
          // lógica para ver detalles
        }}
      />
      <ActionButton
        type="highlight"
        title="Destacar"
        onClick={() => {
          // lógica para destacar
        }}
      />
    </div>
  );
}

export { ToggleSwitch };

