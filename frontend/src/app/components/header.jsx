"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState("");
  const [userNick, setUserNick] = useState("");
  const [userId, setUserId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const router = useRouter();

  // Función para cargar datos del usuario
  const loadUserData = () => {
    const storedRole = localStorage.getItem("userRole");
    const storedName = localStorage.getItem("userName");
    const storedNick = localStorage.getItem("userNick");
    const storedId = localStorage.getItem("id"); // Usar "id" consistentemente

    setUserRole(storedRole);
    setUserName(storedName || "Usuario");
    setUserNick(storedNick || "user");
    setUserId(storedId);
    setIsAuthenticated(!!storedRole && !!storedId);
  };

  useEffect(() => {
    // Cargar datos iniciales
    loadUserData();
    window.addEventListener('storageChange', loadUserData);
    return () => window.removeEventListener('storageChange', loadUserData);
  }, []);

  useEffect(() => {
    console.log("userRole:", userRole);
  }, [userRole]);

  const handleLogout = () => {
    // Limpiar todos los datos de autenticación
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userNick");
    localStorage.removeItem("id");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userSession");
    
    // Actualizar estado local inmediatamente
    setIsAuthenticated(false);
    setUserRole(null);
    setUserName("");
    setUserNick("");
    setUserId(null);
    
    // Disparar evento para que otros componentes se enteren
    window.dispatchEvent(new Event('storage'));
    
    // Redireccionar
    router.push("/");
  };

  // Cerrar dropdowns cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.dropdown-container')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  return (
    <header className="bg-black w-full shadow-lg">
      <div className="px-2 sm:px-4 md:px-6 lg:px-8">
        <nav className="flex items-center justify-between py-2 sm:py-3 md:py-4 z-[99999] relative">
          {/* Logo */}
          <Link
            href="/"
            className="flex flex-col items-center uppercase font-bold text-[18px] sm:text-[20px] md:text-[24px] text-[#fafcfd] no-underline flex-shrink-0"
          >
            <img src="/images/logo.png" alt="Logo Arcade Store" className="w-[24px] sm:w-[28px] md:w-[30px] mb-1" />
            <span className="text-[16px] sm:text-[18px] md:text-[20px] font-bold text-white mt-1 tracking-wide">ARCADE STORE</span>
          </Link>

          {/* Botón menú móvil */}
          <button
            className="p-2 rounded focus:outline-none border-none bg-transparent lg:hidden flex-shrink-0"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
          >
            <svg className="h-6 w-6 sm:h-8 sm:w-8" fill="none" stroke="white" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Navegación y login/usuario (escritorio) */}
          <div className="hidden lg:flex flex-1 items-center justify-between min-w-0 ml-4">
            {/* Navegación */}
            <ul className="flex flex-row gap-x-1 xl:gap-x-2">
              <li>
                <Link
                  href="/"
                  className="block py-2 px-2 xl:px-4 text-white text-center uppercase no-underline hover:text-yellow-400 transition text-sm xl:text-base whitespace-nowrap"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/games"
                  className="block py-2 px-2 xl:px-4 text-white text-center uppercase no-underline hover:text-yellow-400 transition text-sm xl:text-base whitespace-nowrap"
                >
                  Juegos
                </Link>
              </li>
              <li>
                <Link
                  href="/games/freeGames"
                  className="block py-2 px-2 xl:px-4 text-white text-center uppercase no-underline hover:text-yellow-400 transition text-sm xl:text-base whitespace-nowrap"
                >
                  Free to play
                </Link>
              </li>
              <li>
                <Link
                  href="/library"
                  className="block py-2 px-2 xl:px-4 text-white text-center uppercase no-underline hover:text-yellow-400 transition text-sm xl:text-base whitespace-nowrap"
                >
                  Biblioteca
                </Link>
              </li>
              {isAuthenticated && userRole && userRole.toLowerCase() === "admin" && (
                <li>
                  <Link
                    href="/dashboard"
                    className="block py-2 px-2 xl:px-4 text-white text-center uppercase no-underline hover:text-yellow-400 transition text-sm xl:text-base whitespace-nowrap"
                  >
                    Dashboard
                  </Link>
                </li>
              )}
            </ul>
            
            {/* Carrito y Login/Usuario */}
            <ul className="flex flex-row gap-x-1 items-center flex-shrink-0">
              {/* Botón del carrito */}
              <li>
                <Link
                  href="/shoppingCart"
                  className="block py-2 px-2 xl:px-3 text-white hover:text-yellow-400 transition"
                  title="Carrito de compras"
                >
                  <ShoppingCart className="h-6 w-6" />
                </Link>
              </li>
              
              {!isAuthenticated ? (
                <>
                  <li>
                    <Link
                      href="/login"
                      className="block py-2 px-2 xl:px-4 text-white uppercase no-underline hover:text-yellow-400 transition text-sm xl:text-base whitespace-nowrap"
                    >
                      Iniciar Sesión
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/register"
                      className="block py-2 px-2 xl:px-4 text-white uppercase no-underline hover:text-yellow-400 transition text-sm xl:text-base whitespace-nowrap"
                    >
                      Registrar
                    </Link>
                  </li>
                </>
              ) : (
                <li className="relative dropdown-container">
                  <button
                    className="flex items-center py-2 px-2 xl:px-4 text-white uppercase hover:text-yellow-400 transition focus:outline-none text-sm xl:text-base whitespace-nowrap"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <span className="max-w-[180px] xl:max-w-none truncate">
                      {userRole === "admin"
                        ? `Admin - ${userName}`
                        : userNick || userName}
                    </span>
                    <svg className="ml-1 xl:ml-2 h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        {/* Menú colapsable móvil */}
        <div
          className={`overflow-hidden transition-all duration-800 ease-in-out ${menuOpen ? "max-h-[800px]" : "max-h-0"
            } lg:hidden w-full bg-black rounded-b`}
        >
          <ul className="flex flex-col items-center gap-y-1 px-2 py-2 text-center">
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
                href="/games/freeGames"
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
            {/* Botón del carrito en móvil */}
            <li>
              <Link
                href="/shoppingCart"
                className="flex items-center justify-center gap-2 py-2 px-4 text-white uppercase no-underline hover:text-yellow-400 transition"
                onClick={() => setMenuOpen(false)}
              >
                <ShoppingCart className="h-5 w-5" />
                Carrito
              </Link>
            </li>
            {isAuthenticated && userRole?.toLowerCase() === "admin" && (
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
            
            {/* Login/User (Mobile only) */}
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
              <li className="relative w-full flex flex-col items-center dropdown-container">
                <button
                  className="flex items-center justify-center py-2 px-4 text-white uppercase hover:text-yellow-400 transition focus:outline-none w-full"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span className="truncate max-w-[200px]">
                    {userRole === "admin"
                      ? `Admin - ${userName}`
                      : userNick || userName}
                  </span>
                  <svg className="ml-2 h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
