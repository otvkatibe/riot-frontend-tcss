import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LoadingSpinner } from "../components/LoadingSpinner";

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