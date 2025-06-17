import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../components/LoadingSpinner";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // 'name' como no AuthForm do usuário
  const { register, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await register(email, password, name);
      // O toast de sucesso já está no AuthContext
      navigate("/login"); // Redireciona para a página de login
    } catch (error) {
      // O toast de erro já está no AuthContext
      // Nenhuma ação adicional necessária aqui, pois o toast já foi exibido
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const isLoading = authLoading || isSubmitting;

  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-theme-input-bg border-2 border-theme-border p-6 sm:p-8 rounded-lg shadow-2xl shadow-black/50">
        <h2 className="text-3xl font-bold text-theme-gold-text mb-6 text-center">Criar Conta</h2>
        <div className="mb-4">
          <label className="text-theme-primary-text block mb-2">Nome</label>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            className="w-full p-3 bg-theme-input-bg border border-theme-border rounded-md text-theme-primary-text focus:outline-none focus:ring-2 focus:ring-theme-border" 
            required 
            disabled={isLoading}
          />
        </div>
        <div className="mb-4">
          <label className="text-theme-primary-text block mb-2">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            className="w-full p-3 bg-theme-input-bg border border-theme-border rounded-md text-theme-primary-text focus:outline-none focus:ring-2 focus:ring-theme-border" 
            required 
            disabled={isLoading}
          />
        </div>
        <div className="mb-6">
          <label className="text-theme-primary-text block mb-2">Senha</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            className="w-full p-3 bg-theme-input-bg border border-theme-border rounded-md text-theme-primary-text focus:outline-none focus:ring-2 focus:ring-theme-border" 
            required 
            disabled={isLoading}
          />
        </div>
        <button 
          type="submit" 
          disabled={isLoading} 
          className="w-full p-3 bg-theme-button-bg text-theme-gold-text border-2 border-theme-border rounded-md font-bold transition-all duration-300 hover:bg-theme-button-hover disabled:opacity-50 flex justify-center items-center h-12"
        >
          {isLoading ? <LoadingSpinner size="small" /> : 'Registrar'}
        </button>
        <p className="mt-6 text-center text-sm sm:text-base text-theme-primary-text">
          Já tem uma conta?{" "}
          <Link to="/login" className="text-theme-gold-text cursor-pointer hover:underline">
            Faça Login
          </Link>
        </p>
      </form>
    </div>
  );
}