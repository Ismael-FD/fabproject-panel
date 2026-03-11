"use client";

import { useEffect, useState } from "react";
import PanelLayout from "@/components/layout/PanelLayout";
import { Store, Bot, ArrowRight } from "lucide-react";
import Link from "next/link";

function Section({ icon: Icon, title, description, href, accent = false }) {
  return (
    <Link href={href} className="block">
      <div className="bg-gray-800 border border-gray-700 rounded-3xl overflow-hidden shadow-apple hover:shadow-apple-lg transition-all duration-300 hover:scale-[1.02] group">
        <div className="px-6 py-5 border-b border-gray-700 bg-gray-800/50 flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${accent ? "bg-blue-500/20" : "bg-gray-700"}`}>
            <Icon className={`w-6 h-6 ${accent ? "text-blue-400" : "text-gray-400"}`} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white">{title}</h2>
            <p className="text-sm text-gray-400 mt-1">{description}</p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
        </div>
      </div>
    </Link>
  );
}

export default function ConfiguracionPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return (
      <PanelLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-gray-700 border-t-blue-500 animate-spin"></div>
            <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-b-blue-500 animate-spin animation-delay-150"></div>
          </div>
        </div>
      </PanelLayout>
    );
  }

  return (
    <PanelLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Configuración</h1>
        <p className="text-gray-400 mt-2">Administra las preferencias y configuraciones de tu negocio.</p>
      </div>

      <div className="max-w-4xl space-y-6">
        <Section 
          icon={Store} 
          title="Configuración General" 
          description="Datos del local, horarios, delivery y medios de pago"
          href="/configuracion/general"
        />
        
        <Section 
          icon={Bot} 
          title="Asistente IA" 
          description="Personalidad, tono y comportamiento del bot de WhatsApp"
          href="/configuracion/ia"
          accent
        />
      </div>
    </PanelLayout>
  );
}
