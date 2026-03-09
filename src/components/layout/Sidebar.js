"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShoppingCart, MenuSquare,
  Settings, LogOut, Bot, Wifi, WifiOff,
} from "lucide-react";
import { removeToken } from "@/lib/auth";
import { useEffect, useState } from "react";
import api from "@/lib/api";

const navigation = [
  { name: "Dashboard",     href: "/dashboard",     icon: LayoutDashboard },
  { name: "Pedidos",       href: "/pedidos",        icon: ShoppingCart },
  { name: "Menú",          href: "/menu",           icon: MenuSquare },
  { name: "Configuración", href: "/configuracion",  icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [restaurante, setRestaurante] = useState(null);
  const [botOnline, setBotOnline] = useState(null);

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

  return (
    <div className="flex flex-col w-72 bg-white border-r border-neutral-200 h-full flex-shrink-0 shadow-apple">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-550 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-apple">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-neutral-900 font-bold text-lg tracking-tight">FabProject</span>
            <p className="text-neutral-500 text-xs font-medium">Panel de Control</p>
          </div>
        </div>
      </div>

      {/* Info restaurante */}
      {restaurante && (
        <div className="px-6 py-5 border-b border-neutral-100 bg-neutral-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0 shadow-inner-apple">
              <span className="text-blue-600 font-bold text-sm">{initials}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-neutral-900 text-sm font-semibold truncate">{restaurante.nombre}</p>
              <p className="text-neutral-500 text-xs truncate">{restaurante.email}</p>
              <div className="flex items-center gap-2 mt-2">
                {botOnline ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse-soft"></div>
                    <span className="text-success-600 text-xs font-medium">Bot activo</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 rounded-full bg-error-500"></div>
                    <span className="text-error-600 text-xs font-medium">Sin conexión</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navegación */}
      <nav className="flex-1 px-4 py-6">
        <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest px-2 mb-4">Navegación</p>
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-600 shadow-apple border border-blue-100"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                }`}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-blue-600" : "text-neutral-400"}`} />
                <span className="truncate">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-neutral-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-medium text-neutral-500 hover:text-error-600 hover:bg-error-50 transition-all duration-200 group"
        >
          <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}
