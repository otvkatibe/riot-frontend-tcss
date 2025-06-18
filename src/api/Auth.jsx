/**
 * Módulo de API para endpoints relacionados à autenticação.
 */
import axios from "axios";

const API = axios.create({
  baseURL: "https://riot-backend.vercel.app",
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

/**
 * Envia uma requisição de login para a API.
 * @param {string} email - O email do usuário.
 * @param {string} password - A senha do usuário.
 * @returns {Promise<object>} A resposta da API, contendo o token.
 */
export const login = async (email, password) => {
  // O backend deve retornar { token, user: { id, name, email } }
  const { data } = await API.post("/user/login", { email, password });
  return data; 
};

/**
 * Envia uma requisição de registro para a API.
 * @param {string} email - O email do novo usuário.
 * @param {string} password - A senha do novo usuário.
 * @param {string} name - O nome do novo usuário.
 * @returns {Promise<object>} A resposta da API.
 */
export const register = async (email, password, name) => {
  // O backend deve retornar algo como { message: "Usuário registrado com sucesso", userId: "..." }
  // Não esperamos um token aqui para evitar login automático.
  const { data } = await API.post("/user/register", { email, password, name });
  return data; 
};

/**
 * Busca os dados do usuário autenticado na API.
 * Requer um token JWT válido no header da requisição.
 * @returns {Promise<object>} Os dados do usuário (id, name, email).
 */
export const getMe = async () => {
  // Esta rota deve ser protegida no backend e retornar os dados do usuário logado
  // com base no token JWT enviado no header Authorization (o interceptor já faz isso).
  // Exemplo de retorno esperado: { id, name, email }
  const { data } = await API.get("/user/me"); 
  return data;
};

/**
 * Realiza o logout do usuário, limpando os dados do localStorage.
 */
export const logoutUser = async () => {
  // Logout é principalmente client-side para JWT, mas pode chamar um endpoint se o backend invalidar tokens
  // await API.post("/user/logout"); // Se existir no backend
  localStorage.removeItem("userToken");
  localStorage.removeItem("userData");
};

export default API; // Exporte a instância para ser usada em outros arquivos de API
