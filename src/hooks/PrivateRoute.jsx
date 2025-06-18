import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LoadingSpinner } from "../components/LoadingSpinner";

/**
 * Componente de Rota Privada.
 * Redireciona para a página de login se o usuário não estiver autenticado.
 * Exibe um spinner de carregamento enquanto o estado de autenticação é verificado.
 * @param {{ children: React.ReactNode }} props - O componente filho a ser renderizado se autenticado.
 * @returns {JSX.Element | null} O componente filho ou um redirecionamento.
 */
export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth(); // Usar isAuthenticated em vez de user diretamente

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; // Adicionado replace para melhor histórico de navegação
  }

  return children;
}