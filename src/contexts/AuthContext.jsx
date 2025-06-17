import { createContext, useContext, useState, useEffect } from "react";
import { getMe, login as apiLogin, register as apiRegister, logoutUser as apiLogout } from "../api/Auth"; // Funções atualizadas
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('userToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    const storedToken = localStorage.getItem('userToken'); // Pegar o token também

    if (storedToken) {
      setToken(storedToken); // Atualiza o estado do token
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
    setLoading(false); // Inicialmente, paramos o loading após checar o localStorage
  }, []); // Executa apenas uma vez ao montar

  // Validar token com o backend e buscar dados do usuário se o token existir mas o usuário não
  useEffect(() => {
    const validateTokenAndFetchUser = async () => {
      const currentToken = localStorage.getItem('userToken'); // Pega o token mais atual
      if (currentToken && !user) { // Se temos token mas não usuário no estado
        setLoading(true);
        try {
          // Adiciona o token ao header para a chamada getMe
          // O interceptor do Axios em api/Auth.jsx já deve fazer isso se getMe usar a instância API
          const userDataFromApi = await getMe(); // getMe deve usar a instância API configurada com interceptor
          setUser(userDataFromApi); // Assumindo que getMe retorna o objeto do usuário
          localStorage.setItem('userData', JSON.stringify(userDataFromApi));
        } catch (error) {
          console.error("Sessão inválida ou expirada:", error);
          localStorage.removeItem('userToken');
          localStorage.removeItem('userData');
          setToken(null);
          setUser(null);
          // Não mostra toast aqui para não poluir em cada carregamento de página não autenticada
        } finally {
          setLoading(false);
        }
      } else if (!currentToken) {
        // Se não há token, garante que o usuário também não está definido
        setUser(null);
        localStorage.removeItem('userData'); // Limpa por segurança
      }
    };

    validateTokenAndFetchUser();
  }, [token]); // Re-executa se o estado do token mudar (ex: após login/logout)


  const login = async (email, password) => {
    setLoading(true);
    try {
      // apiLogin já deve usar a instância do Axios com a baseURL correta
      const response = await apiLogin(email, password); // Backend retorna { token, user }
      const { token: authToken, user: userData } = response;

      if (!authToken || !userData) {
        throw new Error("Resposta de login inválida do servidor.");
      }

      setUser(userData);
      setToken(authToken);
      localStorage.setItem('userToken', authToken);
      localStorage.setItem('userData', JSON.stringify(userData));
      toast.success('Login realizado com sucesso!');
      return { token: authToken, user: userData };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Erro ao fazer login.";
      toast.error(errorMessage);
      // Limpar qualquer resquício em caso de falha
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      setUser(null);
      setToken(null);
      throw error; // Re-throw para a página de Login lidar se necessário
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, name) => {
    setLoading(true);
    try {
      // A API de registro do backend (apiRegister) deve apenas criar o usuário
      // e não retornar token ou dados de usuário para login automático.
      // Se o backend retornar, nós simplesmente não os usaremos para logar.
      await apiRegister(email, password, name); // Espera-se que retorne algo como { message: "Usuário registrado..." }
      
      toast.success('Registro realizado com sucesso! Por favor, faça o login.');
      // Não define usuário ou token aqui para evitar login automático
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Erro ao registrar.";
      toast.error(errorMessage);
      throw error; // Re-throw para a página de Registro lidar se necessário
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    // apiLogout pode ser uma chamada ao backend para invalidar o token (se implementado)
    // ou apenas limpar o lado do cliente.
    await apiLogout(); // Limpa localStorage em api/Auth.jsx
    setUser(null);
    setToken(null);
    // localStorage já foi limpo por apiLogout
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