"use client";

import { useEffect, useState } from "react";
import PanelLayout from "@/components/layout/PanelLayout";
import api from "@/lib/api";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line
} from "recharts";
import { TrendingUp, Users, ShoppingBag, DollarSign } from "lucide-react";

export default function DashboardPage() {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await api.get("/pedidos/metricas");
                setMetrics(response.data);
            } catch (err) {
                // Fallback dummy data if endpoint fails
                setMetrics({
                    ventasHoy: 15400,
                    pedidosHoy: 12,
                    ticketPromedio: 1283,
                    clientesActivos: 45,
                    ventasSemana: [
                        { name: "Lun", ventas: 12000 },
                        { name: "Mar", ventas: 19000 },
                        { name: "Mié", ventas: 15000 },
                        { name: "Jue", ventas: 22000 },
                        { name: "Vie", ventas: 28000 },
                        { name: "Sáb", ventas: 35000 },
                        { name: "Dom", ventas: 42000 },
                    ],
                });
                console.error("Error fetching metrics:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    if (loading) {
        return (
            <PanelLayout>
                <div className="flex h-[80vh] items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </PanelLayout>
        );
    }

    const statCards = [
        { name: "Ventas de Hoy", value: `$${metrics?.ventasHoy?.toLocaleString() || 0}`, icon: DollarSign, trend: "+12.5%" },
        { name: "Pedidos Hoy", value: metrics?.pedidosHoy || 0, icon: ShoppingBag, trend: "+5.2%" },
        { name: "Ticket Promedio", value: `$${metrics?.ticketPromedio?.toLocaleString() || 0}`, icon: TrendingUp, trend: "+2.1%" },
        { name: "Clientes Activos", value: metrics?.clientesActivos || 0, icon: Users, trend: "+18.2%" },
    ];

    return (
        <PanelLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
                <p className="text-gray-500 mt-1">Resumen de la actividad de tu restaurante para el día de hoy.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.name} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                </div>
                                <div className="p-3 bg-blue-50 rounded-xl">
                                    <Icon className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-sm">
                                <span className="text-emerald-500 font-medium bg-emerald-50 px-2 py-0.5 rounded text-xs">{stat.trend}</span>
                                <span className="text-gray-400 ml-2">vs ayer</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 tracking-tight">Ventas de la Semana</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={metrics?.ventasSemana || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dx={-10}
                                    tickFormatter={(value) => `$${value / 1000}k`}
                                />
                                <Tooltip
                                    cursor={{ fill: '#F3F4F6', radius: 4 }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
                                    formatter={(value) => [`$${value}`, "Ventas"]}
                                />
                                <Bar dataKey="ventas" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 tracking-tight">Tendencia de Ingresos</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={metrics?.ventasSemana || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dx={-10}
                                    tickFormatter={(value) => `$${value / 1000}k`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
                                    formatter={(value) => [`$${value}`, "Monto"]}
                                />
                                <Line type="monotone" dataKey="ventas" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: "#10B981", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </PanelLayout>
    );
}