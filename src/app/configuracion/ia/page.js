"use client";

import { useEffect, useState } from "react";
import PanelLayout from "@/components/layout/PanelLayout";
import api from "@/lib/api";
import { useRestaurante } from "@/lib/RestauranteContext";
import { Save, Bot, CheckCircle2, AlertCircle } from "lucide-react";

function Field({ label, name, value, onChange, type = "text", disabled = false, placeholder = "", hint = "" }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-300">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-2xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
          disabled
            ? "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed"
            : "bg-gray-800 border-gray-700 text-white placeholder-gray-500 hover:border-gray-600"
        }`}
      />
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

function Section({ icon: Icon, title, accent = false, children }) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-3xl overflow-hidden shadow-apple">
      <div className="px-6 py-5 border-b border-gray-700 bg-gray-800/50 flex items-center gap-4">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${accent ? "bg-blue-500/20" : "bg-gray-700"}`}>
          <Icon className={`w-5 h-5 ${accent ? "text-blue-400" : "text-gray-400"}`} />
        </div>
        <h2 className="text-lg font-bold text-white">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

export default function ConfiguracionIAPage() {
  const { restaurante, loading: ctxLoading, updateRestaurante } = useRestaurante();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [config, setConfig] = useState({
    nombre_bot: "", tono_bot: ""
  });

  useEffect(() => {
    if (restaurante) {
      setConfig({
        nombre_bot: restaurante.nombre_bot || "",
        tono_bot: restaurante.tono_bot || ""
      });
      setLoading(false);
    }
  }, [restaurante]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      await api.put("/restaurantes/mi-restaurante", config);
      // Actualizar el contexto global con los nuevos datos
      updateRestaurante(config);
      setMessage({ type: "success", text: "Configuración de IA guardada correctamente" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch {
      setMessage({ type: "error", text: "Error al guardar configuración de IA" });
    } finally {
      setSaving(false);
    }
  };

  if (loading || ctxLoading) {
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
        <h1 className="text-3xl font-bold text-white tracking-tight">Asistente IA</h1>
        <p className="text-gray-400 mt-2">Personaliza el comportamiento y personalidad de tu asistente virtual.</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        <Section icon={Bot} title="Personalidad del bot" accent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Nombre del bot" name="nombre_bot" value={config.nombre_bot} onChange={handleChange} placeholder="Luna, Max, Alex..." hint="Cómo se presenta el asistente" />
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">Tono del bot</label>
              <select
                name="tono_bot"
                value={config.tono_bot}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                <option value="">Seleccionar tono</option>
                <option value="formal">Formal y profesional</option>
                <option value="amigable">Amigable y cercano</option>
                <option value="rapido">Rápido y directo</option>
                <option value="divertido">Divertido y con emojis</option>
              </select>
              <p className="text-xs text-gray-500">Define la personalidad del asistente con tus clientes</p>
            </div>
          </div>
          <div className="mt-6 p-4 rounded-2xl bg-blue-900/30 border border-blue-700/50">
            <p className="text-sm text-blue-300 leading-relaxed">
              💡 El asistente usa estos datos automáticamente para responder preguntas sobre horarios, delivery, precios y medios de pago.
            </p>
          </div>
        </Section>

        <div className="flex items-center justify-between pt-2 pb-12">
          <div>
            {message.text && (
              <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-medium animate-slide-up ${
                message.type === "error"
                  ? "bg-red-900/30 border border-red-700 text-red-300"
                  : "bg-green-900/30 border border-green-700 text-green-300"
              }`}>
                {message.type === "error" ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> : <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
                {message.text}
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-semibold bg-gradient-to-r from-blue-550 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all shadow-apple hover:shadow-apple-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {saving ? (
              <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </PanelLayout>
  );
}
