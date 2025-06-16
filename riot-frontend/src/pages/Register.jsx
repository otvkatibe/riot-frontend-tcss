import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(email, password, username);
      toast.success("Conta criada com sucesso!");
      navigate("/dashboard");
    } catch {
      toast.error("Erro ao registrar. Tente outro e-mail.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-lolblue flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-lolblack p-8 rounded shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-lolgold mb-6">Registrar</h2>
        <input
          className="w-full mb-4 p-2 rounded bg-lolgray text-lolblue"
          type="text"
          placeholder="Nome de usuário"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          className="w-full mb-4 p-2 rounded bg-lolgray text-lolblue"
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full mb-6 p-2 rounded bg-lolgray text-lolblue"
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-lolgold text-lolblue font-bold py-2 rounded hover:bg-yellow-600 transition"
          disabled={loading}
        >
          {loading ? "Registrando..." : "Registrar"}
        </button>
        <p className="mt-4 text-lolgray text-sm">
          Já tem conta? <Link to="/login" className="text-lolgold underline">Entrar</Link>
        </p>
      </form>
    </div>
  );
}