'use client';

import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import {
  UserGroupIcon,
  ChartBarIcon,
  ArrowsRightLeftIcon,
  PuzzlePieceIcon,
  Squares2X2Icon,
  UsersIcon,
  CurrencyDollarIcon,
  HandRaisedIcon
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
    <div className="flex flex-col min-h-screen bg-[#f4f4f9]">
      <Header />
      <div className="dashboard flex flex-1 w-full min-h-[80vh] bg-gradient-to-b from-[#06174d] via-black to-[#06174d] p-5 m-0">
        
        <aside className="sidebar w-[280px] min-w-[200px] bg-gradient-to-br from-black via-[#06174d] to-black text-white p-5 h-full rounded-2xl shadow-xl flex flex-col">
        
          <div className="flex items-center gap-3 mb-8">
            <Squares2X2Icon className="h-8 w-8 text-yellow-400" />
            <span className="text-2xl font-bold tracking-wide">Admin</span>
          </div>
          <nav className="flex-1">
            <ul className="space-y-2">
              <li>
                <a
                  href="/dashboard/games"
                  className="flex items-center gap-3 text-white text-lg px-3 py-2 rounded-lg hover:bg-[#222c4d] hover:text-yellow-400 transition"
                >
                  <PuzzlePieceIcon className="h-6 w-6" />
                  Juegos
                </a>
              </li>
              <li>
                <a
                  href="/dashboard/users"
                  className="flex items-center gap-3 text-white text-lg px-3 py-2 rounded-lg hover:bg-[#222c4d] hover:text-yellow-400 transition"
                >
                  <UsersIcon className="h-6 w-6" />
                  Usuarios
                </a>
              </li>
              <li>
                <a
                  href="/dashboard/categories"
                  className="flex items-center gap-3 text-white text-lg px-3 py-2 rounded-lg hover:bg-[#222c4d] hover:text-yellow-400 transition"
                >
                  <Squares2X2Icon className="h-6 w-6" />
                  Categorías
                </a>
              </li>
              <li>
                <a
                  href="/dashboard/exchanges"
                  className="flex items-center gap-3 text-white text-lg px-3 py-2 rounded-lg hover:bg-[#222c4d] hover:text-yellow-400 transition"
                >
                  <ArrowsRightLeftIcon className="h-6 w-6" />
                  Intercambios
                </a>
              </li>
              <li>
                <a
                  href="/dashboard/sold"
                  className="flex items-center gap-3 text-white text-lg px-3 py-2 rounded-lg hover:bg-[#222c4d] hover:text-yellow-400 transition"
                >
                  <CurrencyDollarIcon className="h-6 w-6" />
                  Ventas
                </a>
              </li>
              <li>
                <a
                  href="/dashboard/agreement"
                  className="flex items-center gap-3 text-white text-lg px-3 py-2 rounded-lg hover:bg-[#222c4d] hover:text-yellow-400 transition"
                >
                  <HandRaisedIcon className="h-6 w-6" />
                  Convenios
                </a>
              </li>
            </ul>
          </nav>
          
          <div className="border-t border-[#2b2b2b] mt-8 pt-4 text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} ArcadeStore Admin
          </div>
        </aside>
       
        <main className="flex-grow p-8 bg-transparent">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Usuarios */}
              <div className="card bg-white rounded-xl shadow-xl p-6 hover:-translate-y-2 transition group border border-gray-100 min-w-[220px] max-w-xs mx-auto">
                <div className="flex items-center gap-3 mb-3">
                  <UserGroupIcon className="h-8 w-8 text-blue-500 group-hover:scale-110 transition" />
                  <h3 className="text-lg font-semibold text-[#555]">Usuarios</h3>
                </div>
                <p className="text-[#555] text-base mb-3">
                  Total de Usuarios Registrados:{" "}
                  <span className="font-bold">{stats.total_users ?? 0}</span>
                </p>
                <AnimatedProgressBar value={stats.total_users ?? 0} color="#3b82f6" />
              </div>
              {/* Ventas */}
              <div className="card bg-white rounded-xl shadow-xl p-6 hover:-translate-y-2 transition group border border-gray-100 flex flex-col items-center">
                <div className="flex items-center gap-3 mb-3">
                  <ChartBarIcon className="h-8 w-8 text-green-500 group-hover:scale-110 transition" />
                  <h3 className="text-lg font-semibold text-[#555]">Ventas</h3>
                </div>
                <span className="text-[#555] mb-2">Progreso Ventas</span>
                <AnimatedCircle percentage={percentage} color={color} />
              </div>
              {/* Intercambios */}
              <div className="card bg-white rounded-xl shadow-xl p-6 hover:-translate-y-2 transition group border border-gray-100 min-w-[220px] max-w-xs mx-auto">
                <div className="flex items-center gap-3 mb-3">
                  <ArrowsRightLeftIcon className="h-8 w-8 text-purple-500 group-hover:scale-110 transition" />
                  <h3 className="text-lg font-semibold text-[#555]">Intercambios</h3>
                </div>
                <p className="text-[#555] text-base mb-3">
                  Total de Intercambios Realizados:{" "}
                  <span className="font-bold">{stats.total_intercambios ?? 0}</span>
                </p>
                <AnimatedProgressBar value={stats.total_intercambios ?? 0} color="#a78bfa" />
              </div>
              {/* Juegos */}
              <div className="card bg-white rounded-xl shadow-xl p-6 hover:-translate-y-2 transition group border border-gray-100 min-w-[220px] max-w-xs mx-auto">
                <div className="flex items-center gap-3 mb-3">
                  <PuzzlePieceIcon className="h-8 w-8 text-pink-500 group-hover:scale-110 transition" />
                  <h3 className="text-lg font-semibold text-[#555]">Juegos</h3>
                </div>
                <p className="text-[#555] text-base mb-3">
                  Total de Juegos: <span className="font-bold">{stats.total_games ?? 0}</span>
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