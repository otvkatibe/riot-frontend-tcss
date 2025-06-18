import { createContext, useContext, useState, useEffect } from "react";
import { getMe, login as apiLogin, register as apiRegister, logoutUser as apiLogout } from "../api/Auth"; // Funções atualizadas
import { toast } from "react-toastify";

const AuthContext = createContext(null);

/**
 * Provedor de autenticação que gerencia o estado do usuário (usuário, token, loading).
 * Fornece funções de login, logout e registro para os componentes filhos.
 * @param {{ children: React.ReactNode }} props - Os componentes filhos que terão acesso ao contexto.
 * @returns {JSX.Element} O provedor de contexto.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('userToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    const storedToken = localStorage.getItem('userToken');

    if (storedToken) {
      setToken(storedToken);
      if (storedUser && storedUser !== 'undefined') {
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
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const validateTokenAndFetchUser = async () => {
      const currentToken = localStorage.getItem('userToken');
      if (currentToken && !user) {
        setLoading(true);
        try {
          const userDataFromApi = await getMe();
          setUser(userDataFromApi);
          localStorage.setItem('userData', JSON.stringify(userDataFromApi));
        } catch (error) {
          console.error("Sessão inválida ou expirada:", error);
          localStorage.removeItem('userToken');
          localStorage.removeItem('userData');
          setToken(null);
          setUser(null);
        } finally {
          setLoading(false);
        }
      } else if (!currentToken) {
        setUser(null);
        localStorage.removeItem('userData');
      }
    };

    validateTokenAndFetchUser();
  }, [token]);


  /**
   * Realiza o login do usuário, obtém um token e o armazena.
   * @param {string} email - O email do usuário.
   * @param {string} password - A senha do usuário.
   * @returns {Promise<{token: string}>} O token de autenticação.
   */
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await apiLogin(email, password);
      const { token: authToken, message } = response;

      if (!authToken) {
        throw new Error(message || "Token não recebido do servidor.");
      }

      setToken(authToken);
      localStorage.setItem('userToken', authToken);
      
      toast.success(message || 'Login realizado com sucesso!');
      
      return { token: authToken }; 

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Erro ao fazer login.";
      toast.error(errorMessage);
      
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      setUser(null);
      setToken(null);
      throw error; 
    } finally {
      setLoading(false);
    }
  };

  /**
   * Registra um novo usuário no sistema.
   * @param {string} email - O email do novo usuário.
   * @param {string} password - A senha do novo usuário.
   * @param {string} name - O nome do novo usuário.
   */
  const register = async (email, password, name) => {
    setLoading(true);
    try {
      await apiRegister(email, password, name);
      toast.success('Registro realizado com sucesso! Por favor, faça o login.');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Erro ao registrar.";
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Desconecta o usuário, limpando o token e os dados do estado e do localStorage.
   */
  const logout = async () => {
    setLoading(true);
    await apiLogout();
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

/**
 * Hook customizado para acessar o contexto de autenticação.
 * @returns {object} O valor do contexto de autenticação.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}