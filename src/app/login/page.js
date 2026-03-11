"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { setToken } from "@/lib/auth";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      if (response.data?.token) {
        setToken(response.data.token);
        router.push("/dashboard");
      } else {
        setError("Respuesta inválida del servidor");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Credenciales incorrectas. Verificá tus datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-900">
      {/* Panel izquierdo — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gray-800 border-r border-gray-700 relative overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-120px] left-[-120px] w-[480px] h-[480px] rounded-full bg-blue-900/20 blur-[100px]" />
          <div className="absolute bottom-[-80px] right-[-80px] w-[320px] h-[320px] rounded-full bg-blue-800/20 blur-[80px]" />
          {/* Grid sutil */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-550 to-blue-600 flex items-center justify-center shadow-apple">
              <span className="text-white font-bold text-sm">FC</span>
            </div>
            <div>
              <span className="text-white font-bold text-xl tracking-tight">FaChat</span>
              <p className="text-gray-400 text-xs font-medium">Panel de Control</p>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <h1 className="text-5xl font-bold text-white leading-tight tracking-tight">
            Tu restaurante,<br />
            <span className="text-blue-400">automatizado</span><br />
            con IA.
          </h1>
          <p className="text-gray-400 mt-6 text-lg leading-relaxed max-w-sm">
            Gestioná pedidos, menú y configuración desde un único panel. Tu asistente de WhatsApp trabaja 24/7.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="flex -space-x-3">
            {["#3b82f6","#10b981","#f59e0b"].map((c,i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-gray-800 shadow-apple" style={{backgroundColor: c}} />
            ))}
          </div>
          <p className="text-gray-400 text-sm font-medium">Más de 30 restaurantes confían en FaChat</p>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-900">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-550 to-blue-600 flex items-center justify-center shadow-apple">
              <span className="text-white font-bold text-sm">FC</span>
            </div>
            <div>
              <span className="text-white font-bold text-xl tracking-tight">FaChat</span>
              <p className="text-gray-400 text-xs font-medium">Panel de Control</p>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight">Bienvenido de vuelta</h1>
            <p className="text-gray-400 mt-2">Ingresá con tu cuenta del panel.</p>
          </div>

          <div className="bg-gray-800 rounded-3xl shadow-apple-lg p-8 border border-gray-700">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mirestaurante.com"
                  className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 pr-12"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-2xl bg-red-900/30 border border-red-700 text-red-300 text-sm font-medium animate-slide-up">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-550 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-apple hover:shadow-apple-lg transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>Ingresar al Panel <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
