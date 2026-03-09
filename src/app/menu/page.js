"use client";

import { useEffect, useState } from "react";
import PanelLayout from "@/components/layout/PanelLayout";
import api from "@/lib/api";
import { Plus, Edit2, Trash2, Search, Tag, PackageOpen, X, Check, AlertCircle } from "lucide-react";

function ModalProducto({ categoria, producto, onClose, onSave }) {
  const [form, setForm] = useState({
    nombre: producto?.nombre || "",
    descripcion: producto?.descripcion || "",
    precio: producto?.precio?.toString() || "",
    disponible: producto?.disponible ?? true,
  });
  const [saving, setSaving] = useState(false);
  const esEdicion = !!producto;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, precio: parseFloat(form.precio), menu_id: categoria.id };
      if (esEdicion) {
        await api.put(`/menu/producto/${producto.id}`, payload);
      } else {
        await api.post("/menu/producto", payload);
      }
      onSave();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-apple-xl w-full max-w-md p-8 z-10 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-neutral-900">{esEdicion ? "Editar producto" : "Nuevo producto"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-2xl transition-colors">
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-neutral-700 block mb-2">Nombre *</label>
            <input
              required
              value={form.nombre}
              onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
              className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="Ej: Hamburguesa clásica"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-neutral-700 block mb-2">Descripción</label>
            <textarea
              value={form.descripcion}
              onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
              placeholder="Ingredientes o descripción breve"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-neutral-700 block mb-2">Precio (ARS) *</label>
            <input
              required
              type="number"
              min="0"
              step="50"
              value={form.precio}
              onChange={e => setForm(p => ({ ...p, precio: e.target.value }))}
              className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="4500"
            />
          </div>
          <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
            <span className="text-sm text-neutral-700 font-medium">Disponible para pedir</span>
            <button
              type="button"
              onClick={() => setForm(p => ({ ...p, disponible: !p.disponible }))}
              className={`w-12 h-7 rounded-full transition-colors relative ${form.disponible ? "bg-blue-600" : "bg-neutral-300"}`}
            >
              <span className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-apple transition-all ${form.disponible ? "left-5.5" : "left-0.5"}`} />
            </button>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-2xl text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-all border border-neutral-200">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-3 rounded-2xl text-sm font-semibold bg-gradient-to-r from-blue-550 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all disabled:opacity-50 shadow-apple hover:shadow-apple-lg">
              {saving ? "Guardando..." : esEdicion ? "Guardar cambios" : "Crear producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MenuPage() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [modal, setModal] = useState(null); // { categoria, producto? }

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const response = await api.get("/menu");
      setCategorias(response.data);
    } catch {
      setCategorias([
        {
          id: 1, nombre: "Hamburguesas",
          productos: [
            { id: 1, nombre: "Cheeseburger Clásica", precio: 4500, descripcion: "Medallón 150g, cheddar, lechuga, tomate", disponible: true },
            { id: 2, nombre: "Doble Bacon BBQ",      precio: 6500, descripcion: "Dos medallones, bacon, cheddar, salsa BBQ", disponible: true },
          ]
        },
        {
          id: 2, nombre: "Bebidas",
          productos: [
            { id: 3, nombre: "Coca Cola 500ml",   precio: 1200, descripcion: "", disponible: true },
            { id: 4, nombre: "Agua Minalba 500ml", precio: 1000, descripcion: "", disponible: false },
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMenu(); }, []);

  const toggleDisponible = async (productoId, disponible) => {
    try {
      await api.put(`/menu/producto/${productoId}`, { disponible: !disponible });
      setCategorias(prev => prev.map(c => ({
        ...c,
        productos: c.productos?.map(p => p.id === productoId ? { ...p, disponible: !disponible } : p)
      })));
    } catch (err) { console.error(err); }
  };

  const eliminarProducto = async (id) => {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      await api.delete(`/menu/producto/${id}`);
      fetchMenu();
    } catch (err) { console.error(err); }
  };

  const categoriasFiltradas = categorias.map(c => ({
    ...c,
    productos: c.productos?.filter(p =>
      !searchQuery ||
      p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.descripcion?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(c => !searchQuery || c.productos?.length > 0);

  const totalProductos = categorias.reduce((sum, c) => sum + (c.productos?.length || 0), 0);

  return (
    <PanelLayout>
      {modal && (
        <ModalProducto
          categoria={modal.categoria}
          producto={modal.producto}
          onClose={() => setModal(null)}
          onSave={fetchMenu}
        />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Gestión del Menú</h1>
          <p className="text-neutral-500 mt-2">{categorias.length} categorías · {totalProductos} productos</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-white border border-neutral-200 rounded-2xl text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-all shadow-apple">
            <Tag className="w-4 h-4" /> Nueva categoría
          </button>
          <button
            onClick={() => categorias[0] && setModal({ categoria: categorias[0] })}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-550 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl text-sm font-semibold transition-all shadow-apple hover:shadow-apple-lg"
          >
            <Plus className="w-4 h-4" /> Nuevo producto
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-neutral-200 text-neutral-900 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-apple"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <div className="w-12 h-12 rounded-full border-2 border-neutral-200 border-t-blue-550 animate-spin"></div>
        </div>
      ) : categorias.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-neutral-200 rounded-3xl p-16 text-center shadow-apple">
          <PackageOpen className="w-16 h-16 text-neutral-300 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">Tu menú está vacío</h3>
          <p className="text-neutral-500">Comenzá agregando tu primera categoría y producto.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {categoriasFiltradas.map((categoria) => (
            <div key={categoria.id} className="bg-white border border-neutral-200 rounded-3xl overflow-hidden group shadow-apple hover:shadow-apple-lg transition-all">
              <div className="px-6 py-5 flex justify-between items-center border-b border-neutral-100 bg-neutral-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                  <h2 className="text-lg font-bold text-neutral-900">{categoria.nombre}</h2>
                  <span className="text-sm text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">{categoria.productos?.length || 0} productos</span>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-2xl transition-all">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-neutral-400 hover:text-error-600 hover:bg-error-50 rounded-2xl transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setModal({ categoria })}
                    className="ml-2 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
                  >
                    <Plus className="w-4 h-4" /> Agregar
                  </button>
                </div>
              </div>

              <div className="divide-y divide-neutral-100">
                {!categoria.productos?.length ? (
                  <p className="px-6 py-8 text-sm text-neutral-400 text-center">Sin productos en esta categoría.</p>
                ) : categoria.productos.map((producto) => (
                  <div key={producto.id} className="px-6 py-5 flex items-center justify-between gap-4 hover:bg-neutral-50 transition-colors group/item">
                    <div className="flex items-center gap-4 min-w-0">
                      <button
                        onClick={() => toggleDisponible(producto.id, producto.disponible)}
                        title={producto.disponible ? "Marcar como agotado" : "Marcar disponible"}
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center flex-shrink-0 transition-all ${
                          producto.disponible
                            ? "bg-success-500 border-success-500 hover:bg-success-600"
                            : "bg-neutral-100 border-neutral-300 hover:border-neutral-400"
                        }`}
                      >
                        {producto.disponible && <Check className="w-4 h-4 text-white" />}
                      </button>
                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <p className={`text-base font-semibold ${producto.disponible ? "text-neutral-900" : "text-neutral-400 line-through"}`}>
                            {producto.nombre}
                          </p>
                          {!producto.disponible && (
                            <span className="text-xs font-bold uppercase text-error-600 bg-error-100 px-2 py-1 rounded-lg">Agotado</span>
                          )}
                        </div>
                        {producto.descripcion && (
                          <p className="text-sm text-neutral-500 truncate max-w-md mt-1">{producto.descripcion}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <span className="text-lg font-bold text-neutral-900">${producto.precio.toLocaleString()}</span>
                      <div className="flex items-center gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                        <button
                          onClick={() => setModal({ categoria, producto })}
                          className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-2xl transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => eliminarProducto(producto.id)}
                          className="p-2 text-neutral-400 hover:text-error-600 hover:bg-error-50 rounded-2xl transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </PanelLayout>
  );
}
