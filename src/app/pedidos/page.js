"use client";

import { useEffect, useState, useCallback } from "react";
import PanelLayout from "@/components/layout/PanelLayout";
import api from "@/lib/api";
import {
  Search, Eye, Clock, CheckCircle2, XCircle, RotateCw,
  ShoppingBag, ChefHat, Bike, X, MapPin, Phone, CreditCard, Package
} from "lucide-react";

const ESTADOS = ["nuevo", "confirmado", "en_preparacion", "listo", "entregado", "cancelado"];

const ESTADO_CONFIG = {
  nuevo:          { label: "Nuevo",          color: "bg-warning-100 text-warning-700 border-warning-200",       dot: "bg-warning-500" },
  confirmado:     { label: "Confirmado",     color: "bg-blue-100 text-blue-700 border-blue-200",          dot: "bg-blue-500" },
  en_preparacion: { label: "En preparación", color: "bg-purple-100 text-purple-700 border-purple-200",    dot: "bg-purple-500" },
  listo:          { label: "Listo",          color: "bg-success-100 text-success-700 border-success-200",       dot: "bg-success-500" },
  entregado:      { label: "Entregado",      color: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  cancelado:      { label: "Cancelado",      color: "bg-error-100 text-error-700 border-error-200",             dot: "bg-error-500" },
};

function StatusBadge({ estado }) {
  const cfg = ESTADO_CONFIG[estado] || { label: estado, color: "bg-neutral-100 text-neutral-700 border-neutral-200", dot: "bg-neutral-500" };
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
      <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-apple-xl w-full max-w-lg p-8 z-10 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Pedido #{pedido.id.toString().padStart(4, "0")}</h2>
            <p className="text-sm text-neutral-500 mt-1">{new Date(pedido.creado_en).toLocaleString("es-AR")}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-2xl transition-colors">
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>
        <div className="space-y-6">
          <div className="bg-neutral-50 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-5 h-5 text-neutral-400" />
              <span className="font-medium text-neutral-900">{pedido.cliente_nombre || "Sin nombre"}</span>
              <span className="text-neutral-400">·</span>
              <span className="text-neutral-600">{pedido.cliente_telefono}</span>
            </div>
            {pedido.direccion && (
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-5 h-5 text-neutral-400" />
                <span className="text-neutral-600">{pedido.direccion}</span>
              </div>
            )}
            {pedido.metodo_pago && (
              <div className="flex items-center gap-3 text-sm">
                <CreditCard className="w-5 h-5 text-neutral-400" />
                <span className="text-neutral-600">{pedido.metodo_pago}</span>
              </div>
            )}
          </div>
          <div className="bg-neutral-50 rounded-2xl p-5">
            <p className="text-sm font-semibold text-neutral-700 uppercase tracking-wider mb-3">Detalle</p>
            <p className="text-sm text-neutral-700 whitespace-pre-wrap leading-relaxed">{pedido.detalle}</p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 mb-2">Cambiar estado</p>
              <select
                value={pedido.estado}
                onChange={(e) => onEstadoChange(pedido.id, e.target.value)}
                className="border border-neutral-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white transition-all"
              >
                {ESTADOS.map(e => (
                  <option key={e} value={e}>{ESTADO_CONFIG[e]?.label || e}</option>
                ))}
              </select>
            </div>
            {pedido.total && (
              <div className="text-right">
                <p className="text-sm text-neutral-500 mb-1">Total</p>
                <p className="text-2xl font-bold text-neutral-900">${pedido.total.toLocaleString()}</p>
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

  const fetchPedidos = useCallback(async (silencioso = false) => {
    if (!silencioso) setLoading(true);
    try {
      const response = await api.get("/pedidos?limit=100");
      setPedidos(response.data);
      setUltimaActualizacion(new Date());
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
    { key: "entregado",      label: "Entregados",     count: conteosPorEstado["entregado"] || 0 },
  ];

  return (
    <PanelLayout>
      {pedidoSeleccionado && (
        <DetallePedido
          pedido={pedidoSeleccionado}
          onClose={() => setPedidoSeleccionado(null)}
          onEstadoChange={actualizarEstado}
        />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Gestión de Pedidos</h1>
          <p className="text-neutral-500 mt-2">
            Supervisá y administrá los pedidos entrantes desde WhatsApp.
            {ultimaActualizacion && (
              <span className="text-neutral-400 ml-2">
                · Actualizado {ultimaActualizacion.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => fetchPedidos()}
          disabled={loading}
          className="flex items-center px-5 py-3 bg-white border border-neutral-200 rounded-2xl text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-all shadow-apple hover:shadow-apple-lg active:scale-[0.98] disabled:opacity-50"
        >
          <RotateCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Actualizar
        </button>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Nuevos",         estado: "nuevo" },
          { label: "En preparación", estado: "en_preparacion" },
          { label: "Listos",         estado: "listo" },
          { label: "Entregados",     estado: "entregado" },
        ].map(({ label, estado }) => (
          <button
            key={estado}
            onClick={() => setFiltro(estado)}
            className={`bg-white rounded-3xl border p-6 text-left transition-all hover:shadow-apple hover:scale-[1.02] ${
              filtro === estado ? "border-blue-300 ring-2 ring-blue-100 shadow-apple" : "border-neutral-200"
            }`}
          >
            <p className="text-3xl font-bold text-neutral-900">{conteosPorEstado[estado] || 0}</p>
            <p className="text-sm text-neutral-500 mt-2">{label}</p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-apple border border-neutral-200 overflow-hidden">
        <div className="p-6 border-b border-neutral-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-neutral-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por cliente, teléfono o ID..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white transition-all"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
            {filtrosBotones.map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFiltro(key)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  filtro === key
                    ? "bg-neutral-900 text-white shadow-apple"
                    : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                {label}
                <span className={`px-2 py-1 rounded-full text-xs ${
                  filtro === key ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-500"
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
              <tr className="bg-neutral-50 border-b border-neutral-100 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Fecha y Hora</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Cambiar estado</th>
                <th className="px-6 py-4 text-right">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-sm bg-white">
              {loading && pedidos.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 rounded-full border-2 border-neutral-200 border-t-blue-550 animate-spin"></div>
                    </div>
                    <p className="text-neutral-400">Cargando pedidos...</p>
                  </td>
                </tr>
              ) : pedidosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-20 text-center">
                    <ShoppingBag className="w-16 h-16 mx-auto text-neutral-200 mb-4" />
                    <p className="text-lg font-medium text-neutral-900">No hay pedidos</p>
                    <p className="text-sm text-neutral-400 mt-1">Ajustá los filtros o esperá nuevos pedidos.</p>
                  </td>
                </tr>
              ) : (
                pedidosFiltrados.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-neutral-900">
                      #{pedido.id.toString().padStart(4, "0")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-neutral-900">{pedido.cliente_nombre || "Desconocido"}</div>
                      <div className="text-neutral-400 text-xs mt-1">{pedido.cliente_telefono}</div>
                    </td>
                    <td className="px-6 py-4 text-neutral-600 whitespace-nowrap">
                      {new Date(pedido.creado_en).toLocaleString("es-AR", {
                        day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit"
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge estado={pedido.estado} />
                    </td>
                    <td className="px-6 py-4 font-bold text-neutral-900">
                      {pedido.total ? `$${pedido.total.toLocaleString()}` : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={pedido.estado}
                        onChange={(e) => actualizarEstado(pedido.id, e.target.value)}
                        className="border border-neutral-200 rounded-2xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white transition-all"
                      >
                        {ESTADOS.map(e => (
                          <option key={e} value={e}>{ESTADO_CONFIG[e]?.label || e}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setPedidoSeleccionado(pedido)}
                        className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-100 rounded-2xl transition-all"
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
          <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 text-xs text-neutral-400">
            Mostrando {pedidosFiltrados.length} de {pedidos.length} pedidos
          </div>
        )}
      </div>
    </PanelLayout>
  );
}
