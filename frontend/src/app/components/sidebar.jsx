"use client";

import {
    Squares2X2Icon,
    PuzzlePieceIcon,
    UsersIcon,
    ArrowsRightLeftIcon,
    CurrencyDollarIcon,
    HandRaisedIcon,
    ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar() {
    return (
        <aside className="w-55 min-w-55 max-w-55 bg-black text-white px-1 py-4 h-auto shadow-xl flex flex-col">
            <div className="flex flex-col items-center gap-1 mb-6">
                <span
                    className="flex flex-col items-center gap-1 text-[20px] font-bold text-white px-0 py-2 rounded-lg"
                >
                    <Squares2X2Icon className="h-7 w-7 text-yellow-400" />
                    Admin
                </span>
            </div>
            <nav className="flex-1">
                <ul className="space-y-1">
                    <li>
                        <a
                            href="/dashboard"
                            className="flex flex-col items-center justify-center md:flex-row md:justify-center md:items-center gap-1 md:gap-2 text-white text-[15px] px-0 py-2 rounded-lg hover:bg-[#232323] hover:text-yellow-400 transition"
                        >
                            <ShieldCheckIcon className="h-5 w-5" />
                            <span className="mt-1 md:mt-0 py-2 text-center">
                                Dashboard
                            </span>
                        </a>
                    </li>
                    <li>
                        <a
                            href="/dashboard/games"
                            className="flex flex-col items-center justify-center md:flex-row md:justify-center md:items-center gap-1 md:gap-2 text-white text-[15px] px-0 py-2 rounded-lg hover:bg-[#232323] hover:text-yellow-400 transition"
                        >
                            <PuzzlePieceIcon className="h-5 w-5" />
                            <span className="mt-1 md:mt-0 py-2 text-center">Juegos</span>
                        </a>
                    </li>
                    <li>
                        <a
                            href="/dashboard/users"
                            className="flex flex-col items-center justify-center md:flex-row md:justify-center md:items-center gap-1 md:gap-2 text-white text-[15px] px-0 py-2 rounded-lg hover:bg-[#232323] hover:text-yellow-400 transition"
                        >
                            <UsersIcon className="h-5 w-5" />
                            <span className="mt-1 md:mt-0 py-2 text-center">Usuarios</span>
                        </a>
                    </li>
                    <li>
                        <a
                            href="/dashboard/categories"
                            className="flex flex-col items-center justify-center md:flex-row md:justify-center md:items-center gap-1 md:gap-2 text-white text-[15px] px-0 py-2 rounded-lg hover:bg-[#232323] hover:text-yellow-400 transition"
                        >
                            <Squares2X2Icon className="h-5 w-5" />
                            <span className="mt-1 md:mt-0 py-2 text-center">Categorías</span>
                        </a>
                    </li>
                    <li>
                        <a
                            href="/dashboard/exchanges"
                            className="flex flex-col items-center justify-center md:flex-row md:justify-center md:items-center gap-1 md:gap-2 text-white text-[15px] px-0 py-2 rounded-lg hover:bg-[#232323] hover:text-yellow-400 transition"
                        >
                            <ArrowsRightLeftIcon className="h-5 w-5" />
                            <span className="mt-1 md:mt-0 py-2 text-center">Intercambios</span>
                        </a>
                    </li>
                    <li>
                        <a
                            href="/dashboard/sold"
                            className="flex flex-col items-center justify-center md:flex-row md:justify-center md:items-center gap-1 md:gap-2 text-white text-[15px] px-0 py-2 rounded-lg hover:bg-[#232323] hover:text-yellow-400 transition"
                        >
                            <CurrencyDollarIcon className="h-5 w-5" />
                            <span className="mt-1 md:mt-0 py-2 text-center">Ventas</span>
                        </a>
                    </li>
                    <li>
                        <a
                            href="/dashboard/agreement"
                            className="flex flex-col items-center justify-center md:flex-row md:justify-center md:items-center gap-1 md:gap-2 text-white text-[15px] px-0 py-2 rounded-lg hover:bg-[#232323] hover:text-yellow-400 transition"
                        >
                            <HandRaisedIcon className="h-5 w-5" />
                            <span className="mt-1 md:mt-0 py-2 text-center">Convenios</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}