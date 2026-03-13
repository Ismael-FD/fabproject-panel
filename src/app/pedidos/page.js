"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import PanelLayout from "@/components/layout/PanelLayout";
import api from "@/lib/api";
import {
  Search, Eye, RotateCw, ShoppingBag, X,
  MapPin, Phone, CreditCard, Bell, Volume2,
} from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

const ESTADOS = ["nuevo", "confirmado", "en_preparacion", "listo", "entregado", "cancelado"];
const ESTADO_CONFIG = {
  nuevo:          { label: "Nuevo",          color: "bg-yellow-100 text-yellow-800 border-yellow-200",   dot: "bg-yellow-500" },
  confirmado:     { label: "Confirmado",     color: "bg-blue-100 text-blue-700 border-blue-200",         dot: "bg-blue-500" },
  en_preparacion: { label: "En preparación", color: "bg-purple-100 text-purple-700 border-purple-200",   dot: "bg-purple-500" },
  listo:          { label: "Listo",          color: "bg-green-100 text-green-700 border-green-200",      dot: "bg-green-500" },
  entregado:      { label: "Entregado",      color: "bg-emerald-100 text-emerald-700 border-emerald-200",dot: "bg-emerald-500" },
  cancelado:      { label: "Cancelado",      color: "bg-red-100 text-red-700 border-red-200",            dot: "bg-red-500" },
};

