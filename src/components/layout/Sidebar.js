"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShoppingCart, MenuSquare,
  Settings, LogOut, Bot, User, Store,
  MessageSquare,
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

export default function Sidebar({ isOpen, onClose, pedidosNuevos = 0 }) {
  const pathname = usePathname();
  const { restaurante, updateTrigger } = useRestaurante();
  const [botOnline, setBotOnline] = useState(false);
  const [hovered,   setHovered]   = useState(false);

  useEffect(() => {
    setBotOnline(!!restaurante?.nombre_bot);
  }, [restaurante?.nombre_bot, updateTrigger]);

  const handleLogout = () => {
    removeToken();
    window.location.href = "/login";
  };

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
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => onClose?.()}
        />
      )}

      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`
          fixed top-4 bottom-4 z-50 left-4
          flex flex-col bg-gray-900
          rounded-3xl border border-gray-700/60 shadow-lg overflow-hidden
          transition-all duration-300 ease-in-out
          ${expanded ? "w-64" : "w-16"}
          ${isOpen ? "translate-x-0" : "-translate-x-[calc(100%+2rem)] lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center h-20 px-3 border-b border-gray-700 flex-shrink-0 overflow-hidden">
          <div className="w-10 h-10 min-w-[2.5rem] rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg flex-shrink-0">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          {expanded && (
            <div className="ml-3 overflow-hidden">
              <span className="text-white font-bold text-base tracking-tight whitespace-nowrap block">
                {restaurante?.nombre || "FaChat"}
              </span>
              <p className="text-blue-400 text-xs font-semibold whitespace-nowrap">Panel</p>
            </div>
          )}
        </div>

        {/* Info bot */}
        {expanded && restaurante && (
          <div className="px-4 py-4 border-b border-gray-700 bg-gray-800/40 flex-shrink-0 overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 min-w-[2.25rem] rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                <Bot className="w-4 h-4 text-blue-400" />
              </div>
              <div className="min-w-0 overflow-hidden">
                <p className="text-white text-sm font-semibold truncate">{restaurante.nombre_bot || "Sin nombre"}</p>
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

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-hidden">
          {expanded && (
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest px-2 mb-3 whitespace-nowrap">
              Navegación
            </p>
          )}
          {navigation.map((item) => {
            const Icon      = item.icon;
            const active    = isActive(item.href);
            const configOpen = item.subItems && pathname.startsWith("/configuracion");
            const isPedidos  = item.href === "/pedidos";

            return (
              <div key={item.name}>
                <Link
                  href={item.href}
                  onClick={() => onClose?.()}
                  title={!expanded ? item.name : undefined}
                  className={`
                    flex items-center h-11 rounded-2xl px-3 gap-3 relative
                    transition-colors duration-150 whitespace-nowrap overflow-hidden
                    ${active ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-white/10"}
                  `}
                >
                  <Icon className={`h-5 w-5 min-w-[1.25rem] flex-shrink-0 ${active ? "text-white" : "text-gray-400"}`} />
                  {expanded && (
                    <>
                      <span className="text-sm font-semibold flex-1">{item.name}</span>
                      {active && <div className="w-2 h-2 rounded-full bg-white/80 flex-shrink-0" />}
                    </>
                  )}
                  {/* Badge pedidos nuevos */}
                  {isPedidos && pedidosNuevos > 0 && (
                    <span className={`
                      absolute flex items-center justify-center
                      bg-red-500 text-white text-[10px] font-bold rounded-full
                      animate-bounce
                      ${expanded ? "right-3 top-2 w-5 h-5" : "right-1 top-1 w-4 h-4"}
                    `}>
                      {pedidosNuevos > 9 ? "9+" : pedidosNuevos}
                    </span>
                  )}
                </Link>

                {expanded && item.subItems && configOpen && (
                  <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-blue-500/40 pl-3">
                    {item.subItems.map((sub) => {
                      const SubIcon   = sub.icon;
                      const subActive = pathname === sub.href;
                      return (
                        <Link key={sub.name} href={sub.href} onClick={() => onClose?.()}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors duration-150 ${
                            subActive ? "bg-blue-600/25 text-blue-300 font-medium" : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
                          }`}>
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

        <div className="h-px bg-gray-700/50 mx-3 flex-shrink-0" />
        <div className="px-2 py-3 flex-shrink-0">
          <button onClick={handleLogout} title={!expanded ? "Cerrar sesión" : undefined}
            className="flex items-center h-11 w-full rounded-2xl px-3 gap-3 text-gray-400 hover:text-red-300 hover:bg-red-600/20 transition-colors duration-150 whitespace-nowrap overflow-hidden">
            <LogOut className="h-5 w-5 min-w-[1.25rem] flex-shrink-0" />
            {expanded && <span className="text-sm font-medium">Cerrar sesión</span>}
          </button>
        </div>
      </div>
    </>
  );
}

export { Sidebar };
