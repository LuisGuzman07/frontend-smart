// axiosConfig.js
import axios from "axios";

// 1) Lee la base desde Vite (debe existir en build)
const RAW_BASE = import.meta.env.VITE_API_URL; // ej: https://tu-backend.up.railway.app/api/

if (!RAW_BASE) {
  // Si esto salta en prod es porque la env no estaba al momento de build
  throw new Error("VITE_API_URL no definida. Configúrala en Railway y vuelve a construir.");
}

// 2) Normaliza unión base + rutas (evita 'undefinedtoken/' y problemas de slash)
const join = (base, path) => new URL(String(path).replace(/^\//, ""), base).toString();
const API_BASE_URL = RAW_BASE.endsWith("/") ? RAW_BASE : RAW_BASE + "/";

// (opcional) Log solo en dev
if (import.meta.env.MODE !== "production") {
  // Debe verse .../api/
  console.log("[API] base =", API_BASE_URL);
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // déjalo si usas cookies; no molesta con Bearer
  headers: { "Content-Type": "application/json" },
});

// --- Interceptor: Authorization Bearer ---
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- Interceptor: refresh automático en 401 ---
apiClient.interceptors.response.use(
  (r) => r,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status !== 401) return Promise.reject(error);

    const access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");

    // sin access -> al login
    if (!access) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (refresh && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Instancia "limpia" para el refresh (sin interceptores)
        const refreshAxios = axios.create({ baseURL: API_BASE_URL });

        // IMPORTANTE: ruta relativa sin "/" inicial para respetar el /api/
        const resp = await refreshAxios.post("token/refresh/", { refresh });
        const { access: newAccess } = resp.data;

        if (newAccess) {
          localStorage.setItem("access", newAccess);
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return apiClient(originalRequest);
        }
      } catch (err) {
        // falló el refresh → limpiar y redirigir
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    // No hay refresh o ya se intentó
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "/login";
    return Promise.reject(error);
  }
);

export default apiClient;

// Endpoints de conveniencia (para evitar concatenaciones manuales)
export const endpoints = {
  login: "token/",           // POST
  refresh: "token/refresh/", // POST
  // otros: "users/", "orders/", ...
};
