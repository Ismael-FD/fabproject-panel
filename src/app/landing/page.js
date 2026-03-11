"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Bot, Store, Clock, CreditCard, Shield, Zap, CheckCircle2, Star, TrendingUp } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-apple">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">FaChat</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-400 hover:text-white transition-colors">Características</a>
              <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">Cómo funciona</a>
              <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Precios</a>
            </nav>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                Iniciar sesión
              </Link>
              <Link 
                href="/onboarding" 
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold bg-gradient-to-r from-blue-550 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all shadow-apple hover:shadow-apple-lg active:scale-[0.98]"
              >
                Crear restaurante
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900/50 border border-blue-700 rounded-full text-sm font-medium text-blue-400 mb-6">
              <Zap className="w-4 h-4" />
              IA para restaurantes
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Tu asistente
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"> WhatsApp</span>
              <br />
              inteligente
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              Automatiza tus pedidos con IA. Recibe órdenes por WhatsApp 24/7, 
              gestiona el menú y aumenta tus ventas sin esfuerzo.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/onboarding" 
                className="flex items-center gap-3 px-8 py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-blue-550 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all shadow-apple-xl hover:shadow-apple-2xl active:scale-[0.98]"
              >
                Comenzar gratis
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#how-it-works" className="flex items-center gap-2 px-6 py-4 text-lg font-medium text-gray-400 hover:text-white transition-colors">
                Ver demo
                <Bot className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-900 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-900 rounded-full filter blur-3xl"></div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Todo lo que necesitas para vender más
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Potencia tu restaurante con tecnología de última generación
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800 border border-gray-700 rounded-3xl p-8 shadow-apple hover:shadow-apple-lg transition-all duration-300 hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mb-6">
                <Bot className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Asistente IA</h3>
              <p className="text-gray-400 leading-relaxed">
                Atiende clientes 24/7 con un bot inteligente que entiende pedidos, 
                responde preguntas y gestiona el menú automáticamente.
              </p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-3xl p-8 shadow-apple hover:shadow-apple-lg transition-all duration-300 hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center mb-6">
                <Store className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Panel de control</h3>
              <p className="text-gray-400 leading-relaxed">
                Gestiona pedidos, actualiza el menú y analiza métricas en tiempo real 
                desde un dashboard intuitivo y profesional.
              </p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-3xl p-8 shadow-apple hover:shadow-apple-lg transition-all duration-300 hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Delivery automático</h3>
              <p className="text-gray-400 leading-relaxed">
                Calcula costos de envío, gestiona zonas de cobertura y coordina 
                entregas sin intervención manual.
              </p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-3xl p-8 shadow-apple hover:shadow-apple-lg transition-all duration-300 hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 flex items-center justify-center mb-6">
                <CreditCard className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Pagos integrados</h3>
              <p className="text-gray-400 leading-relaxed">
                Acepta múltiples métodos de pago, genera links de pago automáticos 
                y sincroniza con tus sistemas contables.
              </p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-3xl p-8 shadow-apple hover:shadow-apple-lg transition-all duration-300 hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Análisis y métricas</h3>
              <p className="text-gray-400 leading-relaxed">
                Visualiza ventas, tendencias y comportamiento de clientes con 
                reportes detallados y recomendaciones inteligentes.
              </p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-3xl p-8 shadow-apple hover:shadow-apple-lg transition-all duration-300 hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Seguridad y respaldo</h3>
              <p className="text-gray-400 leading-relaxed">
                Tus datos están protegidos con encriptación de nivel bancario 
                y respaldos automáticos diarios.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 lg:py-32 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Comienza en 3 pasos simples
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Configura tu restaurante y empieza a recibir pedidos en minutos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-6 shadow-apple-lg">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Regístrate</h3>
              <p className="text-gray-400 leading-relaxed">
                Crea tu cuenta en menos de 2 minutos. Solo necesitas tu email y datos básicos del restaurante.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-apple-lg">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Configura</h3>
              <p className="text-gray-400 leading-relaxed">
                Personaliza tu menú, horarios, precios y el tono de tu asistente IA.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-6 shadow-apple-lg">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Vende</h3>
              <p className="text-gray-400 leading-relaxed">
                Recibe tu número dedicado de WhatsApp y empieza a vender automáticamente 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Restaurantes que ya crecen con nosotros
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Únete a cientos de restaurantes que automatizaron sus ventas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 border border-gray-700 rounded-3xl p-8 shadow-apple">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">
                &quot;Nuestras ventas aumentaron un 40% desde que implementamos el bot.
                Los clientes adoran poder pedir a cualquier hora sin esperar.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
                <div>
                  <p className="font-semibold text-white">Carlos Mendoza</p>
                  <p className="text-sm text-gray-400">La Burguesía</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-3xl p-8 shadow-apple">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">
                &quot;El panel de control es increíble. Puedo gestionar todo desde mi celular
                y las métricas me ayudan a tomar mejores decisiones.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600"></div>
                <div>
                  <p className="font-semibold text-white">María García</p>
                  <p className="text-sm text-gray-400">Sushi Express</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-3xl p-8 shadow-apple">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">
                &quot;La integración con pagos es perfecta. Ya no perdemos pedidos por
                problemas con el efectivo y todo queda registrado.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600"></div>
                <div>
                  <p className="font-semibold text-white">Roberto Díaz</p>
                  <p className="text-sm text-gray-400">Pizza Palace</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            ¿Listo para automatizar tu restaurante?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Únete a la revolución del delivery inteligente. 
            Empieza gratis y paga solo cuando vendas.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/onboarding" 
              className="flex items-center gap-3 px-8 py-4 rounded-2xl text-lg font-semibold bg-white text-blue-600 hover:bg-gray-100 transition-all shadow-apple-xl hover:shadow-apple-2xl active:scale-[0.98]"
            >
              Comenzar ahora
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2 text-white">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm">Sin tarjeta de crédito</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">FaChat</span>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md">
                Transformamos restaurantes con inteligencia artificial. 
                Automatiza tus ventas y enfócate en lo que mejor sabes hacer: cocinar.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Producto</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-white transition-colors">Características</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Precios</a></li>
                <li><a href="/onboarding" className="hover:text-white transition-colors">Comenzar</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Ayuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 FaChat. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
