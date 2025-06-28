"use client";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import Header from "app/components/header";
import Footer from "app/components/footer";
import Table from "app/components/Table";
import ActionButton, { ToggleSwitch } from "app/components/ActionButton";
import Sidebar from "app/components/sidebar";
import CreateModal from "app/components/modalCreate";
import ShowModal from "@/components/modalShow";

// Import the GameService
import GameService from "app/services/api/games";
import CategoryService from "app/services/api/categories";

export default function GamesPage() {
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view');
  const [selectedGame, setSelectedGame] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load categories for the dropdown
  const loadCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      const categoriesData = await CategoryService.getAllCategories(token);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (err) {
      console.error('Error loading categories:', err);
      setCategories([]);
    }
  }, []);

  // Load games on component mount
  const loadGames = useCallback(async () => {
    try {
      setLoading(true);
      setConnectionStatus('checking');
      setError(null);

      const token = localStorage.getItem("authToken");

      // Check connection first
      const isConnected = await GameService.checkConnection(token);
      if (!isConnected) {
        setConnectionStatus('disconnected');
        setError('No se pudo conectar al servidor. Verifica que el backend esté ejecutándose.');
        return;
      }

      setConnectionStatus('connected');

      // Load games and categories
      const gamesData = await GameService.getAllGames(token);
      setGames(Array.isArray(gamesData) ? gamesData : []);

      await loadCategories();
    } catch (err) {
      setConnectionStatus('error');
      const errorMessage = err.message || "Error al cargar juegos";
      setError(errorMessage);
      setGames([]);
      console.error('Error loading games:', err);
    } finally {
      setLoading(false);
    }
  }, [loadCategories]);

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  // Handle status change (activate/deactivate)
  const handleStatusChange = useCallback(async (gameId, currentActive) => {
    try {
      setError(null);
      const newStatus = !currentActive;
      const token = localStorage.getItem("authToken");

      const result = await GameService.changeGameStatus(gameId, newStatus, token);

      if (result) {
        setGames(prevGames =>
          prevGames.map(game =>
            game.id === gameId
              ? { ...game, active: newStatus, estado: newStatus ? "Activo" : "Inactivo" }
              : game
          )
        );
        toast?.success(`Juego ${newStatus ? 'activado' : 'desactivado'} exitosamente`);
      } else {
        toast?.error(result?.message || "Error al cambiar estado del juego");
      }
    } catch (err) {
      const errorMessage = err.message || 'Error desconocido al cambiar estado';
      toast?.error(`Error al cambiar estado: ${errorMessage}`);
      console.error('Error changing game status:', err);
    }
  }, []);

  // Handle highlight/unhighlight
  const handleHighlight = useCallback(async (gameId, currentHighlighted) => {
    try {
      setError(null);
      const newHighlighted = !currentHighlighted;
      const token = localStorage.getItem("authToken");

      const result = await GameService.highlightGame(gameId, newHighlighted, token);

      if (result) {
        setGames(prevGames =>
          prevGames.map(game =>
            game.id === gameId
              ? { ...game, highlighted: newHighlighted }
              : game
          )
        );
        toast?.success(`Juego ${newHighlighted ? 'destacado' : 'quitado de destacados'} exitosamente`);
      } else {
        toast?.error(result?.message || "Error al cambiar estado de destacado");
      }
    } catch (err) {
      const errorMessage = err.message || 'Error desconocido al destacar juego';
      toast?.error(`Error al destacar juego: ${errorMessage}`);
      console.error('Error highlighting game:', err);
    }
  }, []);

  // Function to handle viewing game details
  const handleViewGame = useCallback((game) => {
    setSelectedGame(game);
    setModalType('view');
    setShowModal(true);
  }, []);

  // Function to handle editing game
  const handleEditGame = useCallback((game) => {
    setSelectedGame(game);
    setModalType('edit');
    setShowModal(true);
  }, []);

  // Function to create new game
  const handleCreateGame = useCallback(() => {
    setSelectedGame(null);
    setModalType('create');
    setShowModal(true);
  }, []);

  // Function to close modal
  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setSelectedGame(null);
    setIsSubmitting(false);
  }, []);

  // Function to save game (create or update)
  const handleSaveGame = useCallback(async (gameData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const token = localStorage.getItem("authToken");

      // Transform data for API
      const apiData = new FormData();
      apiData.append('titulo', gameData.titulo);
      apiData.append('descripcion', gameData.descripcion || '');
      apiData.append('precio', Number(gameData.precio));
      if (gameData.imagen && gameData.imagen instanceof File) {
        apiData.append('imagen', gameData.imagen);
      } else if (gameData.imagen && typeof gameData.imagen === 'string') {
        apiData.append('imagen', gameData.imagen);
      }
      apiData.append('requisitos_minimos', gameData.requisitos_minimos || '');
      apiData.append('requisitos_recomendados', gameData.requisitos_recomendados || '');
      apiData.append('categoryId', Number(gameData.categoryId));
      apiData.append('active', Boolean(gameData.active));

      if (modalType === 'create') {
        const newGame = await GameService.createGame(apiData, token);
        setGames(prevGames => [...prevGames, {
          ...newGame,
          estado: newGame.active ? "Activo" : "Inactivo"
        }]);
        toast?.success('Juego creado exitosamente');
      } else if (modalType === 'edit' && selectedGame) {
        const updatedGame = await GameService.updateGame(selectedGame.id, apiData, token);
        setGames(prevGames =>
          prevGames.map(game =>
            game.id === selectedGame.id
              ? { ...game, ...updatedGame, estado: updatedGame.active ? "Activo" : "Inactivo" }
              : game
          )
        );
        toast?.success('Juego actualizado exitosamente');
      }

      handleCloseModal();
    } catch (err) {
      const errorMessage = err.message || 'Error desconocido al guardar';
      toast?.error(`Error al guardar: ${errorMessage}`);
      console.error('Error saving game:', err);
      throw err; // Re-throw to keep modal open on error
    } finally {
      setIsSubmitting(false);
    }
  }, [modalType, selectedGame, handleCloseModal]);

  // Functions for table cells
  function cellNo(info) {
    return info.row.index + 1;
  }

  function cellImagenTitulo({ row }) {
    const game = row.original;
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

  // Function for actions in each row
  const cellAcciones = useCallback(({ row }) => {
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
          onClick={() => handleViewGame(game)}
          title="Ver detalles"
        />

        <ActionButton
          type="edit"
          onClick={() => handleEditGame(game)}
          title="Editar"
        />

        <ToggleSwitch
          checked={Boolean(game.active)}
          onChange={() => handleStatusChange(game.id, game.active)}
          title={game.active ? "Desactivar" : "Activar"}
        />
      </div>
    );
  }, [handleHighlight, handleViewGame, handleEditGame, handleStatusChange]);

  // Column definitions
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
    {
      header: "Req. Mínimos",
      accessorKey: "requisitos_minimos",
      cell: info => (
        <div className="max-w-xs">
          <p className="truncate" title={info.getValue()}>
            {info.getValue() || 'No especificado'}
          </p>
        </div>
      )
    },
    {
      header: "Req. Recomendados",
      accessorKey: "requisitos_recomendados",
      cell: info => (
        <div className="max-w-xs">
          <p className="truncate" title={info.getValue()}>
            {info.getValue() || 'No especificado'}
          </p>
        </div>
      )
    },
    {
      header: "Categoría",
      accessorKey: "category",
      cell: ({ row }) => row.original.category ? row.original.category.name : 'N/A'
    },
    {
      header: "Estado",
      accessorKey: "active",
      cell: info => (
        info.getValue() ? (
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

  // Configuration for modal fields
  const getModalFields = () => {
    return [
      {
        name: 'titulo',
        label: 'Título',
        type: 'text',
        required: true,
        placeholder: 'Ingrese el título del juego',
        minLength: 2,
        maxLength: 100,
        errorMessage: 'El título es requerido',
        helpText: 'Mínimo 2 caracteres, máximo 100'
      },
      {
        name: 'descripcion',
        label: 'Descripción',
        type: 'textarea',
        required: false,
        placeholder: 'Ingrese una descripción del juego',
        maxLength: 1000,
        rows: 4,
        helpText: 'Descripción opcional del juego (máximo 1000 caracteres)'
      },
      {
        name: 'precio',
        label: 'Precio',
        type: 'number',
        required: true,
        placeholder: '0.00',
        min: 0,
        step: 0.01,
        errorMessage: 'El precio es requerido y debe ser mayor a 0',
        helpText: 'Precio en pesos colombianos'
      },
      {
        name: 'imagen',
        label: 'Imagen',
        type: 'file',
        required: false,
        placeholder: 'Seleccionar imagen',
        helpText: 'Seleccione una imagen para el juego (opcional)'
      },
      {
        name: 'requisitos_minimos',
        label: 'Requisitos Mínimos',
        type: 'textarea',
        required: false,
        placeholder: 'Especifique los requisitos mínimos del sistema',
        maxLength: 500,
        rows: 3,
        helpText: 'Requisitos mínimos del sistema (opcional)'
      },
      {
        name: 'requisitos_recomendados',
        label: 'Requisitos Recomendados',
        type: 'textarea',
        required: false,
        placeholder: 'Especifique los requisitos recomendados del sistema',
        maxLength: 500,
        rows: 3,
        helpText: 'Requisitos recomendados del sistema (opcional)'
      },
      {
        name: 'categoryId',
        label: 'Categoría',
        type: 'select',
        required: true,
        options: categories.map(cat => ({
          value: cat.id,
          label: cat.name
        })),
        errorMessage: 'La categoría es requerida',
        helpText: 'Seleccione la categoría del juego'
      },
      {
        name: 'active',
        label: 'Juego activo',
        type: 'checkbox',
        required: false,
        defaultValue: true
      }
    ];
  };

  // Fields for show modal
  const showFields = [
    {
      name: 'titulo',
      label: 'Título',
      type: 'text'
    },
    {
      name: 'descripcion',
      label: 'Descripción',
      type: 'textarea',
      fullWidth: true,
      maxDisplayLength: 200
    },
    {
      name: 'precio',
      label: 'Precio',
      type: 'currency',
      currency: 'COP'
    },
    {
      name: 'categoria',
      label: 'Categoría',
      type: 'text',
      getValue: (data) => data.category ? data.category.name : 'Sin categoría'
    },
    {
      name: 'requisitos_minimos',
      label: 'Requisitos Mínimos',
      type: 'textarea',
      maxDisplayLength: 150
    },
    {
      name: 'requisitos_recomendados',
      label: 'Requisitos Recomendados',
      type: 'textarea',
      maxDisplayLength: 150
    },
    {
      name: 'active',
      label: 'Estado',
      type: 'boolean',
      trueText: 'Activo',
      falseText: 'Inactivo'
    },
    {
      name: 'highlighted',
      label: 'Destacado',
      type: 'boolean',
      trueText: 'Sí',
      falseText: 'No'
    },
    {
      name: 'imagen',
      label: 'Imagen',
      type: 'imagen',
      required: false,
      errorMessage: 'Seleccione una imagen válida',
      helpText: 'Seleccione una imagen para el juego (JPG, PNG, GIF)'
    }
  ];

  // Connection status component
  const ConnectionStatus = () => {
    const statusConfig = {
      checking: {
        color: 'bg-yellow-100 border-yellow-400 text-yellow-700',
        text: 'Verificando conexión...'
      },
      connected: {
        color: 'bg-green-100 border-green-400 text-green-700',
        text: 'Conectado al servidor'
      },
      disconnected: {
        color: 'bg-red-100 border-red-400 text-red-700',
        text: 'Sin conexión al servidor'
      },
      error: {
        color: 'bg-red-100 border-red-400 text-red-700',
        text: 'Error de conexión'
      }
    };

    const config = statusConfig[connectionStatus] || statusConfig.error;

    return (
      <div className={`${config.color} border px-4 py-3 rounded mb-4`}>
        <div className="flex items-center justify-between">
          <span>{config.text}</span>
          {connectionStatus !== 'connected' && (
            <button
              onClick={loadGames}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Conectando...' : 'Reconectar'}
            </button>
          )}
        </div>
      </div>
    );
  };

  // Game statistics
  const gameStats = {
    total: games.length,
    active: games.filter(game => game.active).length,
    inactive: games.filter(game => !game.active).length,
    highlighted: games.filter(game => game.highlighted).length
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
            </div>

            {/* Loading state */}
            {loading && (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                <span className="ml-3 text-white">Cargando juegos...</span>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <strong>Error:</strong> {error}
                    <br />
                    <small className="text-xs mt-2 block">
                      Posibles soluciones:
                      <br />
                      • Verificar que el backend esté ejecutándose en http://localhost:8085
                      <br />
                      • Revisar la configuración de CORS en el servidor
                      <br />
                      • Verificar que no haya firewall bloqueando la conexión
                    </small>
                  </div>
                  <button
                    onClick={loadGames}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm ml-4 disabled:opacity-50"
                  >
                    {loading ? 'Cargando...' : 'Reintentar'}
                  </button>
                </div>
              </div>
            )}

            {/* Games table */}
            {!loading && !error && connectionStatus === 'connected' && (
              <div className="overflow-x-auto rounded-lg shadow-lg">
                <Table
                  columns={columns}
                  data={games}
                  emptyMessage="No hay juegos disponibles"
                  showAddButton={true}
                  onAdd={handleCreateGame}
                />
              </div>
            )}

            {/* Additional information */}
            {!loading && !error && games.length > 0 && (
              <div className="mt-4 text-sm text-gray-300">
                Total de juegos: {gameStats.total} |
                Activos: {gameStats.active} |
                Inactivos: {gameStats.inactive} |
                Destacados: {gameStats.highlighted}
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />

      {/* Universal Modal */}
      {showModal && (modalType === 'create' || modalType === 'edit') && (
        <CreateModal
          showModal={showModal}
          onClose={handleCloseModal}
          onSave={handleSaveGame}
          title={modalType === 'create' ? 'Nuevo Juego' : 'Editar Juego'}
          fields={getModalFields()}
          initialData={selectedGame || {}}
        />
      )}
      {showModal && modalType === 'view' && (
        <ShowModal
          showModal={showModal}
          onClose={handleCloseModal}
          title="Detalles del Juego"
          data={selectedGame}
          fields={showFields}
        />
      )}
    </div>
  );
}
