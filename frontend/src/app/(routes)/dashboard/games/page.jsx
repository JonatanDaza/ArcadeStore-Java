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
import AgreementService from "app/services/api/agreements"; // NUEVO: Importar servicio de convenios

export default function GamesPage() {
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [agreements, setAgreements] = useState([]); // NUEVO: Estado para convenios
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view');
  const [selectedGame, setSelectedGame] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [agreementsLoading, setAgreementsLoading] = useState(false); // NUEVO: Estado de carga para convenios

  // Load categories for the dropdown
  const loadCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      console.log('🔄 Iniciando carga de categorías...');
      
      const token = localStorage.getItem("authToken");
      console.log('🔑 Token encontrado:', token ? 'Sí' : 'No');
      
      if (!token) {
        console.warn('⚠️ No hay token de autenticación');
        toast.error('No hay token de autenticación. Por favor, inicia sesión.');
        setCategories([]);
        return;
      }
      
      // Verificar conexión primero
      console.log('📡 Verificando conexión con categorías...');
      const isConnected = await CategoryService.checkConnection(token);
      console.log('📡 Conexión con categorías:', isConnected ? 'OK' : 'FALLO');
      
      if (!isConnected) {
        throw new Error('No se pudo conectar al servicio de categorías');
      }

      console.log('📦 Obteniendo categorías...');
      const categoriesData = await CategoryService.getAllCategories(token);
      
      console.log('📦 Datos de categorías recibidos:', categoriesData);
      console.log('📦 Tipo de datos:', typeof categoriesData);
      console.log('📦 Es array:', Array.isArray(categoriesData));
      console.log('📦 Longitud:', categoriesData?.length);
      
      if (Array.isArray(categoriesData)) {
        setCategories(categoriesData);
        console.log('✅ Categorías establecidas correctamente:', categoriesData.length, 'categorías');
        
        // Log detallado de cada categoría
        categoriesData.forEach((cat, index) => {
          console.log(`📂 Categoría ${index + 1}:`, {
            id: cat.id,
            name: cat.name,
            active: cat.active
          });
        });
      } else {
        console.warn('⚠️ Los datos de categorías no son un array:', categoriesData);
        setCategories([]);
      }
    } catch (err) {
      console.error('❌ Error loading categories:', err);
      console.error('❌ Error details:', {
        message: err.message,
        stack: err.stack,
        response: err.response
      });
      setCategories([]);
      toast?.error(`Error al cargar categorías: ${err.message}`);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  // NUEVO: Cargar convenios para el dropdown
  const loadAgreements = useCallback(async () => {
    try {
      setAgreementsLoading(true);
      console.log('🔄 Iniciando carga de convenios...');
      
      const token = localStorage.getItem("authToken");
      console.log('🔑 Token encontrado:', token ? 'Sí' : 'No');
      
      if (!token) {
        console.warn('⚠️ No hay token de autenticación para convenios');
        setAgreements([]);
        return;
      }
      
      // Verificar conexión primero
      console.log('📡 Verificando conexión con convenios...');
      const isConnected = await AgreementService.checkConnection(token);
      console.log('📡 Conexión con convenios:', isConnected ? 'OK' : 'FALLO');
      
      if (!isConnected) {
        console.warn('⚠️ No se pudo conectar al servicio de convenios');
        setAgreements([]);
        return;
      }

      console.log('📦 Obteniendo convenios...');
      const agreementsData = await AgreementService.getAllAgreements(token);
      
      console.log('📦 Datos de convenios recibidos:', agreementsData);
      console.log('📦 Tipo de datos:', typeof agreementsData);
      console.log('📦 Es array:', Array.isArray(agreementsData));
      console.log('📦 Longitud:', agreementsData?.length);
      
      if (Array.isArray(agreementsData)) {
        // Filtrar solo convenios activos
        const activeAgreements = agreementsData.filter(agreement => agreement.active);
        setAgreements(activeAgreements);
        console.log('✅ Convenios establecidos correctamente:', activeAgreements.length, 'convenios activos');
        
        // Log detallado de cada convenio
        activeAgreements.forEach((agreement, index) => {
          console.log(`🤝 Convenio ${index + 1}:`, {
            id: agreement.id,
            companyName: agreement.companyName,
            active: agreement.active
          });
        });
      } else {
        console.warn('⚠️ Los datos de convenios no son un array:', agreementsData);
        setAgreements([]);
      }
    } catch (err) {
      console.error('❌ Error loading agreements:', err);
      console.error('❌ Error details:', {
        message: err.message,
        stack: err.stack,
        response: err.response
      });
      setAgreements([]);
      // No mostrar error toast para convenios ya que es opcional
      console.warn('⚠️ Convenios no disponibles, continuando sin ellos');
    } finally {
      setAgreementsLoading(false);
    }
  }, []);

  // Load games on component mount
  const loadGames = useCallback(async () => {
    try {
      setLoading(true);
      setConnectionStatus('checking');
      setError(null);

      const token = localStorage.getItem("authToken");

      if (!token) {
        setError('No hay token de autenticación. Por favor, inicia sesión.');
        setConnectionStatus('error');
        return;
      }

      // Check connection first - Usar try/catch para manejar el error
      let isConnected = false;
      try {
        console.log('🔍 Verificando GameService:', GameService);
        console.log('🔍 Métodos disponibles:', Object.getOwnPropertyNames(GameService));
        
        if (typeof GameService.checkConnection === 'function') {
          isConnected = await GameService.checkConnection(token);
        } else {
          console.warn('⚠️ checkConnection no está disponible, intentando conexión directa');
          // Intentar conexión directa
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8085'}/api/games/health`);
          isConnected = response.ok;
        }
      } catch (connectionError) {
        console.error('❌ Error al verificar conexión:', connectionError);
        isConnected = false;
      }

      if (!isConnected) {
        setConnectionStatus('disconnected');
        setError('No se pudo conectar al servidor. Verifica que el backend esté ejecutándose.');
        return;
      }

      setConnectionStatus('connected');

      // Load games, categories and agreements
      const gamesData = await GameService.getAllGames(token);
      console.log('🎮 Datos de juegos recibidos del backend:', gamesData);
      
      // Mapear los datos del backend (inglés) al formato esperado por el frontend (español)
      const mappedGames = Array.isArray(gamesData) ? gamesData.map(game => ({
        id: game.id,
        titulo: game.title,
        descripcion: game.description,
        precio: game.price,
        imagen: game.imagePath,
        requisitos_minimos: game.requisiteMinimum,
        requisitos_recomendados: game.requisiteRecommended,
        active: game.active,
        highlighted: game.highlighted,
        category: game.category,
        agreement: game.agreement, // NUEVO: Mapear convenio (ahora es un objeto DTO)
        // Mantener también los campos originales para compatibilidad
        title: game.title,
        description: game.description,
        price: game.price,
        imagePath: game.imagePath,
        requisiteMinimum: game.requisiteMinimum,
        requisiteRecommended: game.requisiteRecommended
      })) : [];

      console.log('🎮 Juegos mapeados para el frontend:', mappedGames);
      setGames(mappedGames);

      await loadCategories();
      await loadAgreements(); // NUEVO: Cargar convenios
    } catch (err) {
      setConnectionStatus('error');
      const errorMessage = err.message || "Error al cargar juegos";
      setError(errorMessage);
      setGames([]);
      console.error('Error loading games:', err);
    } finally {
      setLoading(false);
    }
  }, [loadCategories, loadAgreements]);

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
              ? { ...game, active: newStatus }
              : game
          )
        );
        toast?.success(`Juego ${newStatus ? 'activado' : 'desactivado'} exitosamente`);
      } else {
        toast?.error("Error al cambiar estado del juego");
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
        toast?.error("Error al cambiar estado de destacado");
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
    // Preparar datos para edición - mapear de vuelta al formato del modal
    const gameForEdit = {
      id: game.id,
      titulo: game.titulo || game.title,
      descripcion: game.descripcion || game.description,
      precio: game.precio || game.price,
      imagen: game.imagen || game.imagePath,
      requisitos_minimos: game.requisitos_minimos || game.requisiteMinimum,
      requisitos_recomendados: game.requisitos_recomendados || game.requisiteRecommended,
      categoryId: game.category?.id,
      agreementId: game.agreement?.id, // NUEVO: Mapear convenio
      active: game.active,
      category: game.category,
      agreement: game.agreement // NUEVO: Incluir convenio completo
    };
    
    console.log('✏️ Juego preparado para edición:', gameForEdit);
    setSelectedGame(gameForEdit);
    setModalType('edit');
    setShowModal(true);
  }, []);

  // Function to create new game - MEJORADA
  const handleCreateGame = useCallback(() => {
    console.log('🎮 Intentando crear nuevo juego...');
    console.log('📂 Categorías disponibles:', categories);
    console.log('📂 Cantidad de categorías:', categories.length);
    console.log('🤝 Convenios disponibles:', agreements);
    console.log('🤝 Cantidad de convenios:', agreements.length);
    console.log('📂 Estado de carga de categorías:', categoriesLoading);
    console.log('🤝 Estado de carga de convenios:', agreementsLoading);
    
    // Verificar si las categorías están cargando
    if (categoriesLoading) {
      toast.info('Cargando categorías, por favor espera...');
      return;
    }
    
    // Si no hay categorías, intentar cargarlas primero
    if (categories.length === 0) {
      console.log('⚠️ No hay categorías, intentando cargar...');
      toast.info('Cargando categorías...');
      loadCategories().then(() => {
        console.log('📂 Categorías cargadas, abriendo modal...');
        setSelectedGame(null);
        setModalType('create');
        setShowModal(true);
      }).catch((err) => {
        console.error('❌ Error al cargar categorías:', err);
        toast.error('Error al cargar categorías. Aún puedes crear el juego, pero deberás asignar la categoría después.');
        // Abrir el modal de todas formas
        setSelectedGame(null);
        setModalType('create');
        setShowModal(true);
      });
      return;
    }
    
    // Si hay categorías, abrir el modal directamente
    console.log('✅ Abriendo modal de creación...');
    setSelectedGame(null);
    setModalType('create');
    setShowModal(true);
  }, [categories, categoriesLoading, loadCategories, agreements, agreementsLoading]);

  // Función para cerrar modal
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

      console.log('💾 Datos del juego a guardar:', gameData);

      // Transform data for API
      const apiData = new FormData();
      apiData.append('titulo', gameData.titulo || '');
      apiData.append('descripcion', gameData.descripcion || '');
      apiData.append('precio', gameData.precio?.toString() || '0');
      apiData.append('requisitos_minimos', gameData.requisitos_minimos || '');
      apiData.append('requisitos_recomendados', gameData.requisitos_recomendados || '');
      apiData.append('categoryId', gameData.categoryId?.toString() || '');
      
      // NUEVO: Agregar convenio - CORREGIDO
      if (gameData.agreementId && gameData.agreementId !== '' && gameData.agreementId !== 'null') {
        apiData.append('agreementId', gameData.agreementId.toString());
        console.log('🤝 Agregando convenio ID:', gameData.agreementId);
      } else {
        console.log('🤝 No se agregó convenio (opcional)');
      }
      
      apiData.append('active', gameData.active?.toString() || 'true');
      
      if (gameData.imagen instanceof File) {
        apiData.append('imagen', gameData.imagen);
      }

      // Debug: Mostrar todos los datos del FormData
      console.log('📋 Datos del FormData:');
      for (let [key, value] of apiData.entries()) {
        console.log(`  ${key}:`, value);
      }

      if (modalType === 'create') {
        const newGame = await GameService.createGame(apiData, token);
        console.log('✅ Juego creado:', newGame);
        
        // Mapear el juego creado al formato del frontend
        const mappedNewGame = {
          id: newGame.id,
          titulo: newGame.title,
          descripcion: newGame.description,
          precio: newGame.price,
          imagen: newGame.imagePath,
          requisitos_minimos: newGame.requisiteMinimum,
          requisitos_recomendados: newGame.requisiteRecommended,
          active: newGame.active,
          highlighted: newGame.highlighted,
          category: newGame.category,
          agreement: newGame.agreement, // NUEVO: Mapear convenio
          // Mantener también los campos originales
          title: newGame.title,
          description: newGame.description,
          price: newGame.price,
          imagePath: newGame.imagePath,
          requisiteMinimum: newGame.requisiteMinimum,
          requisiteRecommended: newGame.requisiteRecommended
        };
        
        setGames(prevGames => [...prevGames, mappedNewGame]);
        toast?.success('Juego creado exitosamente');
      } else if (modalType === 'edit' && selectedGame) {
        const updatedGame = await GameService.updateGame(selectedGame.id, apiData, token);
        console.log('✅ Juego actualizado:', updatedGame);
        
        // Mapear el juego actualizado al formato del frontend
        const mappedUpdatedGame = {
          id: updatedGame.id,
          titulo: updatedGame.title,
          descripcion: updatedGame.description,
          precio: updatedGame.price,
          imagen: updatedGame.imagePath,
          requisitos_minimos: updatedGame.requisiteMinimum,
          requisitos_recomendados: updatedGame.requisiteRecommended,
          active: updatedGame.active,
          highlighted: updatedGame.highlighted,
          category: updatedGame.category,
          agreement: updatedGame.agreement, // NUEVO: Mapear convenio
          // Mantener también los campos originales
          title: updatedGame.title,
          description: updatedGame.description,
          price: updatedGame.price,
          imagePath: updatedGame.imagePath,
          requisiteMinimum: updatedGame.requisiteMinimum,
          requisiteRecommended: updatedGame.requisiteRecommended
        };
        
        setGames(prevGames =>
          prevGames.map(game =>
            game.id === selectedGame.id ? mappedUpdatedGame : game
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
    // Usar tanto imagen como imagePath para compatibilidad
    const imagePath = game.imagen || game.imagePath 
      ? `http://localhost:8085/images/${game.imagen || game.imagePath}` 
      : '/images/default-game.png';

    return (
      <div className="flex items-center gap-2">
        <img
          src={imagePath}
          alt={game.titulo || game.title || 'Game Image'}
          className="w-24 h-16 object-cover rounded"
          onError={(e) => {
            e.target.src = '/images/default-game.png';
          }}
        />
        <span className="font-medium text-gray-800">{game.titulo || game.title}</span>
      </div>
    );
  }

  function cellPrecio({ row }) {
    const precio = row.original.precio || row.original.price;
    return (
      <span className="font-semibold text-green-600">
        ${typeof precio === 'number' ? precio.toLocaleString('es-CO') : precio}
      </span>
    );
  }

  function cellDescripcion({ row }) {
    const descripcion = row.original.descripcion || row.original.description;
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

  // Column definitions - AGREGADA COLUMNA DE CONVENIO
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
      header: "Categoría",
      accessorKey: "category",
      cell: ({ row }) => row.original.category ? row.original.category.name : 'N/A'
    },
    {
      header: "Convenio", // NUEVA COLUMNA
      accessorKey: "agreement",
      cell: ({ row }) => row.original.agreement ? row.original.agreement.companyName : 'Sin convenio'
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
    console.log('🔧 Generando campos del modal...');
    console.log('🔧 Categorías para el select:', categories);
    console.log('🔧 Cantidad de categorías:', categories.length);
    console.log('🔧 Convenios para el select:', agreements);
    console.log('🔧 Cantidad de convenios:', agreements.length);
    
    const categoryOptions = categories.map(cat => {
      console.log('🏷️ Mapeando categoría:', cat);
      return {
        value: cat.id,
        label: cat.name
      };
    });

    // NUEVO: Opciones de convenios
    const agreementOptions = agreements.map(agreement => {
      console.log('🤝 Mapeando convenio:', agreement);
      return {
        value: agreement.id,
        label: agreement.companyName
      };
    });
    
    console.log('🔧 Opciones del select de categorías generadas:', categoryOptions);
    console.log('🔧 Opciones del select de convenios generadas:', agreementOptions);
    
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
        accept: 'image/*',
        placeholder: 'Seleccionar imagen',
        helpText: 'Seleccione una imagen para el juego (JPG, PNG, GIF - máximo 5MB)'
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
        options: categoryOptions,
        errorMessage: 'La categoría es requerida',
        helpText: categories.length === 0 
          ? 'No hay categorías disponibles. Puedes crear el juego y asignar la categoría después.'
          : 'Seleccione la categoría del juego'
      },
      {
        name: 'agreementId', // NUEVO CAMPO
        label: 'Convenio',
        type: 'select',
        required: false,
        options: agreementOptions,
        helpText: agreements.length === 0 
          ? 'No hay convenios disponibles. Este campo es opcional.'
          : 'Seleccione el convenio asociado al juego (opcional)'
      },
      {
        name: 'active',
        label: 'Juego activo',
        type: 'checkbox',
        required: false,
        defaultValue: true,
        helpText: 'Marque si el juego debe estar activo'
      }
    ];
  };

  // Fields for show modal - AGREGADO CONVENIO
  const showFields = [
    {
      name: 'titulo',
      label: 'Título',
      type: 'text',
      getValue: (data) => data.titulo || data.title
    },
    {
      name: 'descripcion',
      label: 'Descripción',
      type: 'textarea',
      fullWidth: true,
      maxDisplayLength: 200,
      getValue: (data) => data.descripcion || data.description
    },
    {
      name: 'precio',
      label: 'Precio',
      type: 'currency',
      currency: 'COP',
      getValue: (data) => data.precio || data.price
    },
    {
      name: 'categoria',
      label: 'Categoría',
      type: 'text',
      getValue: (data) => data.category ? data.category.name : 'Sin categoría'
    },
    {
      name: 'convenio', // NUEVO CAMPO
      label: 'Convenio',
      type: 'text',
      getValue: (data) => data.agreement ? data.agreement.companyName : 'Sin convenio'
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
      type: 'image',
      baseUrl: 'http://localhost:8085/images/',
      defaultImage: '/images/default-game.png',
      getValue: (data) => data.imagen || data.imagePath
    }
  ];

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
              
              {/* Botón de crear juego con estado de debug */}
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-400">
                  Categorías: {categories.length} 
                  {categoriesLoading && ' (cargando...)'}
                  | Convenios: {agreements.length}
                  {agreementsLoading && ' (cargando...)'}
                </div>
                <button
                  onClick={handleCreateGame}
                  disabled={categoriesLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {categoriesLoading ? 'Cargando...' : 'Crear Juego'}
                </button>
              </div>
            </div>

            {/* Connection Status */}
            {connectionStatus !== 'connected' && (
              <div className={`border px-4 py-3 rounded mb-4 ${
                connectionStatus === 'checking' 
                  ? 'bg-yellow-100 border-yellow-400 text-yellow-700'
                  : 'bg-red-100 border-red-400 text-red-700'
              }`}>
                <div className="flex items-center justify-between">
                  <span>
                    {connectionStatus === 'checking' 
                      ? 'Verificando conexión...' 
                      : 'Sin conexión al servidor'}
                  </span>
                  {connectionStatus !== 'checking' && (
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
            )}

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
              <>
                <div className="overflow-x-auto rounded-lg shadow-lg">
                  <Table
                    columns={columns}
                    data={games}
                    emptyMessage="No hay juegos disponibles"
                    showAddButton={true}
                    onAdd={handleCreateGame}
                  />
                </div>

                {/* Game statistics */}
                {games.length > 0 && (
                  <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">Estadísticas</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">{gameStats.total}</div>
                        <div className="text-gray-300">Total</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{gameStats.active}</div>
                        <div className="text-gray-300">Activos</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-400">{gameStats.inactive}</div>
                        <div className="text-gray-300">Inactivos</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">{gameStats.highlighted}</div>
                        <div className="text-gray-300">Destacados</div>
                      </div>
                    </div>
                  </div>
                )}
              </>
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
          isSubmitting={isSubmitting}
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