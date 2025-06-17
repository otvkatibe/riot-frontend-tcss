import { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import { SearchBar } from "../components/SearchBar";
import { PlayerCard } from "../components/PlayerCard";
import { LoadingSpinner } from "../components/LoadingSpinner"; // Ou seu Loading.jsx
import { HextechIcon } from "../components/icons/HextechIcon";
import { searchPlayer } from "../api/RiotApi"; // API atualizada
import { useAuth } from "../contexts/AuthContext"; // Para saber se está autenticado

export default function Home() {
  const [playerData, setPlayerData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth(); // Para o PlayerCard

  const handleSearch = async ({ gameName, tagLine }) => {
    setIsLoading(true);
    setPlayerData(null);
    try {
      const data = await searchPlayer(gameName, tagLine); // Usa a função de API combinada
      setPlayerData(data);
      toast.success("Invocador encontrado!");
    } catch (error) {
      toast.error(error.message || "Erro ao buscar invocador.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-lolblue flex flex-col items-center justify-center text-lolgold">
      <div className="flex-grow flex flex-col items-center justify-center p-4 text-center">
        <div className="w-24 h-24 mb-6 animate-pulse">
          {" "}
          {/* Adicionar keyframes para pulse se necessário */}
          <HextechIcon />
        </div>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-theme-gold-text mb-2">
          Verifique as Estatísticas
        </h2>
        <p className="text-theme-primary-text max-w-2xl mb-8">
          Insira o Nome de Invocador e a tag para ver o ranque, histórico e mais.
        </p>
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        <div className="mt-8 w-full max-w-2xl">
          {isLoading && <LoadingSpinner />}
          {playerData && (
            <PlayerCard
              player={playerData}
              isAuthenticated={isAuthenticated}
              isFavorited={false} /* Não há favoritos aqui */
            />
          )}
        </div>
      </div>
      <div className="flex gap-4">
        <Link
          to="/login"
          className="px-6 py-2 bg-lolgold text-lolblue rounded font-bold hover:bg-yellow-600 transition"
        >
          Entrar
        </Link>
        <Link
          to="/register"
          className="px-6 py-2 border border-lolgold rounded font-bold hover:bg-lolgold hover:text-lolblue transition"
        >
          Registrar
        </Link>
      </div>
    </div>
  );
}