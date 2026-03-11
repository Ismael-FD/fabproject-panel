"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import PanelLayout from "@/components/layout/PanelLayout";
import api from "@/lib/api";
import {
  Search,
  Eye,
  RotateCw,
  ShoppingBag,
  X,
  MapPin,
  Phone,
  CreditCard,
} from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

const ESTADOS = ["nuevo", "confirmado", "en_preparacion", "listo", "entregado", "cancelado"];

const ESTADO_CONFIG = {
  nuevo:          { label: "Nuevo",          color: "bg-warning-100 text-warning-700 border-warning-200",       dot: "bg-warning-500" },
  confirmado:     { label: "Confirmado",     color: "bg-blue-100 text-blue-700 border-blue-200",          dot: "bg-blue-500" },
  en_preparacion: { label: "En preparación", color: "bg-purple-100 text-purple-700 border-purple-200",    dot: "bg-purple-500" },
  listo:          { label: "Listo",          color: "bg-success-100 text-success-700 border-success-200",       dot: "bg-success-500" },
  entregado:      { label: "Entregado",      color: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  cancelado:      { label: "Cancelado",      color: "bg-error-100 text-error-700 border-error-200",             dot: "bg-error-500" }
};

function StatusBadge({ estado }) {
  const cfg = ESTADO_CONFIG[estado] || { label: estado, color: "bg-gray-700 text-gray-300 border-gray-600", dot: "bg-gray-500" };
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${cfg.color}`}>
      <span className={`w-2 h-2 rounded-full ${cfg.dot} animate-pulse-soft`} />
      {cfg.label}
    </span>
  );
}

function DetallePedido({ pedido, onClose, onEstadoChange }) {
  if (!pedido) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-800 rounded-3xl shadow-apple-xl w-full max-w-lg p-8 z-10 animate-scale-in border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Pedido #{pedido.id.toString().padStart(4, "0")}</h2>
            <p className="text-sm text-gray-400 mt-1">{new Date(pedido.creado_en).toLocaleString("es-AR")}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-2xl transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="space-y-6">
          <div className="bg-gray-700/50 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-5 h-5 text-gray-400" />
              <span className="font-medium text-white">{pedido.cliente_nombre || "Sin nombre"}</span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-400">{pedido.cliente_telefono}</span>
            </div>
            {pedido.direccion && (
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400">{pedido.direccion}</span>
              </div>
            )}
            {pedido.metodo_pago && (
              <div className="flex items-center gap-3 text-sm">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400">{pedido.metodo_pago}</span>
              </div>
            )}
          </div>
          <div className="bg-gray-700/50 rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">Detalle</p>
            <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{pedido.detalle}</p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-2">Cambiar estado</p>
              <select
                value={pedido.estado}
                onChange={(e) => onEstadoChange(pedido.id, e.target.value)}
                className="border border-gray-700 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-800 text-white transition-all"
              >
                {ESTADOS.map(e => (
                  <option key={e} value={e}>{ESTADO_CONFIG[e]?.label || e}</option>
                ))}
              </select>
            </div>
            {pedido.total && (
              <div className="text-right">
                <p className="text-sm text-gray-400 mb-1">Total</p>
                <p className="text-2xl font-bold text-white">${pedido.total.toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);
  const [toast, setToast] = useState(null);
  const pedidosAnterioresRef = useRef(0);

  const fetchPedidos = useCallback(async (silencioso = false) => {
    if (!silencioso) setLoading(true);
    try {
      const response = await api.get("/pedidos?limit=100");
      const nuevosPedidos = response.data;
      
      // Detectar pedidos nuevos para notificación
      if (!silencioso && nuevosPedidos.length > pedidosAnterioresRef.current) {
        const cantidadNuevos = nuevosPedidos.length - pedidosAnterioresRef.current;
        mostrarToast(`🔔 ${cantidadNuevos} pedido${cantidadNuevos > 1 ? 's' : ''} recibido${cantidadNuevos > 1 ? 's' : ''}`);
      }
      
      setPedidos(nuevosPedidos);
      setUltimaActualizacion(new Date());
      pedidosAnterioresRef.current = nuevosPedidos.length;
    } catch (err) {
      console.error("Error fetching pedidos", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPedidos();
    const interval = setInterval(() => fetchPedidos(true), 30000);
    return () => clearInterval(interval);
  }, [fetchPedidos]);

  const mostrarToast = (mensaje) => {
    setToast(mensaje);
    setTimeout(() => setToast(null), 4000);
  };

  const actualizarEstado = async (id, estado) => {
    try {
      await api.put(`/pedidos/${id}/estado`, { estado });
      setPedidos(prev => prev.map(p => p.id === id ? { ...p, estado } : p));
      if (pedidoSeleccionado?.id === id) {
        setPedidoSeleccionado(prev => ({ ...prev, estado }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const conteosPorEstado = pedidos.reduce((acc, p) => {
    acc[p.estado] = (acc[p.estado] || 0) + 1;
    return acc;
  }, {});

  const pedidosFiltrados = pedidos.filter(p => {
    const coincideFiltro = filtro === "todos" || p.estado === filtro;
    const coincideBusqueda = !busqueda ||
      p.cliente_nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.cliente_telefono?.includes(busqueda) ||
      p.id.toString().includes(busqueda);
    return coincideFiltro && coincideBusqueda;
  });

  const filtrosBotones = [
    { key: "todos",          label: "Todos",          count: pedidos.length },
    { key: "nuevo",          label: "Nuevos",         count: conteosPorEstado["nuevo"] || 0 },
    { key: "en_preparacion", label: "En preparación", count: conteosPorEstado["en_preparacion"] || 0 },
    { key: "listo",          label: "Listos",         count: conteosPorEstado["listo"] || 0 },
    { key: "entregado",      label: "Entregados",     count: conteosPorEstado["entregado"] || 0 }
  ];

  return (
    <PanelLayout>
      {/* Toast de notificaciones */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-800 text-white px-5 py-3 rounded-2xl shadow-apple-xl flex items-center gap-3 animate-slide-up border border-gray-700">
          <span className="text-lg">🔔</span>
          <span className="text-sm font-semibold">{toast}</span>
        </div>
      )}

      {pedidoSeleccionado && (
        <DetallePedido
          pedido={pedidoSeleccionado}
          onClose={() => setPedidoSeleccionado(null)}
          onEstadoChange={actualizarEstado}
        />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Gestión de Pedidos</h1>
          <p className="text-gray-400 mt-2">
            Supervisá y administrá los pedidos entrantes desde WhatsApp.
            {ultimaActualizacion && (
              <span className="text-gray-500 ml-2">
                · Actualizado {ultimaActualizacion.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => fetchPedidos()}
          disabled={loading}
          className="flex items-center px-5 py-3 bg-gray-800 border border-gray-700 rounded-2xl text-sm font-medium text-gray-300 hover:bg-gray-700 transition-all shadow-apple hover:shadow-apple-lg active:scale-[0.98] disabled:opacity-50"
        >
          <RotateCw className={`w-4 h-4 mr-2 ${loading ? "animate-pulse" : ""}`} />
          Actualizar
        </button>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Nuevos",         estado: "nuevo" },
          { label: "En preparación", estado: "en_preparacion" },
          { label: "Listos",         estado: "listo" },
          { label: "Entregados",     estado: "entregado" }
        ].map(({ label, estado }) => (
          <button
            key={estado}
            onClick={() => setFiltro(estado)}
            className={`bg-gray-800 rounded-3xl border p-6 text-left transition-all hover:shadow-apple hover:scale-[1.02] ${
              filtro === estado ? "border-blue-500 ring-2 ring-blue-500/30 shadow-apple" : "border-gray-700"
            }`}
          >
            <p className="text-3xl font-bold text-white">{conteosPorEstado[estado] || 0}</p>
            <p className="text-sm text-gray-400 mt-2">{label}</p>
          </button>
        ))}
      </div>

      <div className="bg-gray-800 rounded-3xl shadow-apple border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-800/50">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por cliente, teléfono o ID..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-800 text-white placeholder-gray-500 transition-all"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
            {filtrosBotones.map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFiltro(key)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  filtro === key
                    ? "bg-blue-600 text-white shadow-apple"
                    : "bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700"
                }`}
              >
                {label}
                <span className={`px-2 py-1 rounded-full text-xs ${
                  filtro === key ? "bg-white/20 text-white" : "bg-gray-700 text-gray-400"
                }`}>
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-800/50 border-b border-gray-700 text-xs font-semibold uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Fecha y Hora</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Cambiar estado</th>
                <th className="px-6 py-4 text-right">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 text-sm bg-gray-800">
              {loading && pedidos.length === 0 ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td colSpan="7" className="px-6 py-6">
                      <div className="flex flex-col gap-3">
                        <Skeleton className="h-4 w-32 rounded-lg" />
                        <Skeleton className="h-3 w-44 rounded-lg" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : pedidosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-20 text-center">
                    <ShoppingBag className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                    <p className="text-lg font-medium text-white">No hay pedidos</p>
                    <p className="text-sm text-gray-500 mt-1">Ajustá los filtros o esperá nuevos pedidos.</p>
                  </td>
                </tr>
              ) : (
                pedidosFiltrados.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">
                      #{pedido.id.toString().padStart(4, "0")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{pedido.cliente_nombre || "Desconocido"}</div>
                      <div className="text-gray-400 text-xs mt-1">{pedido.cliente_telefono}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                      {new Date(pedido.creado_en).toLocaleString("es-AR", {
                        day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit"
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge estado={pedido.estado} />
                    </td>
                    <td className="px-6 py-4 font-bold text-white">
                      {pedido.total ? `$${pedido.total.toLocaleString()}` : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={pedido.estado}
                        onChange={(e) => actualizarEstado(pedido.id, e.target.value)}
                        className="border border-gray-700 rounded-2xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-800 text-white transition-all"
                      >
                        {ESTADOS.map(e => (
                          <option key={e} value={e}>{ESTADO_CONFIG[e]?.label || e}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setPedidoSeleccionado(pedido)}
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-2xl transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pedidosFiltrados.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-700 bg-gray-800/50 text-xs text-gray-400">
            Mostrando {pedidosFiltrados.length} de {pedidos.length} pedidos
          </div>
        )}
      </div>
    </PanelLayout>
  );
}
