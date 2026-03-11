import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";

const RestauranteContext = createContext();

export function RestauranteProvider({ children }) {
  const [restaurante, setRestaurante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const fetchRestaurante = useCallback(async () => {
    try {
      const response = await api.get("/restaurantes/mi-restaurante");
      setRestaurante(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching restaurante:", error);
      return null;
    }
  }, []);

  useEffect(() => {
    const initializeRestaurante = async () => {
      if (!isAuthenticated()) {
        setLoading(false);
        return;
      }

      setLoading(true);
      await fetchRestaurante();
      setLoading(false);
    };
    initializeRestaurante();
  }, [fetchRestaurante]);

  const updateRestaurante = useCallback((data) => {
    setRestaurante(prev => {
      if (!prev) return data;
      const updated = { ...prev, ...data };
      console.log("Contexto actualizado:", updated);
      return updated;
    });
    // Fuerza una actualización del componente
    setUpdateTrigger(prev => prev + 1);
  }, []);

  const refetchRestaurante = useCallback(async () => {
    setLoading(true);
    const data = await fetchRestaurante();
    setLoading(false);
    return data;
  }, [fetchRestaurante]);

  const value = {
    restaurante,
    loading,
    updateRestaurante,
    refetchRestaurante,
    fetchRestaurante,
    updateTrigger
  };

  return (
    <RestauranteContext.Provider value={value}>
      {children}
    </RestauranteContext.Provider>
  );
}

export function useRestaurante() {
  const context = useContext(RestauranteContext);
  if (!context) {
    throw new Error("useRestaurante debe ser usado dentro de RestauranteProvider");
  }
  return context;
}

