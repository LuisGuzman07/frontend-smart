import apiClient, { endpoints } from "./axiosConfig";

async function login(username, password) {
  try {
    // Llama al endpoint centralizado del login
    const res = await apiClient.post(endpoints.login, {
      username,
      password,
    });

    const { access, refresh } = res.data;

    // Guarda los tokens
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);

    console.log("✅ Login exitoso: tokens guardados correctamente.");
    return true;
  } catch (err) {
    const message = err.response?.data || err.message;
    console.error("❌ Error al iniciar sesión:", message);
    return false;
  }
}

export default login;
