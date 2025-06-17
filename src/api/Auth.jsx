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
  // O backend deve retornar { token, user: { id, name, email } }
  const { data } = await API.post("/user/login", { email, password });
  return data; 
};

export const register = async (email, password, name) => {
  // O backend deve retornar algo como { message: "Usuário registrado com sucesso", userId: "..." }
  // Não esperamos um token aqui para evitar login automático.
  const { data } = await API.post("/user/register", { email, password, name });
  return data; 
};

// Rota para buscar dados do usuário autenticado
export const getMe = async () => {
  // Esta rota deve ser protegida no backend e retornar os dados do usuário logado
  // com base no token JWT enviado no header Authorization (o interceptor já faz isso).
  // Exemplo de retorno esperado: { id, name, email }
  const { data } = await API.get("/user/me"); 
  return data;
};

export const logoutUser = async () => {
  // Logout é principalmente client-side para JWT, mas pode chamar um endpoint se o backend invalidar tokens
  // await API.post("/user/logout"); // Se existir no backend
  localStorage.removeItem("userToken");
  localStorage.removeItem("userData");
};

export default API; // Exporte a instância para ser usada em outros arquivos de API
