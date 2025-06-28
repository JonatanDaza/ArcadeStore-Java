"use client";
import { useEffect, useState, useCallback } from "react";
import Header from "app/components/header";
import Footer from "app/components/footer";
import Table from "app/components/Table";
import ActionButton, { ToggleSwitch } from "app/components/ActionButton";
import Sidebar from "app/components/sidebar";

// Import the GameService
import GameService from "app/services/api/games";

export default function GamesPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(null); // Keep this for connection feedback
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view');
  const [selectedGame, setSelectedGame] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    precio: '',
    imagen: '',
    requisitos_minimos: '',
    requisitos_recomendados: '',
    categoryId: '',
    active: true
  });

  // Load games on component mount
  const loadGames = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken"); // Get token inside the async function
      const gamesData = await GameService.getAllGames(token);
      setGames(Array.isArray(gamesData) ? gamesData : []);
      // Check connection status after loading games
      const status = await GameService.checkConnection(token);
      setConnectionStatus(status);
    } catch (err) {
      setError(err.message || "Error al cargar juegos");
      setGames([]);
      setConnectionStatus({ connected: false, authenticated: false, error: err.message || "Network Error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  // Reset form data when modal is closed or opened for a new game
  useEffect(() => {
    if (!showModal) {
      setFormData({
        titulo: '',
        descripcion: '',
        precio: '',
        imagen: '',
        requisitos_minimos: '',
        requisitos_recomendados: '',
        categoryId: '',
        active: true
      });
      setSelectedGame(null);
    } else if (modalType === 'edit' && selectedGame) {
      setFormData({
        titulo: selectedGame.titulo || '',
        descripcion: selectedGame.descripcion || '',
        precio: selectedGame.precio || '',
        imagen: selectedGame.imagen || '',
        requisitos_minimos: selectedGame.requisitos_minimos || '',
        requisitos_recomendados: selectedGame.requisitos_recomendados || '',
        categoryId: selectedGame.categoryId || (selectedGame.category ? selectedGame.category.id : ''), // Ensure categoryId is set correctly
        active: selectedGame.active || false
      });
    }
  }, [showModal, modalType, selectedGame]);

  // Handle status change (activate/deactivate)
  const handleStatusChange = async (gameId, currentActive) => {
    try {
      const newStatus = !currentActive;
      const token = localStorage.getItem("authToken"); // Get token here
      const result = await GameService.changeGameStatus(gameId, newStatus, token);

      // Assuming result.success or similar is returned by your backend for the status change
      // If your backend directly returns the updated game object, you can use that.
      // For now, assuming a simple success message or a small payload.
      if (result) { // Adjust this condition based on your backend's response for success
        setGames(prevGames =>
          prevGames.map(game =>
            game.id === gameId
              ? { ...game, active: newStatus, estado: newStatus ? "Activo" : "Inactivo" }
              : game
          )
        );
        console.log('✅ Status changed successfully!');
      } else {
        // If your backend returns an error message in result
        setError(result.message || "Failed to change game status.");
      }
    } catch (err) {
      setError(`Error al cambiar estado: ${err.message}`);
      console.error('❌ Error changing game status:', err);
    }
  };

  // Handle highlight/unhighlight
  const handleHighlight = async (gameId, currentHighlighted) => {
    try {
      const newHighlighted = !currentHighlighted;
      const token = localStorage.getItem("authToken"); // Get token here
      const result = await GameService.highlightGame(gameId, newHighlighted, token);

      if (result) { // Adjust this condition based on your backend's response for success
        setGames(prevGames =>
          prevGames.map(game =>
            game.id === gameId
              ? { ...game, highlighted: newHighlighted }
              : game
          )
        );
        console.log('✅ Highlight status changed successfully!');
      } else {
        setError(result.message || "Failed to change highlight status.");
      }
    } catch (err) {
      setError(`Error al destacar juego: ${err.message}`);
      console.error('❌ Error highlighting game:', err);
    }
  };

  // Function to handle form changes
  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Function to handle saving game data
  const handleSaveGame = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const token = localStorage.getItem("authToken"); // Get token here

    try {
      // Validation
      if (!formData.titulo?.trim()) {
        setError('El título es requerido');
        return;
      }
      if (isNaN(Number(formData.precio)) || Number(formData.precio) <= 0) { // More robust price validation
        setError('El precio debe ser un número válido mayor a 0');
        return;
      }
      if (!formData.categoryId || isNaN(Number(formData.categoryId))) { // Category ID must be a number
        setError('La categoría es requerida y debe ser un número');
        return;
      }

      const gameData = {
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion?.trim() || '',
        precio: Number(formData.precio),
        imagen: formData.imagen?.trim() || '',
        requisitos_minimos: formData.requisitos_minimos?.trim() || '',
        requisitos_recomendados: formData.requisitos_recomendados?.trim() || '',
        categoryId: Number(formData.categoryId),
        active: Boolean(formData.active)
      };

      let updatedGame;
      if (modalType === 'create') {
        updatedGame = await GameService.createGame(gameData, token);
        setGames(prevGames => [...prevGames, { ...updatedGame, estado: updatedGame.active ? "Activo" : "Inactivo" }]); // Add estado field for new game
        console.log('✅ Juego creado exitosamente');
      } else if (modalType === 'edit' && selectedGame) {
        updatedGame = await GameService.updateGame(selectedGame.id, gameData, token);
        setGames(prevGames =>
          prevGames.map(game =>
            game.id === selectedGame.id ? { ...game, ...updatedGame, estado: updatedGame.active ? "Activo" : "Inactivo" } : game
          )
        );
        console.log('✅ Juego actualizado exitosamente');
      }

      setShowModal(false);
      // Optional: Re-fetch all games to ensure data consistency
      // loadGames();
    } catch (err) {
      setError(err.message || "Error al guardar juego");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Functions for table cells (No changes needed here unless image path requires adjustment)
  function cellNo(info) {
    return info.row.index + 1;
  }

  function cellImagenTitulo({ row }) {
    const game = row.original;
    // Ensure that game.imagen is not null or undefined for the image source
    const imagePath = game.imagen ? `http://localhost:8085/images/${game.imagen}` : '/images/default-game.png';

    return (
      <div className="flex items-center gap-2">
        <img
          src={imagePath}
          alt={game.titulo || 'Game Image'}
          className="w-24 h-auto object-cover rounded"
        />
        <span className="font-medium text-gray-800">{game.titulo}</span>
      </div>
    );
  }

  function cellPrecio({ row }) {
    const precio = row.original.precio;
    return (
      <span className="font-semibold text-green-600">
        ${typeof precio === 'number' ? precio.toLocaleString('es-CO') : precio}
      </span>
    );
  }

  function cellDescripcion({ row }) {
    const descripcion = row.original.descripcion;
    return (
      <div className="max-w-xs">
        <p className="truncate" title={descripcion}>
          {descripcion || 'Sin descripción'}
        </p>
      </div>
    );
  }

  function cellAcciones({ row }) {
    const game = row.original;

    return (
      <div className="flex gap-2">
        <ActionButton
          type="highlight"
          onClick={() => handleHighlight(game.id, game.highlighted)}
          title={game.highlighted ? "Quitar destacado" : "Destacar"}
          className={game.highlighted ? "bg-yellow-500 text-white" : ""}
        />

        <ActionButton
          type="view"
          onClick={() => {
            setSelectedGame(game);
            setModalType('view');
            setShowModal(true);
          }}
          title="Ver detalles"
        />

        <ActionButton
          type="edit"
          onClick={() => {
            setSelectedGame(game);
            setModalType('edit');
            setShowModal(true);
          }}
          title="Editar"
        />

        <ToggleSwitch
          checked={game.active}
          onChange={() => handleStatusChange(game.id, game.active)}
          title={game.active ? "Desactivar" : "Activar"}
          disabled={loading} // Disable during loading to prevent multiple clicks
        />
      </div>
    );
  }

  // Column definitions (unchanged)
  const columns = [
    {
      header: "No",
      accessorKey: "id",
      cell: cellNo,
    },
    {
      header: "Imagen y Título",
      accessorKey: "titulo",
      cell: cellImagenTitulo,
    },
    {
      header: "Precio",
      accessorKey: "precio",
      cell: cellPrecio
    },
    {
      header: "Descripción",
      accessorKey: "descripcion",
      cell: cellDescripcion
    },
    { header: "Req. Mínimos", accessorKey: "requisitos_minimos" },
    { header: "Req. Recomendados", accessorKey: "requisitos_recomendados" },
    {
      header: "Categoría",
      accessorKey: "category", // Assuming the game object directly has a 'category' object
      cell: ({ row }) => row.original.category ? row.original.category.name : 'N/A' // Display category name
    },
    {
      header: "Estado",
      accessorKey: "estado",
      cell: info => (
        info.getValue() === "Activo" ? (
          <span className="inline-block px-4 py-1 text-xs font-semibold rounded-full bg-green-200/80 text-green-800 text-center min-w-[90px]">
            Activo
          </span>
        ) : (
          <span className="inline-block px-4 py-1 text-xs font-semibold rounded-full bg-red-200/80 text-red-700 text-center min-w-[90px]">
            Inactivo
          </span>
        )
      ),
    },
    {
      header: "Acciones",
      id: "acciones",
      cell: cellAcciones,
    },
  ];


  // Error component
  const ErrorMessage = () => {
    if (!error) return null;

    return (
      <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <h3 className="font-bold">Error:</h3>
        <p>{error}</p>
        <button
          onClick={loadGames}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Reintentar conexión
        </button>
      </div>
    );
  };

  // Loading component
  const LoadingMessage = () => {
    if (!loading) return null;

    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <span className="ml-2 text-white">Cargando juegos...</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen hero_area">
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 min-w-0 bg-gradient-to-b from-[#06174d] via-black to-[#06174d] p-3 lg:p-5">
          <div className="w-auto h-auto pt-3">
            <div className="flex justify-between items-center mb-4 lg:mb-6">
              <h1 className="text-xl lg:text-2xl font-bold custom_heading">
                Lista de Juegos
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={loadGames}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  🔄 Actualizar
                </button>
                <button
                  onClick={() => {
                    setModalType('create');
                    setShowModal(true);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  ➕ Nuevo Juego
                </button>
              </div>
            </div>

           
            <ErrorMessage />

            {loading ? (
              <LoadingMessage />
            ) : (
              <div className="overflow-x-auto rounded-lg shadow-lg">
                <Table
                  columns={columns}
                  data={games}
                  emptyMessage={
                    <div className="text-center py-8 text-white">
                      <p className="text-lg">No hay juegos disponibles</p>
                      <p className="text-sm text-gray-300 mt-2">
                        Verifica la conexión con el servidor o crea un nuevo juego
                      </p>
                    </div>
                  }
                />
              </div>
            )}

            {/* Additional information */}
            {!loading && games.length > 0 && (
              <div className="mt-4 text-sm text-gray-300">
                Total de juegos: {games.length} |
                Activos: {games.filter(g => g.active).length} |
                Inactivos: {games.filter(g => !g.active).length}
              </div>
            )}

            {/* Modal for View/Edit/Create Game */}
            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                      {modalType === 'view' && 'Detalles del Juego'}
                      {modalType === 'edit' && 'Editar Juego'}
                      {modalType === 'create' && 'Nuevo Juego'}
                    </h2>
                    <button
                      onClick={() => setShowModal(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="overflow-y-auto max-h-[70vh]">
                    {modalType === 'view' ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Título</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedGame?.titulo}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Descripción</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedGame?.descripcion || 'Sin descripción'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Precio</label>
                          <p className="mt-1 text-sm text-gray-900">${selectedGame?.precio}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Categoría</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedGame?.category ? selectedGame.category.name : 'Sin categoría'}</p> {/* Display category name */}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Estado</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedGame?.estado}</p>
                        </div>
                        {selectedGame?.imagen && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Imagen</label>
                          <img
                            src={`http://localhost:8085/images/${selectedGame.imagen}`}
                            alt={selectedGame.titulo}
                            className="mt-1 w-full max-h-48 object-contain rounded"
                          />
                        </div>
                      )}
                      </div>
                    ) : (
                      <form onSubmit={handleSaveGame} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                          <input
                            type="text"
                            maxLength={100}
                            required
                            value={formData.titulo}
                            onChange={(e) => handleFormChange('titulo', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                          <textarea
                            rows={3}
                            value={formData.descripcion}
                            onChange={(e) => handleFormChange('descripcion', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            required
                            value={formData.precio}
                            onChange={(e) => handleFormChange('precio', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Imagen (nombre del archivo)</label>
                          <input
                            type="text"
                            value={formData.imagen}
                            onChange={(e) => handleFormChange('imagen', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Requisitos Mínimos</label>
                          <textarea
                            rows={3}
                            value={formData.requisitos_minimos}
                            onChange={(e) => handleFormChange('requisitos_minimos', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Requisitos Recomendados</label>
                          <textarea
                            rows={3}
                            value={formData.requisitos_recomendados}
                            onChange={(e) => handleFormChange('requisitos_recomendados', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Categoría ID *</label>
                          <input
                            type="number"
                            required
                            value={formData.categoryId}
                            onChange={(e) => handleFormChange('categoryId', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="active"
                            checked={formData.active}
                            onChange={(e) => handleFormChange('active', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="active" className="ml-2 block text-sm font-medium text-gray-700">Activo</label>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                          <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting || !formData.titulo?.trim() || !formData.precio || !formData.categoryId}
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSubmitting ? 'Guardando...' : (modalType === 'create' ? 'Crear' : 'Actualizar')}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}