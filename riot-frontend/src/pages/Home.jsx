import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-lolblue flex flex-col items-center justify-center text-lolgold">
      <h1 className="text-4xl font-bold mb-6">Bem-vindo ao Riot Dashboard</h1>
      <p className="mb-8 text-lolgray">Gerencie seus favoritos do LoL com estilo!</p>
      <div className="flex gap-4">
        <Link to="/login" className="px-6 py-2 bg-lolgold text-lolblue rounded font-bold hover:bg-yellow-600 transition">Entrar</Link>
        <Link to="/register" className="px-6 py-2 border border-lolgold rounded font-bold hover:bg-lolgold hover:text-lolblue transition">Registrar</Link>
      </div>
    </div>
  );
}