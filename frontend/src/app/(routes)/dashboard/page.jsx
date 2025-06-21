'use client';

import Header from "app/components/header";
import Footer from "app/components/footer";
import Sidebar from "app/components/sidebar";
import {
  UserGroupIcon,
  ChartBarIcon,
  ArrowsRightLeftIcon,
  PuzzlePieceIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

// Simulación de datos (puedes reemplazar por fetch real)
const stats = {
  total_users: 120,
  percentage_games_sold: 65,
  total_intercambios: 40,
  total_games: 80,
};

function AnimatedProgressBar({ value, color }) {
  return (
    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700`}
        style={{
          width: `${value}%`,
          background: color,
        }}
      ></div>
    </div>
  );
}

function AnimatedCircle({ percentage, color }) {
  // SVG círculo animado
  const radius = 45;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2} className="mx-auto block">
      <circle
        stroke="#e5e7eb"
        fill="white"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke={color}
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference + " " + circumference}
        style={{ strokeDashoffset, transition: "stroke-dashoffset 1s" }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        strokeLinecap="round"
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize="1.3em"
        fontWeight="bold"
        fill="#374151"
      >
        {percentage}%
      </text>
    </svg>
  );
}

export default function DashboardPage() {
  let percentage = stats.percentage_games_sold ?? 0;
  let color = "#4CAF50";
  if (percentage < 50) color = "#FFC107";
  if (percentage < 25) color = "#F44336";

  return (
    <div className="flex flex-col min-h-screen hero_area">
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 w-full min-h-[80vh] bg-gradient-to-b from-[#06174d] via-black to-[#06174d] p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {/* Usuarios */}
              <div className="card bg-white rounded-xl shadow-xl p-4 sm:p-6 hover:-translate-y-2 transition group border border-gray-100 w-full">
                <div className="flex items-center gap-3 mb-3">
                  <UserGroupIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 group-hover:scale-110 transition flex-shrink-0" />
                  <h3 className="text-base sm:text-lg font-semibold text-[#555] truncate">Usuarios</h3>
                </div>
                <p className="text-[#555] text-sm sm:text-base mb-3 leading-relaxed">
                  Total de Usuarios Registrados:{" "}
                  <span className="font-bold block sm:inline">{stats.total_users ?? 0}</span>
                </p>
                <AnimatedProgressBar value={stats.total_users ?? 0} color="#3b82f6" />
              </div>

              {/* Ventas */}
              <div className="card bg-white rounded-xl shadow-xl p-4 sm:p-6 hover:-translate-y-2 transition group border border-gray-100 flex flex-col items-center w-full">
                <div className="flex items-center gap-3 mb-3 w-full justify-center">
                  <ChartBarIcon className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 group-hover:scale-110 transition flex-shrink-0" />
                  <h3 className="text-base sm:text-lg font-semibold text-[#555]">Ventas</h3>
                </div>
                <span className="text-[#555] mb-2 text-sm sm:text-base text-center">Progreso Ventas</span>
                <div className="w-full flex justify-center">
                  <AnimatedCircle percentage={percentage} color={color} />
                </div>
              </div>

              {/* Intercambios */}
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

              {/* Juegos */}
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