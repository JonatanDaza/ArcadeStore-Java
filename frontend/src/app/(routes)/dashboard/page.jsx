"use client"

import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Header from 'app/components/header';
import Sidebar from 'app/components/sidebar';
import Footer from 'app/components/footer';
import ModernCircleChart from 'app/components/charts/modernCircleChart';
import ModernProgressBar from 'app/components/charts/modernProgressBar';
import TrendCard from 'app/components/charts/trendCard';
import DonutChart from 'app/components/charts/donutChart';
import { Users, BarChart3, ArrowLeftRight, Gamepad2, RefreshCw, FileText } from 'lucide-react';

// Services
import PublicGameService from 'app/services/api/publicGames';
import SalesService from 'app/services/api/sales';
import GameService from 'app/services/api/games';
import { getAllUsers } from 'app/services/api/users';
import AgreementService from 'app/services/api/agreements';
import { getAllAgreements } from 'app/services/api/agreements';
import ExchangeService from 'app/services/api/exchangeService';

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_users: 0,
    total_games: 0,
    total_intercambios: 0,
    total_agreements: 0,
    percentage_games_sold: 0,
    active_games: 0,
    paid_games: 0,
    free_games: 0,
    total_sales: 0,
    active_agreements: 0,
  });

  // Función para obtener las estadísticas del backend usando las APIs
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No token found");
        return;
      }

      console.log("🔄 Fetching stats from APIs...");
      
      // Inicializar estadísticas
      let newStats = {
        total_users: 0,
        total_games: 0,
        total_intercambios: 0,
        total_agreements: 0,
        percentage_games_sold: 0,
        active_games: 0,
        paid_games: 0,
        free_games: 0,
        total_sales: 0,
        active_agreements: 0,
      };

      // Obtener usuarios
      try {
        const users = await getAllUsers(token);
        newStats.total_users = Array.isArray(users) ? users.length : 0;
        console.log("👥 Users fetched:", newStats.total_users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }

      // Obtener juegos
      try {
        const allGames = await GameService.getAllGames(token);
        newStats.total_games = Array.isArray(allGames) ? allGames.length : 0;
        
        // Calcular juegos activos
        if (Array.isArray(allGames)) {
          newStats.active_games = allGames.filter(game => game.active).length;
        }
        
        console.log("🎮 Games fetched:", newStats.total_games, "Active:", newStats.active_games);
      } catch (error) {
        console.error("Error fetching games:", error);
      }

      // Obtener juegos públicos para más detalles
      try {
        const activeGames = await PublicGameService.getActiveGames();
        const paidGames = await PublicGameService.getPaidGames();
        const freeGames = await PublicGameService.getFreeGames();
        
        if (Array.isArray(activeGames)) {
          newStats.active_games = Math.max(newStats.active_games, activeGames.length);
        }
        if (Array.isArray(paidGames)) {
          newStats.paid_games = paidGames.length;
        }
        if (Array.isArray(freeGames)) {
          newStats.free_games = freeGames.length;
        }
        
        console.log("🎯 Public games - Active:", newStats.active_games, "Paid:", newStats.paid_games, "Free:", newStats.free_games);
      } catch (error) {
        console.error("Error fetching public games:", error);
      }

      // Obtener ventas
      try {
        const sales = await SalesService.getAllSales(token);
        if (Array.isArray(sales)) {
          newStats.total_sales = sales.length;
          newStats.total_intercambios = Math.floor(sales.length * 0.3); // Estimación
        }
        console.log("💰 Sales fetched:", newStats.total_sales);
      } catch (error) {
        console.error("Error fetching sales:", error);
      }

      // Obtener intercambios reales (en tiempo real)
      try {
        const exchanges = await ExchangeService.getAllExchanges(token);
        if (Array.isArray(exchanges)) {
          newStats.total_intercambios = exchanges.length;
        }
        console.log("🔄 Intercambios (reales) fetched:", newStats.total_intercambios);
      } catch (error) {
        console.error("Error fetching exchanges:", error);
      }

      // Obtener acuerdos/intercambios
      try {
        const agreements = await AgreementService.getAllAgreements(token);
        if (Array.isArray(agreements)) {
          newStats.total_agreements = agreements.length;
          newStats.active_agreements = agreements.filter(agreement => agreement.active !== false).length;
        }
        console.log("🤝 Agreements fetched:", newStats.total_agreements, "Active:", newStats.active_agreements);
      } catch (error) {
        console.error("Error fetching agreements:", error);
      }

      // Calcular porcentaje de juegos vendidos
      if (newStats.total_games > 0) {
        newStats.percentage_games_sold = (newStats.paid_games / newStats.total_games) * 100;
      }

      console.log("📊 Final stats:", newStats);
      setStats(newStats);
      
    } catch (error) {
      console.error("Error en la petición de estadísticas:", error);
      // Datos de ejemplo para demostración
      setStats({
        total_users: 126,
        total_games: 245,
        total_intercambios: 89,
        total_agreements: 89,
        percentage_games_sold: 73.5,
        active_games: 180,
        paid_games: 180,
        free_games: 65,
        total_sales: 156,
        active_agreements: 67,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const role = decoded.role?.toLowerCase();
        setUserRole(role || null);
        setIsAuthenticated(role === "admin");
        
        if (role === "admin") {
          fetchStats();
        } else {
          console.error("User is not admin");
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Error decodificando token:", err);
        setIsAuthenticated(false);
        setUserRole(null);
      }
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
    }
  }, []);

  // Redirect to login if not authenticated (you can implement this based on your routing)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Acceso Denegado</h2>
          <p className="text-gray-300 mb-6">Necesitas ser administrador para acceder a esta sección</p>
          <button 
            onClick={() => window.location.href = '/login'} 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ir al Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1 min-h-0">
          <Sidebar />
          <main className="flex-1 w-full min-h-[80vh] bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
              <div className="flex justify-center items-center h-64">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
                  <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-blue-400 opacity-20"></div>
                </div>
                <span className="ml-6 text-white text-xl font-medium">Cargando estadísticas...</span>
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  // Datos para el gráfico de dona
  const donutData = [
    { label: 'Gratuitos', value: stats.free_games },
    { label: 'De Pago', value: stats.paid_games },
    { label: 'Total', value: stats.total_games - stats.free_games - stats.paid_games },
  ];
  const donutColors = ['purple', 'darkblue', '#10b981' ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 w-full min-h-[80vh] bg-gradient-to-b from-[#06174d] via-black to-[#06174d] p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            {/* Encabezado del Dashboard */}
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent mb-4">
                Dashboard Administrativo
              </h1>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Monitorea el rendimiento de tu plataforma con métricas en tiempo real
              </p>
            </div>

            {/* Tarjetas de métricas principales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
              <TrendCard
                icon={Users}
                title="Total Usuarios"
                value={stats.total_users}
                trend={12.5}
                color="#3b82f6"
                bgGradient="bg-gradient-to-br to-[#0000FF] border border-gray-800 border-opacity-20"
              />
              
              <TrendCard
                icon={Gamepad2}
                title="Total Juegos"
                value={stats.total_games}
                trend={8.3}
                color="#10b981"
                bgGradient="bg-gradient-to-br to-[#008000] border border-gray-800 border-opacity-20"
              />
              
              <TrendCard
                icon={ArrowLeftRight}
                title="Intercambios"
                value={stats.total_intercambios}
                trend={-2.1}
                color="#f59e0b"
                bgGradient="bg-gradient-to-br to-[#dc7633] border border-gray-800 border-opacity-20"
              />
              
              <TrendCard
                icon={FileText}
                title="Acuerdos"
                value={stats.total_agreements}
                trend={15.2}
                color="#06b6d4"
                bgGradient="bg-gradient-to-br to-[#1b4f72] border border-gray-800 border-opacity-20]"
              />
              
              <TrendCard
                icon={BarChart3}
                title="Ventas"
                value={stats.total_sales}
                trend={5.7}
                color="#8b5cf6"
                bgGradient="bg-gradient-to-br to-[#800080] border border-gray-800 border-opacity-20"
              />
            </div>

            {/* Sección de gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Gráfico circular de ventas */}
              <div className="bg-gradient-to-br to-gray-800 bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border border-gray-800 border-opacity-20 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Progreso de Ventas</h3>
                <ModernCircleChart
                  percentage={stats.percentage_games_sold}
                  color="blue"
                  label="Juegos de Pago"
                  value={stats.percentage_games_sold}
                />
                <div className="mt-6 text-center">
                  <p className="text-white text-sm">
                    {stats.paid_games} de {stats.total_games} juegos son de pago
                  </p>
                </div>
              </div>

              {/* Gráfico de dona - Distribución de juegos */}
              <div className="bg-gradient-to-br to-gray-800 bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border border-gray-800 border-opacity-20 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Distribución de Juegos</h3>
                <DonutChart
                  data={donutData}
                  colors={donutColors}
                  centerText="Total"
                  centerValue={stats.total_games}
                />
                <div className="mt-6 space-y-2">
                  {donutData.map((item, index) => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: donutColors[index] }}
                        ></div>
                        <span className="text-white">{item.label}</span>
                      </div>
                      <span className="text-white font-bold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Barras de progreso detalladas */}
            <div className=" bg-gradient-to-br via-gray-800 to-gray-800 bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border border-gray-800 border-opacity-20 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-8 text-center">Métricas Detalladas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <ModernProgressBar
                  value={stats.total_users}
                  maxValue={200}
                  color="#0000FF"
                  label="Usuarios Registrados"
                />
                <ModernProgressBar
                  value={stats.total_games}
                  maxValue={300}
                  color="#008000"
                  label="Juegos Publicados"
                />
                <ModernProgressBar
                  value={stats.total_intercambios}
                  maxValue={150}
                  color="#dc7633"
                  label="Intercambios Realizados"
                />
                <ModernProgressBar
                  value={stats.total_agreements}
                  maxValue={150}
                  color="#1b4f72"
                  label="Acuerdos Totales"
                />
                <ModernProgressBar
                  value={stats.active_agreements}
                  maxValue={stats.total_agreements || 100}
                  color="#1b4f72"
                  label="Acuerdos Activos"
                />
                <ModernProgressBar
                  value={stats.total_sales}
                  maxValue={200}
                  color="#800080"
                  label="Ventas Realizadas"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}