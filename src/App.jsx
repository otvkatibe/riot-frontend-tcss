import { AuthProvider } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/Home"; // Renomeado para HomePage
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./hooks/PrivateRoute"; // Seu PrivateRoute existente

import { Header } from "./components/Header"; // Novo Header
import { Footer } from "./components/Footer"; // Novo Footer

import "react-toastify/dist/ReactToastify.css";
// Seu App.css existente pode ser mantido ou removido se não for mais necessário
// import "./App.css"; 

export default function App() {
  return (
    <AuthProvider>
      <Router>
        {/* O div flex container agora engloba Header, main content e Footer */}
        <div className="min-h-screen w-full flex flex-col font-sans bg-theme-bg text-theme-primary-text">
          <Header />
          <main className="flex-grow flex flex-col"> {/* main agora é flex-grow */}
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
              {/* Adicione outras rotas aqui se necessário */}
            </Routes>
          </main>
          <Footer />
          <ToastContainer theme="colored" position="bottom-right" autoClose={3000} hideProgressBar={false} />
        </div>
      </Router>
    </AuthProvider>
  );
}