function StatusBadge({ estado }) {
  const cfg = ESTADO_CONFIG[estado] || { label: estado, color: "bg-gray-700 text-gray-300 border-gray-600", dot: "bg-gray-500" };
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${cfg.color}`}>
      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />{cfg.label}
    </span>
  );
}

function DetallePedido({ pedido, onClose, onEstadoChange }) {
  if (!pedido) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg p-6 sm:p-8 z-10 border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Pedido #{pedido.id.toString().padStart(4, "0")}</h2>
            <p className="text-sm text-gray-400 mt-1">{new Date(pedido.creado_en).toLocaleString("es-AR")}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-2xl transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="bg-gray-700/50 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="font-medium text-white">{pedido.cliente_nombre || "Sin nombre"}</span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-400">{pedido.cliente_telefono}</span>
            </div>
            {pedido.direccion && (
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" /><span className="text-gray-400">{pedido.direccion}</span>
              </div>
            )}
            {pedido.metodo_pago && (
              <div className="flex items-center gap-3 text-sm">
                <CreditCard className="w-4 h-4 text-gray-400" /><span className="text-gray-400">{pedido.metodo_pago}</span>
              </div>
            )}
          </div>
          <div className="bg-gray-700/50 rounded-2xl p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Detalle</p>
            <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{pedido.detalle}</p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-2">Cambiar estado</p>
              <select value={pedido.estado} onChange={(e) => onEstadoChange(pedido.id, e.target.value)}
                className="border border-gray-700 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-800 text-white">
                {ESTADOS.map(e => <option key={e} value={e}>{ESTADO_CONFIG[e]?.label || e}</option>)}
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

// ── Notificación de pedido nuevo (extremadamente notoria) ─────────────────────
function AlertaPedidoNuevo({ cantidad, onClose, ultimoPedido }) {
  useEffect(() => {
    // Sonido de alerta usando Web Audio API (sin archivos externos)
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const playBeep = (freq, start, dur) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.value = freq;
        o.type = "sine";
        g.gain.setValueAtTime(0.4, ctx.currentTime + start);
        g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + start + dur);
        o.start(ctx.currentTime + start);
        o.stop(ctx.currentTime + start + dur + 0.1);
      };
      // 3 beeps ascendentes
      playBeep(880, 0,    0.15);
      playBeep(1100, 0.2, 0.15);
      playBeep(1320, 0.4, 0.25);
    } catch (_) {}
  }, []);

  return (
    <>
      {/* Fondo que pulsa */}
      <div className="fixed inset-0 z-[60] pointer-events-none">
        <div className="absolute inset-0 animate-ping bg-orange-500/10 rounded-none" style={{ animationDuration: "0.8s", animationIterationCount: 3 }} />
      </div>

      {/* Banner superior full-width */}
      <div className="fixed top-0 left-0 right-0 z-[70] pointer-events-auto">
        <div className="bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 shadow-2xl px-4 py-4 flex items-center justify-between animate-slide-down">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0 animate-bounce">
              <Bell className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-white font-black text-lg sm:text-xl tracking-tight">
                🔔 {cantidad === 1 ? "¡NUEVO PEDIDO!" : `¡${cantidad} PEDIDOS NUEVOS!`}
              </p>
              {ultimoPedido && (
                <p className="text-white/80 text-sm font-medium mt-0.5">
                  {ultimoPedido.cliente_nombre || "Cliente"} · {new Date(ultimoPedido.creado_en).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
                  {ultimoPedido.total ? ` · $${ultimoPedido.total.toLocaleString()}` : ""}
                </p>
              )}
            </div>
          </div>
          <button onClick={onClose}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors flex-shrink-0">
            <X className="w-4 h-4" /> Cerrar
          </button>
        </div>
      </div>

      {/* Borde parpadeante en toda la pantalla */}
      <div className="fixed inset-0 z-[65] pointer-events-none border-4 border-orange-500 animate-pulse rounded-none" />
    </>
  );
}

export default function PedidosPage() {
  const [pedidos,            setPedidos]            = useState([]);
  const [loading,            setLoading]            = useState(true);
  const [filtro,             setFiltro]             = useState("todos");
  const [busqueda,           setBusqueda]           = useState("");
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [ultimaActualizacion,setUltimaActualizacion]= useState(null);
  const [alertaPedidos,      setAlertaPedidos]      = useState(null); // { cantidad, ultimoPedido }
  const [pedidosNuevosCount, setPedidosNuevosCount] = useState(0);

  const idsConocidosRef = useRef(new Set());
  const iniciado        = useRef(false);

  const fetchPedidos = useCallback(async (silencioso = false) => {
    if (!silencioso) setLoading(true);
    try {
      const response = await api.get("/pedidos?limit=100");
      const nuevosPedidos = response.data;

      if (!iniciado.current) {
        // Primera carga: llenar el Set sin disparar alerta
        nuevosPedidos.forEach((p) => idsConocidosRef.current.add(p.id));
        iniciado.current = true;
      } else {
        // Polling: detectar pedidos que no estaban antes
        const realmente_nuevos = nuevosPedidos.filter((p) => !idsConocidosRef.current.has(p.id));
        if (realmente_nuevos.length > 0) {
          realmente_nuevos.forEach((p) => idsConocidosRef.current.add(p.id));
          setAlertaPedidos({ cantidad: realmente_nuevos.length, ultimoPedido: realmente_nuevos[0] });
        }
      }

      // Contar pedidos con estado "nuevo"
      const nuevosCount = nuevosPedidos.filter((p) => p.estado === "nuevo").length;
      setPedidosNuevosCount(nuevosCount);

      setPedidos(nuevosPedidos);
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
      setPedidos((prev) => prev.map((p) => p.id === id ? { ...p, estado } : p));
      if (pedidoSeleccionado?.id === id) setPedidoSeleccionado((prev) => ({ ...prev, estado }));
      // Actualizar conteo de nuevos
      const updatedPedidos = pedidos.map((p) => p.id === id ? { ...p, estado } : p);
      setPedidosNuevosCount(updatedPedidos.filter((p) => p.estado === "nuevo").length);
    } catch (err) { console.error(err); }
  };

  const conteosPorEstado = pedidos.reduce((acc, p) => {
    acc[p.estado] = (acc[p.estado] || 0) + 1;
    return acc;
  }, {});

  const pedidosFiltrados = pedidos.filter((p) => {
    const coincideFiltro   = filtro === "todos" || p.estado === filtro;
    const coincideBusqueda = !busqueda ||
      p.cliente_nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.cliente_telefono?.includes(busqueda) ||
      p.id.toString().includes(busqueda);
    return coincideFiltro && coincideBusqueda;
  });

  const filtrosBotones = [
    { key: "todos",          label: "Todos",         count: pedidos.length },
    { key: "nuevo",          label: "Nuevos",        count: conteosPorEstado["nuevo"] || 0 },
    { key: "en_preparacion", label: "En prep.",      count: conteosPorEstado["en_preparacion"] || 0 },
    { key: "listo",          label: "Listos",        count: conteosPorEstado["listo"] || 0 },
    { key: "entregado",      label: "Entregados",    count: conteosPorEstado["entregado"] || 0 },
  ];

  return (
    <PanelLayout pedidosNuevos={pedidosNuevosCount}>
      {/* Alerta pedido nuevo */}
      {alertaPedidos && (
        <AlertaPedidoNuevo
          cantidad={alertaPedidos.cantidad}
          ultimoPedido={alertaPedidos.ultimoPedido}
          onClose={() => setAlertaPedidos(null)}
        />
      )}

      {pedidoSeleccionado && (
        <DetallePedido
          pedido={pedidoSeleccionado}
          onClose={() => setPedidoSeleccionado(null)}
          onEstadoChange={actualizarEstado}
        />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Gestión de Pedidos</h1>
          <p className="text-gray-400 mt-1 text-sm">
            Supervisá los pedidos entrantes desde WhatsApp.
            {ultimaActualizacion && (
              <span className="text-gray-500 ml-2">
                · {ultimaActualizacion.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
          </p>
        </div>
        <button onClick={() => fetchPedidos()} disabled={loading}
          className="flex items-center px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-2xl text-sm font-medium text-gray-300 hover:bg-gray-700 transition-all disabled:opacity-50">
          <RotateCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Actualizar
        </button>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Nuevos",         estado: "nuevo",          urgent: true },
          { label: "En preparación", estado: "en_preparacion", urgent: false },
          { label: "Listos",         estado: "listo",          urgent: false },
          { label: "Entregados",     estado: "entregado",      urgent: false },
        ].map(({ label, estado, urgent }) => {
          const count = conteosPorEstado[estado] || 0;
          return (
            <button key={estado} onClick={() => setFiltro(estado)}
              className={`rounded-3xl border p-5 text-left transition-all hover:scale-[1.02] ${
                filtro === estado ? "border-blue-500 ring-2 ring-blue-500/30" : "border-gray-700"
              } ${urgent && count > 0 ? "bg-orange-900/30 border-orange-700 animate-pulse" : "bg-gray-800"}`}>
              <p className={`text-3xl font-black ${urgent && count > 0 ? "text-orange-300" : "text-white"}`}>{count}</p>
              <p className="text-sm text-gray-400 mt-2">{label}</p>
              {urgent && count > 0 && <p className="text-xs text-orange-400 font-semibold mt-1">⚡ Requieren atención</p>}
            </button>
          );
        })}
      </div>

      <div className="bg-gray-800 rounded-3xl border border-gray-700 overflow-hidden">
        {/* Filtros y búsqueda */}
        <div className="p-4 sm:p-6 border-b border-gray-700 space-y-3 sm:space-y-0 sm:flex sm:justify-between sm:items-center gap-4 bg-gray-800/50">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar cliente, teléfono o ID..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-800 text-white placeholder-gray-500" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {filtrosBotones.map(({ key, label, count }) => (
              <button key={key} onClick={() => setFiltro(key)}
                className={`px-3 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  filtro === key ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700"
                }`}>
                {label}
                <span className={`px-1.5 py-0.5 rounded-full text-xs ${filtro === key ? "bg-white/20" : "bg-gray-700 text-gray-400"}`}>{count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tabla desktop */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-800/50 border-b border-gray-700 text-xs font-semibold uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Hora</th>
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
                      <div className="flex gap-3">
                        <Skeleton className="h-4 w-32 rounded-lg" />
                        <Skeleton className="h-4 w-44 rounded-lg" />
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
              ) : pedidosFiltrados.map((pedido) => (
                <tr key={pedido.id} className={`hover:bg-gray-700/50 transition-colors ${pedido.estado === "nuevo" ? "border-l-4 border-l-orange-500" : ""}`}>
                  <td className="px-6 py-4 font-semibold text-white">#{pedido.id.toString().padStart(4, "0")}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-white">{pedido.cliente_nombre || "Desconocido"}</div>
                    <div className="text-gray-400 text-xs mt-1">{pedido.cliente_telefono}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                    {new Date(pedido.creado_en).toLocaleString("es-AR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="px-6 py-4"><StatusBadge estado={pedido.estado} /></td>
                  <td className="px-6 py-4 font-bold text-white">{pedido.total ? `$${pedido.total.toLocaleString()}` : "—"}</td>
                  <td className="px-6 py-4">
                    <select value={pedido.estado} onChange={(e) => actualizarEstado(pedido.id, e.target.value)}
                      className="border border-gray-700 rounded-2xl px-3 py-2 text-xs bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                      {ESTADOS.map(e => <option key={e} value={e}>{ESTADO_CONFIG[e]?.label || e}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setPedidoSeleccionado(pedido)}
                      className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-2xl transition-all">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cards mobile */}
        <div className="sm:hidden divide-y divide-gray-700">
          {pedidosFiltrados.length === 0 ? (
            <div className="py-16 text-center">
              <ShoppingBag className="w-12 h-12 mx-auto text-gray-600 mb-3" />
              <p className="text-gray-400 text-sm">No hay pedidos</p>
            </div>
          ) : pedidosFiltrados.map((pedido) => (
            <div key={pedido.id}
              className={`p-4 space-y-3 ${pedido.estado === "nuevo" ? "border-l-4 border-l-orange-500 bg-orange-900/10" : ""}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-gray-500 font-mono">#{pedido.id.toString().padStart(4, "0")}</p>
                  <p className="text-sm font-semibold text-white mt-0.5">{pedido.cliente_nombre || "Desconocido"}</p>
                  <p className="text-xs text-gray-400">{pedido.cliente_telefono}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StatusBadge estado={pedido.estado} />
                  {pedido.total && <p className="text-sm font-bold text-white">${pedido.total.toLocaleString()}</p>}
                </div>
              </div>
              <p className="text-xs text-gray-500">
                {new Date(pedido.creado_en).toLocaleString("es-AR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
              </p>
              <div className="flex gap-2">
                <select value={pedido.estado} onChange={(e) => actualizarEstado(pedido.id, e.target.value)}
                  className="flex-1 border border-gray-700 rounded-xl px-3 py-2 text-xs bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                  {ESTADOS.map(e => <option key={e} value={e}>{ESTADO_CONFIG[e]?.label || e}</option>)}
                </select>
                <button onClick={() => setPedidoSeleccionado(pedido)}
                  className="px-3 py-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-xl border border-gray-700 transition-all">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
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
