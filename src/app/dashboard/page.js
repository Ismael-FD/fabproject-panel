"use client";

import { useEffect, useState } from "react";
import PanelLayout from "@/components/layout/PanelLayout";
import api from "@/lib/api";
import { getToken } from "@/lib/auth";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart, PieChart, Pie, Cell
} from "recharts";
import { TrendingUp, ShoppingBag, ArrowUpRight, ArrowDownRight, Clock, Package } from "lucide-react";
import { Skeleton, SkeletonStatCard, SkeletonChart, SkeletonListItem } from "@/components/ui/Skeleton";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 shadow-apple-lg">
        <p className="text-gray-400 text-xs mb-1">{label}</p>
        <p className="text-white font-semibold text-sm">{payload[0].value?.toLocaleString()} pedidos</p>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [pedidosRecientes, setPedidosRecientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiBaseUrl = api.defaults.baseURL || "(sin base URL)";

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      const token = getToken();
      if (!token) {
        setError("No se encontró token de autenticación. Iniciá sesión nuevamente.");
        setLoading(false);
        return;
      }

      try {
        const [mRes, pRes] = await Promise.all([
          api.get("/pedidos/metricas"),
          api.get("/pedidos?limit=20"),
        ]);

        if (mRes?.data) {
          const data = mRes.data;

          // Map API response to expected UI fields
          const pedidosPorDiaRaw = data.pedidos_por_dia || [];
          const pedidosPorDiaGrouped = Object.values(pedidosPorDiaRaw.reduce((acc, item) => {
            const day = new Date(item.creado_en).toLocaleDateString("es-AR", { weekday: "short" });
            acc[day] = acc[day] || { name: day, pedidos: 0 };
            acc[day].pedidos += 1;
            return acc;
          }, {}));

          // Trend: comparar pedidos de hoy vs ayer (usando timestamps de pedidos_por_dia)
          const countByDate = pedidosPorDiaRaw.reduce((acc, item) => {
            const dateKey = new Date(item.creado_en).toISOString().slice(0, 10);
            acc[dateKey] = (acc[dateKey] || 0) + 1;
            return acc;
          }, {});

          const todayKey = new Date().toISOString().slice(0, 10);
          const yesterdayKey = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
          const pedidosHoyCalc = countByDate[todayKey] || 0;
          const pedidosAyerCalc = countByDate[yesterdayKey] || 0;

          const trendDiff = pedidosAyerCalc ? pedidosHoyCalc - pedidosAyerCalc : 0;
          const todayTrendPercent = pedidosAyerCalc ? Math.round((trendDiff / pedidosAyerCalc) * 100) : null;
          const todayTrendText = todayTrendPercent === null
            ? "N/A"
            : `${todayTrendPercent >= 0 ? "+" : ""}${todayTrendPercent}%`;
          const todayTrendPositive = todayTrendPercent === null ? true : todayTrendPercent >= 0;

          // Trend mensual: comparar pedidos del mes actual vs mes anterior (basado en timestamps)
          const countByMonth = pedidosPorDiaRaw.reduce((acc, item) => {
            const date = new Date(item.creado_en);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
          }, {});

          const currentMonthKey = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
          const prevMonthDate = new Date();
          prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
          const prevMonthKey = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, "0")}`;

          const pedidosMesCalc = countByMonth[currentMonthKey] || 0;
          const pedidosPrevMesCalc = countByMonth[prevMonthKey] || 0;

          const monthTrendDiff = pedidosPrevMesCalc ? pedidosMesCalc - pedidosPrevMesCalc : 0;
          const monthTrendPercent = pedidosPrevMesCalc ? Math.round((monthTrendDiff / pedidosPrevMesCalc) * 100) : null;
          const monthTrendText = monthTrendPercent === null
            ? "N/A"
            : `${monthTrendPercent >= 0 ? "+" : ""}${monthTrendPercent}%`;
          const monthTrendPositive = monthTrendPercent === null ? true : monthTrendPercent >= 0;

          // Distribución por método de pago (viene de backend en por_metodo_pago)
          const metodoPago = (data.por_metodo_pago || []).map((item, index) => {
            const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6"];
            return {
              name: item.metodo_pago || "Desconocido",
              value: item._count ?? item.count ?? 0,
              color: colors[index % colors.length],
            };
          });

          // Pedidos por hora: agrupamos en base al timestamp del pedido
          const pedidosPorHora = Object.values(pedidosPorDiaRaw.reduce((acc, item) => {
            const date = new Date(item.creado_en);
            if (Number.isNaN(date)) return acc;
            const hour = date.getHours();
            const label = `${hour.toString().padStart(2, "0")}:00`;
            acc[hour] = acc[hour] || { hora: label, pedidos: 0 };
            acc[hour].pedidos += 1;
            return acc;
          }, {})).sort((a, b) => a.hora.localeCompare(b.hora));

          setMetrics({
            pedidosHoy: data.pedidos_hoy || 0,
            pedidosMes: data.pedidos_mes || 0,
            delivery: data.delivery || 0,
            retiro: data.retiro || 0,
            pedidosPorDia: pedidosPorDiaGrouped,
            pedidosPorDiaRaw,
            pedidosHoyTrendText: todayTrendText,
            pedidosHoyTrendPositive: todayTrendPositive,
            pedidosMesTrendText: monthTrendText,
            pedidosMesTrendPositive: monthTrendPositive,
            distribucionMetodosPago: metodoPago,
            pedidosPorHora,
          });
        }

        if (pRes?.data) setPedidosRecientes(pRes.data.slice(0, 5));
      } catch (err) {
        console.error("Error cargando métricas", err);
        setError(`No se pudieron cargar las métricas desde ${apiBaseUrl}/pedidos/metricas. Verificá que el backend esté corriendo y que NEXT_PUBLIC_API_URL apunte al host correcto.`);

        // Datos de ejemplo para que la UI no se quede vacía
        setMetrics({
          ventasHoy: 47800,
          pedidosHoy: 24,
          ticketPromedio: 1991,
          clientesActivos: 87,
          productoMasPedido: "Hamburguesa Clásica",
          tasaCancelacion: 8.3,
          pedidosPendientes: 6,
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
          distribucionEstados: [
            { name: "Nuevos", value: 6, color: "#f59e0b" },
            { name: "En preparación", value: 8, color: "#8b5cf6" },
            { name: "Listos", value: 4, color: "#22c55e" },
            { name: "Entregados", value: 12, color: "#10b981" },
            { name: "Cancelados", value: 2, color: "#ef4444" },
          ],
        });

        setPedidosRecientes([
          { id: 1, cliente_nombre: "Juan Pérez", total: 5400, estado: "nuevo", creado_en: new Date().toISOString() },
          { id: 2, cliente_nombre: "María Gómez", total: 8900, estado: "en_preparacion", creado_en: new Date(Date.now() - 600000).toISOString() },
          { id: 3, cliente_nombre: "Carlos Díaz", total: 3200, estado: "entregado", creado_en: new Date(Date.now() - 3600000).toISOString() },
        ]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [apiBaseUrl]);

  if (loading) {
    return (
      <PanelLayout>
        <div className="mb-8">
          <Skeleton className="w-48 h-8 rounded-lg mb-2" />
          <Skeleton className="w-64 h-4 rounded-lg" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8">
          <SkeletonChart />
          <SkeletonChart />
        </div>
        
        <SkeletonChart />
        
        <div className="bg-gray-800 border border-gray-700 rounded-3xl overflow-hidden shadow-apple mt-8">
          <div className="px-6 py-5 border-b border-gray-700 bg-gray-800/50">
            <Skeleton className="w-32 h-6 rounded-lg" />
          </div>
          <div className="divide-y divide-gray-700">
            <SkeletonListItem />
            <SkeletonListItem />
            <SkeletonListItem />
          </div>
        </div>
      </PanelLayout>
    );
  }

  const pedidosMesTotal = metrics?.pedidosMes || 0;
  const deliverySharePercent = pedidosMesTotal ? Math.round(((metrics?.delivery || 0) / pedidosMesTotal) * 100) : null;
  const retiroSharePercent = pedidosMesTotal ? Math.round(((metrics?.retiro || 0) / pedidosMesTotal) * 100) : null;

  const statCards = [
    {
      name: "Valoración general",
      value: metrics?.pedidosMes ? `${metrics.pedidosMesTrendText}` : "—",
      icon: TrendingUp,
      description: "Progreso general del negocio vs mes anterior",
      // Ya muestra su propia métrica en el valor, no necesita badge de porcentaje.
    },
    {
      name: "Pedidos hoy",
      value: metrics?.pedidosHoy || 0,
      icon: ShoppingBag,
      description: "Pedidos recibidos en las últimas 24 horas",
      trendText: metrics?.pedidosHoyTrendText || "—",
      trendTooltip: "Cambio % respecto a ayer",
      positive: metrics?.pedidosHoyTrendPositive ?? true,
    },
    {
      name: "Pedidos mes",
      value: metrics?.pedidosMes || 0,
      icon: ShoppingBag,
      description: "Pedidos registrados en el mes actual",
      trendText: metrics?.pedidosMesTrendText || "—",
      trendTooltip: "Cambio % respecto al mes anterior",
      positive: metrics?.pedidosMesTrendPositive ?? true,
    },
    {
      name: "Delivery",
      value: metrics?.delivery || 0,
      icon: Package,
      description: "Pedidos con entrega a domicilio",
      trendText: deliverySharePercent !== null ? `${deliverySharePercent}%` : "—",
      trendTooltip: "% de pedidos del mes que son delivery",
      positive: true,
    },
    {
      name: "Retiro",
      value: metrics?.retiro || 0,
      icon: Clock,
      description: "Pedidos retirados por el cliente",
      trendText: retiroSharePercent !== null ? `${retiroSharePercent}%` : "—",
      trendTooltip: "% de pedidos del mes que son retiro",
      positive: true,
    },
  ];


  const metodosPago = metrics?.distribucionMetodosPago || [];
  const totalMetodosPago = metodosPago.reduce((sum, item) => sum + (item.value || 0), 0);

  const pedidosPorHora = metrics?.pedidosPorHora || [];
  const totalPedidosPorHora = pedidosPorHora.reduce((sum, item) => sum + (item.pedidos || 0), 0);

  const estadoConfig = {
    nuevo:          { label: "Nuevo",          color: "bg-warning-100 text-warning-700 border border-warning-200" },
    en_preparacion: { label: "En preparación", color: "bg-blue-100 text-blue-700 border border-blue-200" },
    entregado:      { label: "Entregado",      color: "bg-success-100 text-success-700 border border-success-200" },
    cancelado:      { label: "Cancelado",      color: "bg-error-100 text-error-700 border border-error-200" },
  };

  return (
    <PanelLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-gray-400 mt-2">
          {new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })} — resumen del día.
        </p>
        {error && (
          <div className="mt-4 rounded-2xl bg-red-900/60 border border-red-700 px-4 py-3 text-sm text-red-100">
            <strong className="font-semibold">Error:</strong> {error}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const cardClass = stat.isPrimary ? "lg:col-span-2" : "";
          return (
            <div
              key={stat.name}
              className={`bg-gray-800 border border-gray-700 rounded-3xl p-6 shadow-apple hover:shadow-apple-lg transition-all duration-300 hover:scale-[1.02] ${cardClass}`}
            >
              <div className="flex items-start justify-between mb-4 gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{stat.name}</span>
                    {stat.trendText && (
                      <span
                        title={stat.trendTooltip}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${stat.positive ? "bg-green-500/15 text-green-300" : "bg-red-500/15 text-red-300"}`}
                      >
                        {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {stat.trendText}
                      </span>
                    )}
                  </div>
                  {stat.description && (
                    <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
                  )}
                  <p className="text-3xl font-bold text-white mt-4">{stat.value}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>


      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 border border-gray-700 rounded-3xl p-6 shadow-apple">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Ventas de la semana</h3>
            <span className="text-sm text-gray-400">Últimos 7 días</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics?.pedidosPorDia || []} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="ventas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="pedidos" stroke="#3b82f6" strokeWidth={2} fill="url(#ventas)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-3xl p-6 shadow-apple">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Distribución de pedidos</h3>
              <p className="text-sm text-gray-400">Por método de pago</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Total</p>
              <p className="text-xl font-semibold text-white">{totalMetodosPago.toLocaleString()}</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metodosPago}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={82}
                  paddingAngle={6}
                  dataKey="value"
                >
                  {metodosPago.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const item = payload[0];
                  const percent = totalMetodosPago ? ((item.value / totalMetodosPago) * 100).toFixed(0) : 0;
                  return (
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 shadow-apple-lg">
                      <p className="text-gray-400 text-xs mb-1">{item.name}</p>
                      <p className="text-white font-semibold text-sm">{item.value} pedidos</p>
                      <p className="text-gray-400 text-xs">{percent}% del total</p>
                    </div>
                  );
                }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {metodosPago.map((item) => {
              const percent = totalMetodosPago ? ((item.value / totalMetodosPago) * 100).toFixed(0) : 0;
              return (
                <div key={item.name} className="flex items-center justify-between rounded-2xl border border-gray-700 bg-gray-900/60 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <div>
                      <p className="text-sm font-medium text-white">{item.name}</p>
                      <p className="text-xs text-gray-400">{percent}% del total</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-white">{item.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
        <div className="bg-gray-800 border border-gray-700 rounded-3xl p-6 shadow-apple">
          <div className="flex items-start justify-between mb-6 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Pedidos por hora</h3>
              <p className="text-sm text-gray-400">Tendencia de pedidos por franja horaria</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Total</p>
              <p className="text-xl font-semibold text-white">{totalPedidosPorHora.toLocaleString()}</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer
              width="100%"
              height="100%"
              className="bg-transparent"
              wrapperStyle={{ backgroundColor: "transparent" }}
            >
              <BarChart
                data={pedidosPorHora}
                margin={{ top: 8, right: 8, left: -24, bottom: 0 }}
                barCategoryGap="10%"
                barGap={1}
                maxBarSize={64}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                <XAxis dataKey="hora" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  content={({ active, payload, label }) => active && payload?.length ? (
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 shadow-apple-lg">
                      <p className="text-gray-400 text-xs mb-1">{label}</p>
                      <p className="text-white font-semibold text-sm">{payload[0].value} pedidos</p>
                    </div>
                  ) : null}
                />
                <Bar
                  dataKey="pedidos"
                  barSize={60}
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                  opacity={0.92}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {pedidosPorHora.slice(0, 6).map((item) => (
              <div key={item.hora} className="flex items-center justify-between rounded-2xl border border-gray-700 bg-gray-900/60 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-white">{item.hora}</p>
                  <p className="text-xs text-gray-400">{item.pedidos} pedidos</p>
                </div>
                <div className="text-xs font-semibold text-gray-200">{Math.round((item.pedidos / (totalPedidosPorHora || 1)) * 100)}%</div>
              </div>
            ))}
            {pedidosPorHora.length > 6 && (
              <div className="col-span-2 rounded-2xl border border-gray-700 bg-gray-900/60 px-4 py-3 text-sm text-gray-300">
                Muestra las primeras 6 horas. Hasta {pedidosPorHora.length} franjas disponibles.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pedidos recientes */}
      <div className="bg-gray-800 border border-gray-700 rounded-3xl overflow-hidden shadow-apple">
        <div className="px-6 py-5 border-b border-gray-700 flex items-center justify-between bg-gray-800/50">
          <h3 className="text-lg font-semibold text-white">Pedidos recientes</h3>
          <a href="/pedidos" className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">Ver todos →</a>
        </div>
        <div className="divide-y divide-gray-700">
          {pedidosRecientes.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-12">Sin pedidos recientes</p>
          ) : pedidosRecientes.map((p) => {
            const cfg = estadoConfig[p.estado] || { label: p.estado, color: "bg-gray-700 text-gray-300 border border-gray-600" };
            return (
              <div key={p.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-gray-700 flex items-center justify-center text-gray-300 text-xs font-bold">
                    #{p.id.toString().padStart(3,"0")}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{p.cliente_nombre || "Desconocido"}</p>
                    <p className="text-gray-400 text-xs">{new Date(p.creado_en).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
                  <span className="text-white font-semibold text-sm">${p.total?.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PanelLayout>
  );
}
