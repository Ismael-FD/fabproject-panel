import axios from 'axios';
import { getToken, removeToken } from './auth';

// Estas URLs vienen del backend documentado. Cambia la variable de entorno
// NEXT_PUBLIC_API_URL en caso de que use un ngrok distinto (se requiere reiniciar el servidor de Next.js).
export const DEFAULT_API_URL = "https://manlessly-unparadoxal-leeann.ngrok-free.dev";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;

if (!process.env.NEXT_PUBLIC_API_URL) {
  // Solo para desarrollo: alerta si no se especificó variable de entorno.
  console.warn("NEXT_PUBLIC_API_URL no está definida. Usando DEFAULT_API_URL:", API_BASE_URL);
}

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
    },
});

// Request interceptor to add the auth token header to every request
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to catch any 401 Unauthorized errors and force a logout
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            removeToken();
            // Solo hacer el redirect al login si estamos en el navegador
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;