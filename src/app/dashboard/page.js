"use client";

import { useEffect, useState } from "react";
import PanelLayout from "@/components/layout/PanelLayout";
import api from "@/lib/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Area, AreaChart
} from "recharts";
import { TrendingUp, Users, ShoppingBag, DollarSign, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-neutral-200 rounded-2xl px-4 py-3 shadow-apple-lg">
        <p className="text-neutral-500 text-xs mb-1">{label}</p>
        <p className="text-neutral-900 font-semibold text-sm">${payload[0].value?.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [pedidosRecientes, setPedidosRecientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/pedidos/metricas").catch(() => null),
      api.get("/pedidos?limit=5").catch(() => null),
    ]).then(([mRes, pRes]) => {
      if (mRes?.data) {
        setMetrics(mRes.data);
      } else {
        setMetrics({
          ventasHoy: 47800,
          pedidosHoy: 24,
          ticketPromedio: 1991,
          clientesActivos: 87,
          tendencias: { ventas: "+18.4%", pedidos: "+11%", ticket: "+3.2%", clientes: "+22.1%" },
          ventasSemana: [
            { name: "Lun", ventas: 31000 }, { name: "Mar", ventas: 28500 },
            { name: "Mié", ventas: 42000 }, { name: "Jue", ventas: 38000 },
            { name: "Vie", ventas: 55000 }, { name: "Sáb", ventas: 71000 },
            { name: "Dom", ventas: 47800 },
          ],
          pedidosPorHora: [
            { hora: "18h", pedidos: 2 }, { hora: "19h", pedidos: 5 },
            { hora: "20h", pedidos: 9 }, { hora: "21h", pedidos: 11 },
            { hora: "22h", pedidos: 7 }, { hora: "23h", pedidos: 4 },
          ],
        });
      }
      if (pRes?.data) setPedidosRecientes(pRes.data.slice(0, 5));
      else setPedidosRecientes([
        { id: 1, cliente_nombre: "Juan Pérez", total: 5400, estado: "nuevo", creado_en: new Date().toISOString() },
        { id: 2, cliente_nombre: "María Gómez", total: 8900, estado: "en_preparacion", creado_en: new Date(Date.now()-600000).toISOString() },
        { id: 3, cliente_nombre: "Carlos Díaz", total: 3200, estado: "entregado", creado_en: new Date(Date.now()-3600000).toISOString() },
      ]);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <PanelLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-neutral-200 border-t-blue-550 animate-spin"></div>
            <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-b-blue-100 animate-spin animation-delay-150"></div>
          </div>
        </div>
      </PanelLayout>
    );
  }

  const statCards = [
    { name: "Ventas del día",     value: metrics?.ventasHoy ? `$${metrics.ventasHoy.toLocaleString()}` : "$0",       icon: DollarSign, trend: metrics?.tendencias?.ventas || "+12%",  positive: true },
    { name: "Pedidos hoy",        value: metrics?.pedidosHoy || 0,                               icon: ShoppingBag, trend: metrics?.tendencias?.pedidos || "+8%", positive: true },
    { name: "Ticket promedio",    value: metrics?.ticketPromedio ? `$${metrics.ticketPromedio.toLocaleString()}` : "$0",   icon: TrendingUp, trend: metrics?.tendencias?.ticket || "+3%",   positive: true },
    { name: "Clientes activos",   value: metrics?.clientesActivos || 0,                          icon: Users,      trend: metrics?.tendencias?.clientes || "+15%", positive: true },
  ];

  const estadoConfig = {
    nuevo:          { label: "Nuevo",          color: "bg-warning-100 text-warning-700 border border-warning-200" },
    en_preparacion: { label: "En preparación", color: "bg-blue-100 text-blue-700 border border-blue-200" },
    entregado:      { label: "Entregado",      color: "bg-success-100 text-success-700 border border-success-200" },
    cancelado:      { label: "Cancelado",      color: "bg-error-100 text-error-700 border border-error-200" },
  };

  return (
    <PanelLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Dashboard</h1>
        <p className="text-neutral-500 mt-2">
          {new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })} — resumen del día.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-apple hover:shadow-apple-lg transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <span className={`flex items-center gap-1 text-xs font-semibold ${stat.positive ? "text-success-600" : "text-error-600"}`}>
                  {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.trend}
                </span>
              </div>
              <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
              <p className="text-neutral-500 text-sm mt-1">{stat.name}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-3xl p-6 shadow-apple">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-neutral-900">Ventas de la semana</h3>
            <span className="text-sm text-neutral-500">Últimos 7 días</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics?.ventasSemana || []} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="ventas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} tickFormatter={v => `$${v/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="ventas" stroke="#3b82f6" strokeWidth={2} fill="url(#ventas)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-apple">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-neutral-900">Pedidos por hora</h3>
            <Clock className="w-5 h-5 text-neutral-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics?.pedidosPorHora || []} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="hora" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                <Tooltip content={({ active, payload, label }) => active && payload?.length ? (
                  <div className="bg-white border border-neutral-200 rounded-2xl px-4 py-3 shadow-apple-lg">
                    <p className="text-neutral-500 text-xs mb-1">{label}</p>
                    <p className="text-neutral-900 font-semibold text-sm">{payload[0].value} pedidos</p>
                  </div>
                ) : null} />
                <Bar dataKey="pedidos" fill="#3b82f6" radius={[8, 8, 0, 0]} maxBarSize={32} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Pedidos recientes */}
      <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-apple">
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <h3 className="text-lg font-semibold text-neutral-900">Pedidos recientes</h3>
          <a href="/pedidos" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">Ver todos →</a>
        </div>
        <div className="divide-y divide-neutral-100">
          {pedidosRecientes.length === 0 ? (
            <p className="text-center text-neutral-400 text-sm py-12">Sin pedidos recientes</p>
          ) : pedidosRecientes.map((p) => {
            const cfg = estadoConfig[p.estado] || { label: p.estado, color: "bg-neutral-100 text-neutral-600 border border-neutral-200" };
            return (
              <div key={p.id} className="flex items-center justify-between px-6 py-4 hover:bg-neutral-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-600 text-xs font-bold">
                    #{p.id.toString().padStart(3,"0")}
                  </div>
                  <div>
                    <p className="text-neutral-900 text-sm font-medium">{p.cliente_nombre || "Desconocido"}</p>
                    <p className="text-neutral-500 text-xs">{new Date(p.creado_en).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
                  <span className="text-neutral-900 font-semibold text-sm">${p.total?.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PanelLayout>
  );
}
