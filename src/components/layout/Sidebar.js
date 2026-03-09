"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingCart,
    MenuSquare,
    Settings,
    LogOut,
} from "lucide-react";
import { removeToken } from "@/lib/auth";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Pedidos", href: "/pedidos", icon: ShoppingCart },
    { name: "Menú", href: "/menu", icon: MenuSquare },
    { name: "Configuración", href: "/configuracion", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    const handleLogout = () => {
        removeToken();
        window.location.href = "/login";
    };

    return (
        <div className="flex flex-col w-64 bg-white border-r h-full shadow-sm">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                    FabProject<span className="text-blue-600">.</span>
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {navigation.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${isActive
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                        >
                            <Icon
                                className={`mr-3 h-5 w-5 ${isActive ? "text-blue-700" : "text-gray-400"
                                    }`}
                                aria-hidden="true"
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t">
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                >
                    <LogOut className="mr-3 h-5 w-5 text-red-500" />
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
}