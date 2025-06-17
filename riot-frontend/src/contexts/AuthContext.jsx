import { createContext, useContext, useState, useEffect } from "react";
import { getMe, login as apiLogin, register as apiRegister, logoutUser as apiLogout } from "../api/Auth"; // Funções atualizadas
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('userToken'));
  const [loading, setLoading] = useState(true); // Renomeado de isAuthLoading para loading

  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (token && storedUser && storedUser !== 'undefined') {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Falha ao analisar dados do usuário do localStorage", error);
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        setToken(null);
        setUser(null);
      }
    }
    setLoading(false);
  }, [token]);

  // Opcional: verificar token com o backend ao carregar
  useEffect(() => {
    if (token && !user) { // Se temos token mas não usuário (ex: refresh da página)
      setLoading(true);
      getMe()
        .then(userData => {
          setUser(userData);
          localStorage.setItem('userData', JSON.stringify(userData));
        })
        .catch(() => {
          // Token inválido ou expirado
          localStorage.removeItem('userToken');
          localStorage.removeItem('userData');
          setToken(null);
          setUser(null);
          toast.error("Sua sessão expirou. Por favor, faça login novamente.");
        })
        .finally(() => setLoading(false));
    }
  }, [token, user]);


  const login = async (email, password) => {
    setLoading(true);
    try {
      const { token: authToken, user: userData } = await apiLogin(email, password);
      setUser(userData);
      setToken(authToken);
      localStorage.setItem('userToken', authToken);
      localStorage.setItem('userData', JSON.stringify(userData));
      toast.success('Login realizado com sucesso!');
      return { token: authToken, user: userData }; // Retornar dados para uso imediato se necessário
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Erro ao fazer login.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, name) => {
    setLoading(true);
    try {
      // A API de registro do backend já faz login e retorna token e usuário
      const { token: authToken, user: userData } = await apiRegister(email, password, name);
      setUser(userData);
      setToken(authToken);
      localStorage.setItem('userToken', authToken);
      localStorage.setItem('userData', JSON.stringify(userData));
      toast.success('Registro e login realizados com sucesso!');
      return { token: authToken, user: userData };
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Erro ao registrar.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    await apiLogout(); // Limpa localStorage
    setUser(null);
    setToken(null);
    toast.info('Você foi desconectado.');
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}