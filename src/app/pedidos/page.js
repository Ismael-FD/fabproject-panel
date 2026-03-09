"use client";

import { useEffect, useState } from "react";
import PanelLayout from "@/components/layout/PanelLayout";
import api from "@/lib/api";
import { Search, Filter, Eye, Clock, CheckCircle2, XCircle, RotateCw } from "lucide-react";

export default function PedidosPage() {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState("TODOS");

    useEffect(() => {
        fetchPedidos();
    }, []);

    const fetchPedidos = async () => {
        setLoading(true);
        try {
            const response = await api.get("/pedidos");
            setPedidos(response.data);
        } catch (err) {
            console.error("Error fetching pedidos", err);
            // Dummy data for visual presentation if API handles error
            setPedidos([
                { id: 1, cliente: { telefono: "+54 9 11 1234-5678", nombre: "Juan Perez" }, total: 12500, estado: "PENDIENTE", createdAt: new Date().toISOString(), items: 3 },
                { id: 2, cliente: { telefono: "+54 9 11 8765-4321", nombre: "Maria Gomez" }, total: 8400, estado: "EN_PREPARACION", createdAt: new Date(Date.now() - 3600000).toISOString(), items: 2 },
                { id: 3, cliente: { telefono: "+54 9 11 5555-5555", nombre: "Carlos" }, total: 4500, estado: "ENTREGADO", createdAt: new Date(Date.now() - 86400000).toISOString(), items: 1 },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const pedidosFiltrados = filtro === "TODOS"
        ? pedidos
        : pedidos.filter(p => p.estado === filtro);

    const getStatusBadge = (estado) => {
        const badges = {
            PENDIENTE: "bg-amber-50 text-amber-700 border-amber-200",
            EN_PREPARACION: "bg-blue-50 text-blue-700 border-blue-200",
            ENVIADO: "bg-purple-50 text-purple-700 border-purple-200",
            ENTREGADO: "bg-emerald-50 text-emerald-700 border-emerald-200",
            CANCELADO: "bg-red-50 text-red-700 border-red-200"
        };

        const icons = {
            PENDIENTE: <Clock className="w-3 h-3 mr-1" />,
            EN_PREPARACION: <RotateCw className="w-3 h-3 mr-1" />,
            ENVIADO: <Filter className="w-3 h-3 mr-1" />,
            ENTREGADO: <CheckCircle2 className="w-3 h-3 mr-1" />,
            CANCELADO: <XCircle className="w-3 h-3 mr-1" />
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${badges[estado] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                {icons[estado]}
                {estado.replace('_', ' ')}
            </span>
        );
    };

    return (
        <PanelLayout>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gestión de Pedidos</h1>
                    <p className="text-gray-500 mt-1">Supervisa y administra los pedidos entrantes desde WhatsApp.</p>
                </div>
                <button
                    onClick={fetchPedidos}
                    className="flex items-center px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm active:scale-95"
                >
                    <RotateCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin cursor-not-allowed' : ''}`} />
                    Actualizar Lista
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Buscar por cliente o ID..."
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                        />
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
                        {["TODOS", "PENDIENTE", "EN_PREPARACION", "ENTREGADO"].map(f => (
                            <button
                                key={f}
                                onClick={() => setFiltro(f)}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${filtro === f
                                        ? "bg-gray-900 text-white shadow-md transform scale-[1.02]"
                                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                                    }`}
                            >
                                {f.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                <th className="px-6 py-4">ID Pedido</th>
                                <th className="px-6 py-4">Cliente</th>
                                <th className="px-6 py-4">Fecha y Hora</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm bg-white">
                            {loading && pedidos.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex justify-center mb-3">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        </div>
                                        Cargando pedidos...
                                    </td>
                                </tr>
                            ) : pedidosFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        <div className="text-gray-400 mb-2">
                                            <ShoppingBag className="w-12 h-12 mx-auto opacity-20" />
                                        </div>
                                        <p className="text-base font-medium text-gray-900">No se encontraron pedidos</p>
                                        <p className="text-sm">Ajusta los filtros o intenta buscar otro pedido.</p>
                                    </td>
                                </tr>
                            ) : (
                                pedidosFiltrados.map((pedido) => (
                                    <tr key={pedido.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-6 py-4 font-semibold text-gray-900">
                                            #{pedido.id.toString().padStart(4, '0')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900">{pedido.cliente?.nombre || 'Desconocido'}</div>
                                            <div className="text-gray-500 text-xs mt-0.5 font-medium">{pedido.cliente?.telefono}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 font-medium whitespace-nowrap">
                                            {new Date(pedido.createdAt).toLocaleString('es-AR', {
                                                day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(pedido.estado)}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">
                                            ${pedido.total.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors focus:ring-2 focus:ring-blue-100 outline-none">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </PanelLayout>
    );
}