// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// export default function Header() {
//   const [isAuthenticated, setIsAuthenticated] = useState(true);
//   const [userRole] = useState("admin");
//   const [userName] = useState("Jonatan");
//   const [userNick] = useState("JDaza");
//   const userId = 123;
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const router = useRouter();

//   const handleLogout = () => {
//     setIsAuthenticated(false);
//     router.push("/login");
//   };

//   return (
//     <header className="bg-gray-900 text-white shadow">
//       <div className="max-w-7xl mx-auto px-4">
//         <nav className="flex items-center justify-between flex-wrap py-4">
//           <Link href="/" className="flex items-center gap-2">
//             <img src="/logo.png" alt="Logo Arcade Store" className="h-10" />
//             <span className="font-bold text-xl tracking-wide">ARCADE STORE</span>
//           </Link>
//           <button
//             className="md:hidden ml-2 p-2 rounded hover:bg-gray-800"
//             onClick={() => setMenuOpen(!menuOpen)}
//             aria-label="Abrir menú"
//           >
//             <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//             </svg>
//           </button>
//           <div className={`w-full md:flex md:items-center md:w-auto ${menuOpen ? "block" : "hidden"}`}>
//             <ul className="flex flex-col md:flex-row md:space-x-6 mt-4 md:mt-0 md:ml-8">
//               <li>
//                 <Link href="/home" className="block py-2 px-4 hover:text-yellow-400">Inicio</Link>
//               </li>
//               <li>
//                 <Link href="/games" className="block py-2 px-4 hover:text-yellow-400">Juegos</Link>
//               </li>
//               <li>
//                 <Link href="/freeGames" className="block py-2 px-4 hover:text-yellow-400">Free to play</Link>
//               </li>
//               <li>
//                 <Link href="/contact" className="block py-2 px-4 hover:text-yellow-400">Contáctenos</Link>
//               </li>
//               {isAuthenticated && userRole === "admin" && (
//                 <li>
//                   <Link href="/dashboard" className="block py-2 px-4 hover:text-yellow-400">Dashboard</Link>
//                 </li>
//               )}
//             </ul>
//             <ul className="flex flex-col md:flex-row md:space-x-4 md:ml-auto mt-4 md:mt-0">
//               {!isAuthenticated ? (
//                 <>
//                   <li>
//                     <Link href="/login" className="block py-2 px-4 hover:text-yellow-400">Iniciar Sesión</Link>
//                   </li>
//                   <li>
//                     <Link href="/register" className="block py-2 px-4 hover:text-yellow-400">Registrar</Link>
//                   </li>
//                 </>
//               ) : (
//                 <li className="relative">
//                   <button
//                     className="flex items-center py-2 px-4 hover:text-yellow-400 focus:outline-none"
//                     onClick={() => setDropdownOpen(!dropdownOpen)}
//                   >
//                     {userRole === "admin"
//                       ? `Administrador - ${userName || userNick}`
//                       : userNick || userName}
//                     <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </button>
//                   {dropdownOpen && (
//                     <ul className="absolute right-0 mt-2 w-40 bg-white text-gray-900 rounded shadow-lg z-50">
//                       <li>
//                         <Link
//                           href={`/profile/${userId}`}
//                           className="block px-4 py-2 hover:bg-gray-100"
//                           onClick={() => setDropdownOpen(false)}
//                         >
//                           Mi perfil
//                         </Link>
//                       </li>
//                       <li>
//                         <button
//                           className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//                           onClick={() => {
//                             setDropdownOpen(false);
//                             handleLogout();
//                           }}
//                           type="button"
//                         >
//                           Cerrar Sesión
//                         </button>
//                       </li>
//                     </ul>
//                   )}
//                 </li>
//               )}
//             </ul>
//           </div>
//         </nav>
//       </div>
//     </header>
//   );
// }

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
    <header className="bg-black text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex items-center justify-between py-4">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo Arcade Store" className="w-5 mb-2" />
            <span className="font-bold text-xl tracking-wide">ARCADE STORE</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden ml-2 p-2 rounded-lg hover:bg-gray-800 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Navigation Menu */}
          <div className={`w-full lg:flex lg:items-center lg:w-auto ${menuOpen ? "block" : "hidden"}`}>
            <ul className="flex flex-col lg:flex-row lg:space-x-8 mt-4 lg:mt-0 lg:ml-12">
              <li>
                <Link 
                  href="/home" 
                  className="block py-3 px-4 lg:py-2 text-[#fff] hover:text-white transition-colors duration-200 font-medium tracking-wide uppercase text-sm"
                >
                  INICIO
                </Link>
              </li>
              <li>
                <Link 
                  href="/games" 
                  className="block py-3 px-4 lg:py-2 text-[#fff] hover:text-white transition-colors duration-200 font-medium tracking-wide uppercase text-sm"
                >
                  JUEGOS
                </Link>
              </li>
              <li>
                <Link 
                  href="/freeGames" 
                  className="block py-3 px-4 lg:py-2 text-[#fff] hover:text-white transition-colors duration-200 font-medium tracking-wide uppercase text-sm"
                >
                  FREE TO PLAY
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="block py-3 px-4 lg:py-2 text-[#fff] hover:text-white transition-colors duration-200 font-medium tracking-wide uppercase text-sm"
                >
                  CONTÁCTENOS
                </Link>
              </li>
              {isAuthenticated && userRole === "admin" && (
                <li>
                  <Link 
                    href="/dashboard" 
                    className="block py-3 px-4 lg:py-2 text-[#fff] hover:text-white transition-colors duration-200 font-medium tracking-wide uppercase text-sm"
                  >
                    DASHBOARD
                  </Link>
                </li>
              )}
            </ul>

            {/* Auth Section */}
            <ul className="flex flex-col md:flex-row md:space-x-4 md:ml-auto mt-4 md:mt-0">
              {!isAuthenticated ? (
                <>
                  <li>
                    <Link href="/login" className="block py-2 px-4">Iniciar Sesión</Link>
                  </li>
                  <li>
                    <Link href="/register" className="block py-2 px-4">Registrar</Link>
                  </li>
                </>
              ) : (
                <li className="relative">
                  <button
                    className="flex items-center py-2 px-4 focus:outline-none"
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
      </div>
    </header>
  );
}