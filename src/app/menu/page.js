"use client";

import { useEffect, useState } from "react";
import PanelLayout from "@/components/layout/PanelLayout";
import api from "@/lib/api";
import { Plus, Edit2, Trash2, Search, Tag, DollarSign, PackageOpen } from "lucide-react";

export default function MenuPage() {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        setLoading(true);
        try {
            const response = await api.get("/menu");
            setCategorias(response.data);
        } catch (err) {
            console.error("Error fetching menu", err);
            // Dummy data for visual presentation if API fails
            setCategorias([
                {
                    id: 1,
                    nombre: "Hamburguesas",
                    productos: [
                        { id: 1, nombre: "Cheeseburger Clásica", precio: 4500, descripcion: "Medallón de 150g, cheddar, lechuga, tomate", disponible: true },
                        { id: 2, nombre: "Doble Bacon", precio: 6500, descripcion: "Dos medallones, bacon, cheddar, salsa BBQ", disponible: true },
                    ]
                },
                {
                    id: 2,
                    nombre: "Bebidas",
                    productos: [
                        { id: 3, nombre: "Coca Cola 500ml", precio: 1200, descripcion: "", disponible: true },
                        { id: 4, nombre: "Agua Minalba 500ml", precio: 1000, descripcion: "", disponible: false },
                    ]
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PanelLayout>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gestión del Menú</h1>
                    <p className="text-gray-500 mt-1">Administra tus categorías y productos disponibles.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm active:scale-95">
                        <Tag className="w-4 h-4 mr-2" />
                        Nueva Categoría
                    </button>
                    <button className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm active:scale-95">
                        <Plus className="w-4 h-4 mr-2 text-white" />
                        Nuevo Producto
                    </button>
                </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row gap-4">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Buscar productos o categorías..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50/50"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : categorias.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
                    <PackageOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">Tu menú está vacío</h3>
                    <p className="text-gray-500 mt-1">Comienza agregando tu primera categoría y producto.</p>
                    <button className="mt-6 inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors">
                        <Plus className="w-4 h-4 mr-1.5" />
                        Crear Categoría
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {categorias.map((categoria) => (
                        <div key={categoria.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
                            <div className="bg-gray-50/80 px-6 py-4 flex justify-between items-center border-b border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                                    <span className="w-1.5 h-5 bg-blue-600 rounded-full mr-3"></span>
                                    {categoria.nombre}
                                </h2>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-blue-100 shadow-sm">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-red-100 shadow-sm">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="divide-y divide-gray-50">
                                {categoria.productos?.length === 0 ? (
                                    <div className="p-6 text-center text-sm text-gray-500 font-medium">
                                        No hay productos en esta categoría.
                                    </div>
                                ) : (
                                    categoria.productos?.map((producto) => (
                                        <div key={producto.id} className="p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-blue-50/30 transition-colors">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-base font-bold text-gray-900">{producto.nombre}</h3>
                                                    {!producto.disponible && (
                                                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-red-100 text-red-700 border border-red-200">Agotado</span>
                                                    )}
                                                </div>
                                                {producto.descripcion && (
                                                    <p className="text-sm text-gray-500 mt-1.5 line-clamp-2 md:w-3/4">{producto.descripcion}</p>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-64 mt-2 sm:mt-0">
                                                <div className="text-lg font-extrabold text-gray-900 flex items-center">
                                                    <span className="text-gray-400 font-semibold text-sm mr-1">$</span>
                                                    {producto.precio.toLocaleString()}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </PanelLayout>
    );
}