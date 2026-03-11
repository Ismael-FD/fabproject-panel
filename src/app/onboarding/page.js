"use client";

import { useState } from "react";
import React from "react";
import api from "@/lib/api";
import { Store, Bot, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";

function Field({ label, name, value, onChange, type = "text", disabled = false, placeholder = "", hint = "", required = false }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        required={required}
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

function SelectField({ label, name, value, onChange, options, placeholder = "", hint = "", required = false }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

function StepIndicator({ currentStep, totalSteps }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={`h-2 w-2 rounded-full transition-all duration-300 ${
            i === currentStep
              ? "bg-blue-600 w-8"
              : i < currentStep
              ? "bg-blue-400"
              : "bg-gray-600"
          }`}
        />
      ))}
    </div>
  );
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    // Paso 1: Datos básicos
    nombre: "",
    email: "",
    password: "",
    confirmar_password: "",
    telefono: "",
    ciudad: "",
    
    // Paso 2: Información del local
    direccion: "",
    horarios: "",
    tiempo_entrega: "",
    costo_delivery: "",
    zona_delivery: "",
    
    // Paso 3: Configuración IA y pagos
    nombre_bot: "",
    tono_bot: "",
    metodos_pago: "",
    alias_transferencia: "",
  });

  const steps = [
    {
      title: "Crea tu cuenta",
      subtitle: "Información básica de tu negocio",
      icon: Users,
    },
    {
      title: "Configura tu local",
      subtitle: "Dirección, horarios y delivery",
      icon: Store,
    },
    {
      title: "Personaliza el asistente",
      subtitle: "IA y medios de pago",
      icon: Bot,
    },
  ];

  const ciudades = [
    { value: "buenos-aires", label: "Buenos Aires" },
    { value: "cordoba", label: "Córdoba" },
    { value: "rosario", label: "Rosario" },
    { value: "mendoza", label: "Mendoza" },
    { value: "la-plata", label: "La Plata" },
  ];

  const tonosBot = [
    { value: "formal", label: "Formal y profesional" },
    { value: "amigable", label: "Amigable y cercano" },
    { value: "rapido", label: "Rápido y directo" },
    { value: "divertido", label: "Divertido y con emojis" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        return formData.nombre && formData.email && formData.password && formData.confirmar_password && formData.telefono && formData.ciudad;
      case 1:
        return formData.direccion && formData.horarios && formData.tiempo_entrega && formData.costo_delivery && formData.zona_delivery;
      case 2:
        return formData.nombre_bot && formData.tono_bot && formData.metodos_pago;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    } else {
      setMessage({ type: "error", text: "Por favor completa todos los campos requeridos" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) {
      setMessage({ type: "error", text: "Por favor completa todos los campos requeridos" });
      return;
    }

    if (formData.password !== formData.confirmar_password) {
      setMessage({ type: "error", text: "Las contraseñas no coinciden" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await api.post("/auth/onboarding", {
        restaurante: {
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          ciudad: formData.ciudad,
          direccion: formData.direccion,
          horarios: formData.horarios,
          tiempo_entrega: formData.tiempo_entrega,
          costo_delivery: parseFloat(formData.costo_delivery),
          zona_delivery: formData.zona_delivery,
          nombre_bot: formData.nombre_bot,
          tono_bot: formData.tono_bot,
          metodos_pago: formData.metodos_pago,
          alias_transferencia: formData.alias_transferencia,
        },
        usuario: {
          email: formData.email,
          password: formData.password,
        },
      });

      setMessage({ type: "success", text: "¡Restaurante creado exitosamente! Redirigiendo..." });
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      setMessage({ 
        type: "error", 
        text: err.response?.data?.error || "Error al crear el restaurante. Verifica los datos." 
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Nombre del restaurante" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej: La Burguesía" required />
              <Field label="Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="contacto@restaurante.com" required />
              <Field label="Contraseña" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Mínimo 6 caracteres" required />
              <Field label="Confirmar contraseña" name="confirmar_password" type="password" value={formData.confirmar_password} onChange={handleChange} placeholder="Repite la contraseña" required />
              <Field label="Teléfono" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="+54 9 11 1234-5678" required />
              <SelectField label="Ciudad" name="ciudad" value={formData.ciudad} onChange={handleChange} options={ciudades} placeholder="Selecciona tu ciudad" required />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Field label="Dirección" name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Av. Corrientes 1234" required />
              </div>
              <Field label="Horarios de atención" name="horarios" value={formData.horarios} onChange={handleChange} placeholder="Lun a Sab 19:00 a 23:30" required />
              <Field label="Tiempo de entrega" name="tiempo_entrega" value={formData.tiempo_entrega} onChange={handleChange} placeholder="30-45 min" required />
              <Field label="Costo de delivery (ARS)" name="costo_delivery" type="number" value={formData.costo_delivery} onChange={handleChange} placeholder="800" required />
              <div className="md:col-span-2">
                <Field label="Zona de cobertura" name="zona_delivery" value={formData.zona_delivery} onChange={handleChange} placeholder="Palermo, Recoleta, Villa Crespo" required />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Nombre del asistente" name="nombre_bot" value={formData.nombre_bot} onChange={handleChange} placeholder="Luna, Max, Alex..." required hint="Cómo se presenta el bot con tus clientes" />
              <SelectField label="Tono del asistente" name="tono_bot" value={formData.tono_bot} onChange={handleChange} options={tonosBot} placeholder="Selecciona el tono" required hint="Define la personalidad del bot" />
              <div className="md:col-span-2">
                <Field label="Medios de pago aceptados" name="metodos_pago" value={formData.metodos_pago} onChange={handleChange} placeholder="Efectivo, Mercado Pago, Transferencia" required hint="Separa con comas" />
              </div>
              <div className="md:col-span-2">
                <Field label="Alias de transferencia" name="alias_transferencia" value={formData.alias_transferencia} onChange={handleChange} placeholder="milocal.mp" hint="Opcional pero recomendado" />
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
              <p className="text-sm text-blue-700 leading-relaxed">
                🎉 ¡Estás a punto de activar tu asistente IA! Recibirás un número de WhatsApp dedicado para que tus clientes puedan hacer pedidos automáticamente.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-apple-xl">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Crea tu restaurante</h1>
          <p className="text-gray-400">Configura tu negocio en menos de 5 minutos</p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} totalSteps={steps.length} />

        {/* Step Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            {React.createElement(steps[currentStep].icon, { className: "w-6 h-6 text-blue-400" })}
            <h2 className="text-xl font-bold text-white">{steps[currentStep].title}</h2>
          </div>
          <p className="text-gray-400 text-sm">{steps[currentStep].subtitle}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 rounded-3xl shadow-apple-xl p-8">
          {renderStep()}

          {/* Message */}
          {message.text && (
            <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-medium animate-slide-up mb-6 ${
              message.type === "error"
                ? "bg-red-900/30 border border-red-700 text-red-300"
                : "bg-green-900/30 border border-green-700 text-green-300"
            }`}>
              {message.type === "error" ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> : <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
              {message.text}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold bg-gradient-to-r from-blue-550 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all shadow-apple hover:shadow-apple-lg active:scale-[0.98]"
              >
                Siguiente
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-semibold bg-gradient-to-r from-blue-550 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all shadow-apple hover:shadow-apple-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {loading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <CheckCircle2 className="w-5 h-5" />
                )}
                {loading ? "Creando restaurante..." : "Crear restaurante"}
              </button>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            ¿Ya tienes una cuenta? <a href="/login" className="text-blue-400 hover:text-blue-300 font-medium">Inicia sesión</a>
          </p>
        </div>
      </div>
    </div>
  );
}
