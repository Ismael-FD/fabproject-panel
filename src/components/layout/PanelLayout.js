"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import Sidebar from "./Sidebar";
import { Skeleton } from "@/components/ui/Skeleton";
import { Menu } from "lucide-react";

export default function PanelLayout({ children, pedidosNuevos = 0 }) {
  const router = useRouter();
  const [isAuth,         setIsAuth]         = useState(false);
  const [mounted,        setMounted]        = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const authStatus = isAuthenticated();
    setIsAuth(authStatus);
    setMounted(true);
    if (!authStatus) router.push("/login");
  }, [router]);

  if (!mounted || !isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-2xl" />
            <Skeleton className="w-48 h-8 rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
          </div>
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        pedidosNuevos={pedidosNuevos}
      />

      {/* Botón hamburguesa mobile — visible solo cuando sidebar cerrado */}
      {!mobileMenuOpen && (
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-gray-800 border border-gray-700 rounded-2xl text-gray-300 hover:text-white hover:bg-gray-700 transition-all shadow-lg"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      <main className="flex-1 overflow-y-auto lg:ml-24 transition-all duration-300">
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
          {/* Padding top en mobile para no tapar el botón hamburguesa */}
          <div className="pt-14 lg:pt-0">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
