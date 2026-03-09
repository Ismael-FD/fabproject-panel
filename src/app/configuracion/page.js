"use client";

import { useEffect, useState } from "react";
import PanelLayout from "@/components/layout/PanelLayout";
import api from "@/lib/api";
import { Save, Store, Bot, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ConfiguracionPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const [config, setConfig] = useState({
        nombre: "",
        direccion: "",
        telefono: "",
        horarioAtencion: "",
        mensajeBienvenida: "",
        costoEnvio: ""
    });

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        setLoading(true);
        try {
            const response = await api.get("/restaurantes/mi-restaurante");
            if (response.data) {
                setConfig({
                    nombre: response.data.nombre || "",
                    direccion: response.data.direccion || "",
                    telefono: response.data.telefono || "",
                    horarioAtencion: response.data.horarioAtencion || "",
                    mensajeBienvenida: response.data.mensajeBienvenida || "",
                    costoEnvio: response.data.costoEnvio?.toString() || "0",
                });
            }
        } catch (err) {
            console.error("Error fetching config", err);
            // Fallback
            setConfig({
                nombre: "Mi Restaurante",
                direccion: "Av. Falsa 123",
                telefono: "1122334455",
                horarioAtencion: "Lun a Sab 19:00 a 23:30",
                mensajeBienvenida: "¡Hola! Soy el asistente virtual. ¿Qué te gustaría pedir hoy?",
                costoEnvio: "500",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setConfig(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: "", text: "" });

        try {
            const payload = {
                ...config,
                costoEnvio: parseFloat(config.costoEnvio) || 0
            };

            await api.put("/restaurantes/config", payload);
            setMessage({ type: "success", text: "Configuración guardada correctamente." });

            // Clear success message after 3 seconds
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        } catch (err) {
            setMessage({
                type: "error",
                text: err.response?.data?.error || "Error al guardar la configuración."
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <PanelLayout>
                <div className="flex h-[80vh] items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </PanelLayout>
        );
    }

    return (
        <PanelLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Configuración General</h1>
                <p className="text-gray-500 mt-1">Administra los datos de tu negocio y el comportamiento del asistente de IA.</p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
                {/* Datos del Negocio */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center">
                        <Store className="w-5 h-5 text-gray-500 mr-2.5" />
                        <h2 className="text-lg font-bold text-gray-900">Datos Públicos del Local</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-gray-700">Nombre Oficial</label>
                            <input
                                type="text"
                                name="nombre"
                                value={config.nombre}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-gray-700">Número de WhatsApp</label>
                            <input
                                type="text"
                                name="telefono"
                                value={config.telefono}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm bg-gray-50 cursor-not-allowed"
                                disabled
                                title="El número de WhatsApp está vinculado a tu bot y no puede cambiarse desde aquí."
                            />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700">Dirección</label>
                            <input
                                type="text"
                                name="direccion"
                                value={config.direccion}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Configuración Operativa */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center">
                        <Bot className="w-5 h-5 text-blue-500 mr-2.5" />
                        <h2 className="text-lg font-bold text-gray-900">Operativa y Asistente IA</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-gray-700">Horario de Atención</label>
                            <input
                                type="text"
                                name="horarioAtencion"
                                value={config.horarioAtencion}
                                onChange={handleChange}
                                placeholder="Ej: Lun a Sab 19:00 a 23:30"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-gray-700">Costo de Envío ($ARS)</label>
                            <input
                                type="number"
                                name="costoEnvio"
                                value={config.costoEnvio}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                            />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 flex items-center">
                                Mensaje de Bienvenida del Bot
                                <span className="ml-2 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-blue-100 text-blue-700">Contexto IA</span>
                            </label>
                            <textarea
                                name="mensajeBienvenida"
                                value={config.mensajeBienvenida}
                                onChange={handleChange}
                                rows={4}
                                className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm font-mono text-gray-700 resize-none"
                            />
                            <p className="text-sm text-gray-500 mt-2 font-medium">
                                Este mensaje define la personalidad inicial de tu asistente y cómo saluda a los nuevos clientes.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between pt-2 pb-12">
                    <div className="flex-1 mr-4">
                        {message.text && (
                            <div className={`flex items-center p-4 rounded-xl text-sm font-bold shadow-sm ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-200'
                                }`}>
                                {message.type === 'error' ? <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" /> : <CheckCircle2 className="w-5 h-5 mr-3 flex-shrink-0" />}
                                {message.text}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className={`flex items-center justify-center px-8 py-3.5 rounded-xl text-sm font-extrabold text-white transition-all shadow-md active:scale-95 ${saving ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
                            }`}
                    >
                        {saving ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white mr-2"></div>
                        ) : (
                            <Save className="w-4 h-4 mr-2" />
                        )}
                        {saving ? 'Guardando Datos...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </PanelLayout>
    );
}