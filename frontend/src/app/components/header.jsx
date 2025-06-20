"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userRole] = useState("admin");
  const [userName] = useState("Jonatan");
  const [userNick] = useState("JDaza");
  const userId = 123;
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const router = useRouter();

  const handleLogout = () => {
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <header className="bg-black pt-6 pb-4 shadow-lg">
      <div className="px-6 md:px-8">
        <nav className="flex items-center justify-between py-2 z-[99999] relative">
          {/* Logo */}
          <Link
            href="/"
            className="flex flex-col items-center uppercase font-bold text-[24px] text-[#fafcfd] no-underline mr-2"
          >
            <img src="/images/logo.png" alt="Logo Arcade Store" className="w-[30px] mb-1" />
            <span className="text-[20px] font-bold text-white mt-1 tracking-wide">ARCADE STORE</span>
          </Link>

          {/* Botón menú móvil */}
          <button
            className="ml-2 p-2 rounded focus:outline-none border-none bg-transparent lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
          >
            <svg className="h-8 w-8" fill="none" stroke="white" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Navegación y login/usuario (escritorio) */}
          <div className="hidden lg:flex flex-1 items-center justify-between">
            {/* Navegación */}
            <ul className="flex flex-row gap-x-1 ml-4">
              <li>
                <Link
                  href="/"
                  className="block py-2 px-4 text-white text-center uppercase no-underline hover:text-yellow-400 transition"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/games"
                  className="block py-2 px-4 text-white text-center uppercase no-underline hover:text-yellow-400 transition"
                >
                  Juegos
                </Link>
              </li>
              <li>
                <Link
                  href="/freeGames"
                  className="block py-2 px-4 text-white text-center uppercase no-underline hover:text-yellow-400 transition"
                >
                  Free to play
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="block py-2 px-4 text-white text-center uppercase no-underline hover:text-yellow-400 transition"
                >
                  Contáctenos
                </Link>
              </li>
              {isAuthenticated && userRole === "admin" && (
                <li>
                  <Link
                    href="/dashboard"
                    className="block py-2 px-4 text-white text-center uppercase no-underline hover:text-yellow-400 transition"
                  >
                    Dashboard
                  </Link>
                </li>
              )}
            </ul>
            {/* Login/Usuario */}
            <ul className="flex flex-row gap-x-1">
              {!isAuthenticated ? (
                <>
                  <li>
                    <Link
                      href="/login"
                      className="block py-2 px-4 text-white uppercase no-underline hover:text-yellow-400 transition"
                    >
                      Iniciar Sesión
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/register"
                      className="block py-2 px-4 text-white uppercase no-underline hover:text-yellow-400 transition"
                    >
                      Registrar
                    </Link>
                  </li>
                </>
              ) : (
                <li className="relative">
                  <button
                    className="flex items-center py-2 px-4 text-white uppercase hover:text-yellow-400 transition focus:outline-none"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    {userRole === "admin"
                      ? `Administrador - ${userName || userNick}`
                      : userNick || userName}
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {dropdownOpen && (
                    <ul className="absolute right-0 mt-2 w-40 bg-white text-gray-900 rounded shadow-lg z-50">
                      <li>
                        <Link
                          href={`/profile/${userId}`}
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Mi perfil
                        </Link>
                      </li>
                      <li>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => {
                            setDropdownOpen(false);
                            handleLogout();
                          }}
                          type="button"
                        >
                          Cerrar Sesión
                        </button>
                      </li>
                    </ul>
                  )}
                </li>
              )}
            </ul>
          </div>
        </nav>

        {/* Menú colapsable móvil: animación y login centrado */}
        <div
          className={`overflow-hidden transition-all duration-800 ease-in-out ${
            menuOpen ? "max-h-[800px]" : "max-h-0"
          } lg:hidden w-full bg-black rounded-b`}
        >
          <ul className="flex flex-col items-center gap-y-1 px-4 py-2 text-center">
            <li>
              <Link
                href="/"
                className="block py-2 px-4 text-white uppercase no-underline hover:text-yellow-400 transition"
                onClick={() => setMenuOpen(false)}
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                href="/games"
                className="block py-2 px-4 text-white uppercase no-underline hover:text-yellow-400 transition"
                onClick={() => setMenuOpen(false)}
              >
                Juegos
              </Link>
            </li>
            <li>
              <Link
                href="/freeGames"
                className="block py-2 px-4 text-white uppercase no-underline hover:text-yellow-400 transition"
                onClick={() => setMenuOpen(false)}
              >
                Free to play
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="block py-2 px-4 text-white uppercase no-underline hover:text-yellow-400 transition"
                onClick={() => setMenuOpen(false)}
              >
                Contáctenos
              </Link>
            </li>
            {isAuthenticated && userRole === "admin" && (
              <li>
                <Link
                  href="/dashboard"
                  className="block py-2 px-4 text-white uppercase no-underline hover:text-yellow-400 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
            )}
            {/* Login/User (Mobile only, centrado) */}
            {!isAuthenticated ? (
              <>
                <li>
                  <Link
                    href="/login"
                    className="block py-2 px-4 text-white uppercase no-underline hover:text-yellow-400 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="block py-2 px-4 text-white uppercase no-underline hover:text-yellow-400 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Registrar
                  </Link>
                </li>
              </>
            ) : (
              <li className="relative w-full flex flex-col items-center">
                <button
                  className="flex items-center justify-center py-2 px-4 text-white uppercase hover:text-yellow-400 transition focus:outline-none w-full"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {userRole === "admin"
                    ? `Administrador - ${userName || userNick}`
                    : userNick || userName}
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <ul className="mt-2 w-40 bg-white text-gray-900 rounded shadow-lg z-50 text-left">
                    <li>
                      <Link
                        href={`/profile/${userId}`}
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => {
                          setDropdownOpen(false);
                          setMenuOpen(false);
                        }}
                      >
                        Mi perfil
                      </Link>
                    </li>
                    <li>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => {
                          setDropdownOpen(false);
                          setMenuOpen(false);
                          handleLogout();
                        }}
                        type="button"
                      >
                        Cerrar Sesión
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}