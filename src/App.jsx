import { AuthProvider } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./hooks/PrivateRoute";

import { Header } from "./components/Header";
import { Footer } from "./components/Footer"; 

import "react-toastify/dist/ReactToastify.css";

/**
 * Componente principal que configura o provedor de autenticação, o roteamento
 * e a estrutura de layout geral da aplicação (Header, main, Footer).
 * @returns {JSX.Element} O componente raiz da aplicação.
 */
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen w-full flex flex-col font-sans bg-theme-bg text-theme-primary-text">
          <Header />
          <main className="flex-grow flex flex-col">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
          <ToastContainer theme="colored" position="bottom-right" autoClose={3000} hideProgressBar={false} />
        </div>
      </Router>
    </AuthProvider>
  );
}
