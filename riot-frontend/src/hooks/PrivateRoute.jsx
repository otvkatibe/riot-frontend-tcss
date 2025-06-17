import axios from "axios";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LoadingSpinner } from "../components/LoadingSpinner"; // Alterado para importação nomeada

const API = axios.create({
  baseURL: "https://riot-backend.vercel.app/", // ajuste se necessário
  withCredentials: true,
});

export const login = async (email, password) => {
  const { data } = await API.post("/auth/login", { email, password });
  return data;
};

export const register = async (email, password, username) => {
  const { data } = await API.post("/auth/register", { email, password, username });
  return data;
};

export const getProfile = async () => {
  const { data } = await API.get("/auth/profile");
  return data;
};

export const logout = async () => {
  await API.post("/auth/logout");
};

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />; // Alterado para usar LoadingSpinner
  if (!user) return <Navigate to="/login" />;
  return children;
}