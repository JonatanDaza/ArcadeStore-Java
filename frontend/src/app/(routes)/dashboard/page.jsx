'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Header from "app/components/header";
import Sidebar from "app/components/sidebar";
import Footer from "app/components/footer";
import AnimatedCircle from "app/components/AnimatedCicle";
import AnimatedProgressBar from "app/components/AnimatedProgressBar";
import { UserGroupIcon, ChartBarIcon, ArrowsRightLeftIcon, PuzzlePieceIcon } from "@heroicons/react/24/outline";

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [stats, setStats] = useState({
    total_users: 0,
    total_games: 0,
    total_intercambios: 0,
    percentage_games_sold: 0,
  });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const role = decoded.role?.toLowerCase();
        setUserRole(role);
        setIsAuthenticated(role === "admin");
        if (role !== "admin") {
          router.replace("/login");
        }
      } catch (err) {
        setIsAuthenticated(false);
        setUserRole(null);
        router.replace("/login");
      }
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
      router.replace("/login");
    }
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen hero_area">
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 w-full min-h-[80vh] bg-gradient-to-b from-[#06174d] via-black to-[#06174d] p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {/* Usuarios */}
              <div className="card bg-white rounded-xl shadow-xl p-4 sm:p-6 hover:-translate-y-2 transition group border border-gray-100 flex flex-col items-center w-full">
                <div className="flex items-center gap-3 mb-3 w-full justify-center">
                  <ChartBarIcon className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 group-hover:scale-110 transition flex-shrink-0" />
                  <h3 className="text-base sm:text-lg font-semibold text-[#555]">Ventas</h3>
                </div>
                <span className="text-[#555] mb-2 text-sm sm:text-base text-center">Progreso Ventas</span>
                <div className="w-full flex justify-center">
                  <AnimatedCircle percentage={stats.percentage_games_sold ?? 0} color="#22c55e" />
                </div>
              </div>

              <div className="card bg-white rounded-xl shadow-xl p-4 sm:p-6 hover:-translate-y-2 transition group border border-gray-100 w-full">
                <div className="flex items-center gap-3 mb-3">
                  <ArrowsRightLeftIcon className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500 group-hover:scale-110 transition flex-shrink-0" />
                  <h3 className="text-base sm:text-lg font-semibold text-[#555] truncate">Intercambios</h3>
                </div>
                <p className="text-[#555] text-sm sm:text-base mb-3 leading-relaxed">
                  Total de Intercambios Realizados:{" "}
                  <span className="font-bold block sm:inline">{stats.total_intercambios ?? 0}</span>
                </p>
                <AnimatedProgressBar value={stats.total_intercambios ?? 0} color="#a78bfa" />
              </div>

              <div className="card bg-white rounded-xl shadow-xl p-4 sm:p-6 hover:-translate-y-2 transition group border border-gray-100 w-full">
                <div className="flex items-center gap-3 mb-3">
                  <PuzzlePieceIcon className="h-6 w-6 sm:h-8 sm:w-8 text-pink-500 group-hover:scale-110 transition flex-shrink-0" />
                  <h3 className="text-base sm:text-lg font-semibold text-[#555] truncate">Juegos</h3>
                </div>
                <p className="text-[#555] text-sm sm:text-base mb-3 leading-relaxed">
                  Total de Juegos: <span className="font-bold block sm:inline">{stats.total_games ?? 0}</span>
                </p>
                <AnimatedProgressBar value={stats.total_games ?? 0} color="#ec4899" />
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}