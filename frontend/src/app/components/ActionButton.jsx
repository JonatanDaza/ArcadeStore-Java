import { FiEye, FiEdit2 } from "react-icons/fi";
import { MdBlock, MdCheckCircle, MdStar } from "react-icons/md";

const icons = {
  view: <FiEye size={18} />,
  edit: <FiEdit2 size={18} />,
  deactivate: <MdBlock size={20} />,
  activate: <MdCheckCircle size={20} />,
  highlight: <MdStar size={20} />,
};

const colors = {
  view: "bg-yellow-500 hover:bg-yellow-600",
  edit: "bg-blue-600 hover:bg-blue-800",
  deactivate: "bg-red-600 hover:bg-red-700",
  activate: "bg-green-600 hover:bg-green-700",
  highlight: "bg-yellow-400 hover:bg-yellow-500 text-white",
};

export default function ActionButton({
  type = "view",
  onClick,
  title,
  ...props
}) {
  return (
    <button
      className={`flex items-center justify-center ${colors[type]} text-white p-2 rounded-full transition`}
      onClick={onClick}
      title={title}
      {...props}
    >
      {icons[type]}
    </button>
  );
}

// Ejemplo de uso en cellAcciones:
function cellAcciones({ row }) {
  return (
    <div className="flex gap-2">
      <ActionButton
        type="edit"
        title="Editar"
        onClick={() => {
          // lógica para editar
        }}
      />
      {row.original.estado === "Activo" ? (
        <ActionButton
          type="deactivate"
          title="Desactivar"
          onClick={() => {
            // lógica para desactivar
          }}
        />
      ) : (
        <ActionButton
          type="activate"
          title="Activar"
          onClick={() => {
            // lógica para activar
          }}
        />
      )}
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

