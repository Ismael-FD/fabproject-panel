"use client";

import { useState } from "react";
import PanelLayout from "@/components/layout/PanelLayout";
import api from "@/lib/api";
import { Lock, Eye, EyeOff, Check, AlertCircle } from "lucide-react";

export default function PerfilPage() {
  const [form, setForm] = useState({
    password_actual: "",
    password_nueva: "",
    password_confirmar: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!form.password_actual) {
      setMessage({ type: "error", text: "Ingresa tu contraseña actual" });
      return;
    }
    
    if (form.password_nueva.length < 6) {
      setMessage({ type: "error", text: "La nueva contraseña debe tener al menos 6 caracteres" });
      return;
    }
    
    if (form.password_nueva !== form.password_confirmar) {
      setMessage({ type: "error", text: "Las contraseñas nuevas no coinciden" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await api.put("/auth/cambiar-password", {
        password_actual: form.password_actual,
        password_nueva: form.password_nueva,
      });

      setMessage({ type: "success", text: "Contraseña cambiada exitosamente" });
      setForm({
        password_actual: "",
        password_nueva: "",
        password_confirmar: "",
      });
      
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setMessage({ 
        type: "error", 
        text: err.response?.data?.error || "Error al cambiar contraseña. Verifica tu contraseña actual." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PanelLayout>
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Perfil</h1>
          <p className="text-gray-400 mt-2">Cambia tu contraseña de acceso al panel</p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-3xl shadow-apple p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Contraseña actual
              </label>
              <div className="relative">
                <input
                  type={form.showPassword ? "text" : "password"}
                  name="password_actual"
                  value={form.password_actual}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-800 transition-all pr-12"
                  placeholder="Ingresa tu contraseña actual"
                  required
                />
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {form.showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Nueva contraseña
              </label>
              <input
                type="password"
                name="password_nueva"
                value={form.password_nueva}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-800 transition-all"
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Confirmar nueva contraseña
              </label>
              <input
                type="password"
                name="password_confirmar"
                value={form.password_confirmar}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-800 transition-all"
                placeholder="Repite la nueva contraseña"
                required
              />
            </div>

            {/* Mensaje de feedback */}
            {message.text && (
              <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium animate-slide-up ${
                message.type === "error"
                  ? "bg-red-900/30 border border-red-700 text-red-300"
                  : "bg-green-900/30 border border-green-700 text-green-300"
              }`}>
                {message.type === "error" ? (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <Check className="w-5 h-5 flex-shrink-0" />
                )}
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-550 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl text-sm font-semibold transition-all shadow-apple hover:shadow-apple-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <Lock className="w-5 h-5" />
              )}
              {loading ? "Guardando..." : "Cambiar contraseña"}
            </button>
          </form>
        </div>
      </div>
    </PanelLayout>
  );
}
