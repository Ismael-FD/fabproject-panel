"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShoppingCart, MenuSquare,
  Settings, LogOut, Bot, User, Store,
  UtensilsCrossed,
} from "lucide-react";
import { removeToken } from "@/lib/auth";
import { useEffect, useState } from "react";
import { useRestaurante } from "@/lib/RestauranteContext";

const navigation = [
  { name: "Dashboard",     href: "/dashboard",     icon: LayoutDashboard },
  { name: "Pedidos",       href: "/pedidos",       icon: ShoppingCart },
  { name: "Menú",          href: "/menu",          icon: MenuSquare },
  {
    name: "Configuración",
    href: "/configuracion",
    icon: Settings,
    subItems: [
      { name: "General",      href: "/configuracion/general", icon: Store },
      { name: "Asistente IA", href: "/configuracion/ia",      icon: Bot   },
    ],
  },
  { name: "Perfil", href: "/perfil", icon: User },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { restaurante, updateTrigger } = useRestaurante();
  const [botOnline, setBotOnline]     = useState(false);
  const [hovered,   setHovered]       = useState(false);

  useEffect(() => {
    setBotOnline(!!restaurante?.nombre_bot);
  }, [restaurante?.nombre_bot, updateTrigger]);

  const handleLogout = () => {
    removeToken();
    window.location.href = "/login";
  };

  // Expandido si hover en desktop O abierto en mobile
  const expanded = hovered || isOpen;

  const isActive = (href) => {
    if (href === "/configuracion") return pathname.startsWith("/configuracion");
    return pathname === href;
  };

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => onClose?.()}
        />
      )}

      {/* Sidebar */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`
          fixed left-4 top-4 bottom-4 z-50
          flex flex-col
          bg-gradient-to-b from-gray-800 to-gray-900
          rounded-3xl border border-gray-700/80
          shadow-2xl backdrop-blur-sm
          overflow-hidden
          transition-all duration-300 ease-in-out
          ${expanded ? "w-64" : "w-16"}
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center h-20 px-3 border-b border-gray-700 flex-shrink-0 overflow-hidden">
          <div className="flex items-center gap-3">
            {/* Icono restaurante */}
            <div className="w-10 h-10 min-w-[2.5rem] rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg border border-blue-500/20 flex-shrink-0">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            {expanded && (
              <div className="overflow-hidden">
                <span className="text-white font-bold text-base tracking-tight whitespace-nowrap block">
                  {restaurante?.nombre || "FabProject"}
                </span>
                <p className="text-gray-400 text-xs font-medium whitespace-nowrap">Panel de Control</p>
              </div>
            )}
          </div>
        </div>

        {/* Info del bot — solo cuando expandido */}
        {expanded && restaurante && (
          <div className="px-4 py-4 border-b border-gray-700 bg-gradient-to-r from-gray-800/50 to-transparent flex-shrink-0 overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 min-w-[2.25rem] rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                <Bot className="w-4 h-4 text-blue-400" />
              </div>
              <div className="min-w-0 overflow-hidden">
                <p className="text-white text-sm font-semibold truncate">
                  {restaurante.nombre_bot || "Sin nombre"}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${botOnline ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                  <span className={`text-xs font-medium ${botOnline ? "text-green-400" : "text-red-400"}`}>
                    {botOnline ? "Activo" : "Sin conexión"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navegación */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-hidden">
          {expanded && (
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest px-2 mb-3 whitespace-nowrap">
              Navegación
            </p>
          )}

          {navigation.map((item) => {
            const Icon    = item.icon;
            const active  = isActive(item.href);
            const configOpen = item.subItems && pathname.startsWith("/configuracion");

            return (
              <div key={item.name}>
                <Link
                  href={item.href}
                  onClick={() => onClose?.()}
                  title={!expanded ? item.name : undefined}
                  className={`
                    flex items-center h-11 rounded-2xl px-3 gap-3
                    transition-all duration-200 whitespace-nowrap overflow-hidden
                    ${active
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg border border-blue-500/50"
                      : "text-gray-300 hover:text-white hover:bg-gray-700"}
                  `}
                >
                  <Icon className={`h-5 w-5 min-w-[1.25rem] flex-shrink-0 ${active ? "text-white" : "text-gray-400"}`} />
                  {expanded && (
                    <>
                      <span className="text-sm font-semibold flex-1">{item.name}</span>
                      {active && <div className="w-2 h-2 rounded-full bg-white/80 flex-shrink-0" />}
                    </>
                  )}
                </Link>

                {/* Sub-items de Configuración */}
                {expanded && item.subItems && configOpen && (
                  <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-blue-500/40 pl-3">
                    {item.subItems.map((sub) => {
                      const SubIcon   = sub.icon;
                      const subActive = pathname === sub.href;
                      return (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          onClick={() => onClose?.()}
                          className={`
                            flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all
                            ${subActive
                              ? "bg-blue-600/25 text-blue-300 font-medium"
                              : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"}
                          `}
                        >
                          <SubIcon className={`h-4 w-4 flex-shrink-0 ${subActive ? "text-blue-400" : "text-gray-500"}`} />
                          <span>{sub.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="h-px bg-gray-700/50 mx-3 flex-shrink-0" />

        {/* Logout */}
        <div className="px-2 py-3 flex-shrink-0">
          <button
            onClick={handleLogout}
            title={!expanded ? "Cerrar sesión" : undefined}
            className="flex items-center h-11 w-full rounded-2xl px-3 gap-3 text-gray-400 hover:text-red-400 hover:bg-red-900/30 transition-all duration-200 whitespace-nowrap overflow-hidden"
          >
            <LogOut className="h-5 w-5 min-w-[1.25rem] flex-shrink-0" />
            {expanded && <span className="text-sm font-medium">Cerrar sesión</span>}
          </button>
        </div>
      </div>
    </>
  );
}

export { Sidebar };
