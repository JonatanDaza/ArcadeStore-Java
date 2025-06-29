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
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();

    // Define las rutas y el ícono correspondiente
    const links = [
        {
            href: "/dashboard",
            label: "Dashboard",
            icon: <ShieldCheckIcon className="h-5 w-5" />,
            match: (path) => path === "/dashboard",
        },
        {
            href: "/dashboard/games",
            label: "Juegos",
            icon: <PuzzlePieceIcon className="h-5 w-5" />,
            match: (path) => path.startsWith("/dashboard/games"),
        },
        {
            href: "/dashboard/users",
            label: "Usuarios",
            icon: <UsersIcon className="h-5 w-5" />,
            match: (path) => path.startsWith("/dashboard/users"),
        },
        {
            href: "/dashboard/categories",
            label: "Categorías",
            icon: <Squares2X2Icon className="h-5 w-5" />,
            match: (path) => path.startsWith("/dashboard/categories"),
        },
        {
            href: "/dashboard/exchanges",
            label: "Intercambios",
            icon: <ArrowsRightLeftIcon className="h-5 w-5" />,
            match: (path) => path.startsWith("/dashboard/exchanges"),
        },
        {
            href: "/dashboard/sale",
            label: "Ventas",
            icon: <CurrencyDollarIcon className="h-5 w-5" />,
            match: (path) => path.startsWith("/dashboard/sold"),
        },
        {
            href: "/dashboard/agreement",
            label: "Convenios",
            icon: <HandRaisedIcon className="h-5 w-5" />,
            match: (path) => path.startsWith("/dashboard/agreement"),
        },
    ];

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
                    {links.map(link => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                className={`flex flex-col items-center justify-center md:flex-row md:justify-center md:items-center gap-1 md:gap-2 text-white text-[15px] px-0 py-2 rounded-lg transition
                                    ${link.match(pathname)
                                        ? "bg-[#232323] text-yellow-400 font-bold"
                                        : "hover:bg-[#232323] hover:text-yellow-400"
                                    }`}
                            >
                                {link.icon}
                                <span className="mt-1 md:mt-0 py-2 text-center">{link.label}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}