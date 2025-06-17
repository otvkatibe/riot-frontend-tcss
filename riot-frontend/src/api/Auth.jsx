import axios from "axios";

const API = axios.create({
  baseURL: "https://riot-backend.vercel.app", // Ou seu VITE_API_BASE_URL
  withCredentials: true,
});

// Adiciona um interceptor para incluir o token JWT nas requisições, se disponível
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export const login = async (email, password) => {
  const { data } = await API.post("/user/login", { email, password });
  return data; // Espera-se { token, user }
};

export const register = async (email, password, name) => {
  const { data } = await API.post("/user/register", { email, password, name });
  return data; // Espera-se { token, user }
};

// Rota para buscar dados do usuário autenticado (exemplo, backend precisa implementar /user/me)
export const getMe = async () => {
  const { data } = await API.get("/user/me"); // Ajuste este endpoint conforme seu backend
  return data;
};

export const logoutUser = async () => {
  // Logout é principalmente client-side para JWT, mas pode chamar um endpoint se o backend invalidar tokens
  // await API.post("/user/logout"); // Se existir no backend
  localStorage.removeItem("userToken");
  localStorage.removeItem("userData");
};

export default API; // Exporte a instância para ser usada em outros arquivos de API
