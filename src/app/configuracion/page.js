"use client";

import { useEffect, useState } from "react";
import PanelLayout from "@/components/layout/PanelLayout";
import api from "@/lib/api";
import { Save, Store, Bot, Phone, MapPin, Clock, Truck, CreditCard, CheckCircle2, AlertCircle, Lock } from "lucide-react";

function Field({ label, name, value, onChange, type = "text", disabled = false, placeholder = "", hint = "" }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-neutral-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-2xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
          disabled
            ? "bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed"
            : "bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400 hover:border-neutral-300"
        }`}
      />
      {hint && <p className="text-xs text-neutral-500">{hint}</p>}
    </div>
  );
}

function Section({ icon: Icon, title, accent = false, children }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-apple">
      <div className="px-6 py-5 border-b border-neutral-100 bg-neutral-50/50 flex items-center gap-4">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${accent ? "bg-blue-100" : "bg-neutral-100"}`}>
          <Icon className={`w-5 h-5 ${accent ? "text-blue-600" : "text-neutral-600"}`} />
        </div>
        <h2 className="text-lg font-bold text-neutral-900">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

export default function ConfiguracionPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [config, setConfig] = useState({
    nombre: "", direccion: "", ciudad: "",
    horarios: "", numero_humano: "",
    costo_delivery: "", tiempo_entrega: "",
    zona_delivery: "",
    metodos_pago: "", alias_transferencia: "",
    nombre_bot: "", tono_bot: "",
    numero_whatsapp: "",
  });

  useEffect(() => {
    api.get("/restaurantes/mi-restaurante")
      .then(r => { if (r.data) setConfig({ ...config, ...r.data }); })
      .catch(() => setConfig(p => ({
        ...p, nombre: "Mi Restaurante Demo", ciudad: "Buenos Aires",
        horarios: "Lun a Sab 19:00 a 23:30", costo_delivery: "800",
        tiempo_entrega: "30-45 min", metodos_pago: "Efectivo, Transferencia",
        alias_transferencia: "mirestaurante.mp", nombre_bot: "Luna",
        tono_bot: "Amigable y rápido, sin emojis excesivos",
        numero_whatsapp: "+54 9 11 0000-0000",
      })))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const payload = { ...config, costo_delivery: parseFloat(config.costo_delivery) || 0 };
      await api.put("/restaurantes/mi-restaurante", payload);
      setMessage({ type: "success", text: "Cambios guardados correctamente." });
      setTimeout(() => setMessage({ type: "", text: "" }), 3500);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.error || "Error al guardar." });
    } finally {
      setSaving(false);
    }
  };

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

  return (
    <PanelLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Configuración</h1>
        <p className="text-neutral-500 mt-2">Datos de tu negocio y comportamiento del asistente de IA.</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        <Section icon={Store} title="Datos del local">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Nombre oficial" name="nombre" value={config.nombre} onChange={handleChange} placeholder="Ej: La Burguesía" />
            <Field label="Ciudad" name="ciudad" value={config.ciudad} onChange={handleChange} placeholder="Buenos Aires" />
            <div className="md:col-span-2">
              <Field label="Dirección" name="direccion" value={config.direccion} onChange={handleChange} placeholder="Av. Corrientes 1234" />
            </div>
            <Field label="Número de contacto humano" name="numero_humano" value={config.numero_humano} onChange={handleChange} placeholder="+54 9 11 1234-5678" hint="Para derivar consultas complejas" />
            <Field label="WhatsApp del bot" name="numero_whatsapp" value={config.numero_whatsapp} onChange={handleChange} disabled hint="No se puede cambiar desde aquí" />
          </div>
        </Section>

        <Section icon={Truck} title="Delivery y operativa">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Horarios de atención" name="horarios" value={config.horarios} onChange={handleChange} placeholder="Lun a Sab 19:00 a 23:30" />
            <Field label="Tiempo de entrega estimado" name="tiempo_entrega" value={config.tiempo_entrega} onChange={handleChange} placeholder="30-45 min" />
            <Field label="Costo de delivery (ARS)" name="costo_delivery" type="number" value={config.costo_delivery} onChange={handleChange} placeholder="800" />
            <Field label="Zona de cobertura" name="zona_delivery" value={config.zona_delivery} onChange={handleChange} placeholder="Palermo, Recoleta, Villa Crespo" />
          </div>
        </Section>

        <Section icon={CreditCard} title="Medios de pago">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Métodos aceptados" name="metodos_pago" value={config.metodos_pago} onChange={handleChange} placeholder="Efectivo, Mercado Pago, Transferencia" />
            <Field label="Alias de transferencia" name="alias_transferencia" value={config.alias_transferencia} onChange={handleChange} placeholder="milocal.mp" />
          </div>
        </Section>

        <Section icon={Bot} title="Asistente IA" accent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Nombre del bot" name="nombre_bot" value={config.nombre_bot} onChange={handleChange} placeholder="Luna, Max, Alex..." hint="Cómo se presenta el asistente" />
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-neutral-700">Tono del bot</label>
              <select
                name="tono_bot"
                value={config.tono_bot}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-white border border-neutral-200 text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                <option value="">Seleccionar tono</option>
                <option value="formal">Formal y profesional</option>
                <option value="amigable">Amigable y cercano</option>
                <option value="rapido">Rápido y directo</option>
                <option value="divertido">Divertido y con emojis</option>
              </select>
              <p className="text-xs text-neutral-500">Define la personalidad del asistente con tus clientes</p>
            </div>
          </div>
          <div className="mt-6 p-4 rounded-2xl bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-700 leading-relaxed">
              💡 El asistente usa estos datos automáticamente para responder preguntas sobre horarios, delivery, precios y medios de pago.
            </p>
          </div>
        </Section>

        {/* Acción */}
        <div className="flex items-center justify-between pt-2 pb-12">
          <div>
            {message.text && (
              <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-medium animate-slide-up ${
                message.type === "error"
                  ? "bg-error-50 border border-error-200 text-error-700"
                  : "bg-success-50 border border-success-200 text-success-700"
              }`}>
                {message.type === "error"
                  ? <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  : <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
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
