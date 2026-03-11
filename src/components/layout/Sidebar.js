"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShoppingCart, MenuSquare,
  Settings, LogOut, Bot, User, Store,
} from "lucide-react";
import { removeToken } from "@/lib/auth";
import { useEffect, useState } from "react";
import api from "@/lib/api";

const navigation = [
  { name: "Dashboard",     href: "/dashboard",     icon: LayoutDashboard },
  { name: "Pedidos",       href: "/pedidos",       icon: ShoppingCart },
  { name: "Menú",          href: "/menu",          icon: MenuSquare },
  { 
    name: "Configuración", 
    href: "/configuracion", 
    icon: Settings,
    subItems: [
      { name: "General", href: "/configuracion/general", icon: Store },
      { name: "Asistente IA", href: "/configuracion/ia", icon: Bot },
    ]
  },
  { name: "Perfil",        href: "/perfil",        icon: User },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const [restaurante, setRestaurante] = useState(null);
  const [botOnline, setBotOnline] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    api.get("/restaurantes/mi-restaurante")
      .then(r => { setRestaurante(r.data); setBotOnline(true); })
      .catch(() => setBotOnline(false));
  }, []);

  const handleLogout = () => {
    removeToken();
    window.location.href = "/login";
  };

  const initials = restaurante?.nombre
    ? restaurante.nombre.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
    : "FP";

  const isExpanded = isHovered || isOpen;
  // Mobile: hidden when closed, full width when open.
  // Desktop: small (w-20) and expands on hover (w-64).
  const widthClass = isOpen
    ? "w-72 lg:w-64"
    : "w-0 lg:w-20 lg:hover:w-64";

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => onClose?.()}
        />
      )}
      
      <div 
        className={`flex flex-col bg-gradient-to-b from-gray-800 to-gray-900 h-[calc(100vh-2rem)] shadow-2xl transition-all duration-500 ease-in-out fixed left-4 top-4 bottom-4 rounded-3xl border border-gray-700/80 backdrop-blur-sm z-50 overflow-hidden ${
          widthClass
        } ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        data-sidebar-hovered={isHovered}
      >
      {/* Logo */}
      <div className={`px-4 py-6 border-b border-gray-700 flex items-center ${isExpanded ? 'justify-start' : 'justify-center'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg border border-blue-500/20 flex-shrink-0">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          {isExpanded && (
            <div className="overflow-hidden">
              <span className="text-white font-bold text-lg tracking-tight whitespace-nowrap">{restaurante?.nombre || "FaChat"}</span>
              <p className="text-gray-400 text-xs font-medium whitespace-nowrap">Panel de Control</p>
            </div>
          )}
        </div>
      </div>

      {/* Info restaurante */}
      {restaurante && isExpanded && (
        <div className="px-4 py-5 border-b border-gray-700 bg-gradient-to-r from-gray-800/50 to-transparent">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-lg border border-blue-500/30">
              <span className="text-white font-bold text-sm">{initials}</span>
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="text-white text-sm font-semibold truncate">{restaurante.nombre}</p>
              <p className="text-gray-400 text-xs truncate">{restaurante.email}</p>
              <div className="flex items-center gap-2 mt-2">
                {botOnline ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-soft"></div>
                    <span className="text-green-400 text-xs font-medium whitespace-nowrap">Bot activo</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="text-red-400 text-xs font-medium whitespace-nowrap">Sin conexión</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navegación */}
      <nav className="flex-1 px-2 py-6 bg-gradient-to-b from-transparent to-gray-800/30">
        {isExpanded && (
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest px-2 mb-4">Navegación</p>
        )}
        <div className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const isConfigOpen = item.name === "Configuración" && pathname.startsWith("/configuracion");
            const isItemActive = isActive || (item.name === "Configuración" && isConfigOpen);
            const Icon = item.icon;
            
            return (
              <div key={item.name}>
                <Link
                  href={item.href}
                  onClick={() => onClose?.()}
                  className={`flex items-center ${isExpanded ? 'gap-3 px-3' : 'justify-center px-2'} py-3 rounded-2xl text-sm font-semibold transition-all duration-200 group ${
                    isItemActive
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg border border-blue-500/50"
                      : "text-gray-300 hover:text-white hover:bg-gray-700 hover:shadow-md"
                  }`}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 transition-all ${isItemActive ? "text-white drop-shadow-sm" : "text-gray-400 group-hover:text-white"}`} />
                  {isExpanded && (
                    <>
                      <span className={`truncate flex-1 ${isItemActive ? "text-white drop-shadow-sm" : ""}`}>{item.name}</span>
                      {isItemActive && (
                        <div className="ml-auto w-2 h-2 rounded-full bg-white shadow-md"></div>
                      )}
                    </>
                  )}
                </Link>
                
                {/* Sub-items - solo visibles cuando está expandido */}
                {isExpanded && item.subItems && isConfigOpen && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-blue-500/50 pl-4">
                    {item.subItems.map((subItem) => {
                      const isSubActive = pathname === subItem.href;
                      const SubIcon = subItem.icon;
                      return (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          onClick={() => onClose?.()}
                          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all ${
                            isSubActive
                              ? "bg-blue-600/30 text-blue-300 font-medium"
                              : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
                          }`}
                        >
                          <SubIcon className={`h-4 w-4 flex-shrink-0 ${isSubActive ? "text-blue-400" : "text-gray-500"}`} />
                          <span>{subItem.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-gray-700 bg-gradient-to-t from-transparent to-gray-800/50">
        <button
          onClick={handleLogout}
          className={`flex items-center ${isExpanded ? 'gap-3 px-3' : 'justify-center px-2'} w-full py-3 rounded-2xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-900/30 transition-all duration-200 group border border-gray-700/50`}
        >
          <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform flex-shrink-0" />
          {isExpanded && <span>Cerrar sesión</span>}
        </button>
      </div>
    </div>
    </>
  );
}

// Export mobile toggle function for PanelLayout
export { Sidebar };
