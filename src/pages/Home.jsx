import { useState } from "react";
import { toast } from "react-toastify";

import { SearchBar } from "../components/SearchBar";
import { PlayerCard } from "../components/PlayerCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { HextechIcon } from "../components/icons/HextechIcon";
import { searchPlayer, getChampionMastery, getChampionStats } from "../api/RiotApi";
import { useAuth } from "../contexts/AuthContext";
import { MasteryList } from "../components/MasteryList";
import { ChampionStatsModal } from "../components/ChampionStatsModal";
import { ChallengerList } from "../components/ChallengerList"; // Importar

/**
 * Página inicial da aplicação.
 * Permite que usuários não autenticados pesquisem por jogadores e vejam suas estatísticas
 * e maestrias. Também inclui um modal para exibir detalhes de um campeão específico.
 * @returns {JSX.Element} A página inicial.
 */
export default function Home() {
  const [playerData, setPlayerData] = useState(null);
  const [masteryData, setMasteryData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChampion, setSelectedChampion] = useState(null);
  const [championStats, setChampionStats] = useState(null);
  const [isStatsLoading, setIsStatsLoading] = useState(false);

  /**
   * Lida com a busca de um jogador, buscando dados do perfil e maestrias em paralelo.
   * @param {{ gameName: string, tagLine: string }} searchData - Os dados da busca.
   */
  const handleSearch = async ({ gameName, tagLine }) => {
    setIsLoading(true);
    setPlayerData(null);
    setMasteryData(null);
    try {
      const [player, mastery] = await Promise.all([
        searchPlayer(gameName, tagLine),
        getChampionMastery(gameName, tagLine),
      ]);

      setPlayerData(player);
      setMasteryData(mastery);
      toast.success("Invocador encontrado!");
    } catch (error) {
      toast.error(error.message || "Erro ao buscar invocador.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Lida com o clique em um campeão na lista de maestrias, abrindo um modal
   * com as estatísticas detalhadas daquele campeão.
   * @param {object} champion - O objeto do campeão clicado.
   */
  const handleChampionClick = async (champion) => {
    if (!playerData) return;
    setSelectedChampion(champion);
    setIsModalOpen(true);
    setIsStatsLoading(true);
    try {
      const stats = await getChampionStats(playerData.gameName, playerData.tagLine, champion.championIcon);
      setChampionStats(stats);
    } catch (error) {
      toast.error(error.message || "Erro ao buscar estatísticas do campeão.");
      handleCloseModal();
    } finally {
      setIsStatsLoading(false);
    }
  };

  /**
   * Fecha o modal de estatísticas do campeão e limpa os estados relacionados.
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedChampion(null);
    setChampionStats(null);
  };

  return (
    <div className="flex-grow flex flex-col p-4">
      <div className="max-w-2xl w-full mx-auto text-center">
        <div className="w-24 h-24 mb-6 mx-auto animate-pulse">
          <HextechIcon />
        </div>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-theme-gold-text mb-2">
          Verifique as Estatísticas
        </h2>
        <p className="text-theme-primary-text mb-8">
          Insira o Nome de Invocador e a tag para ver o ranque, histórico e mais.
        </p>
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
      </div>

      <div className="mt-8 w-full max-w-2xl mx-auto">
        {isLoading && <LoadingSpinner />}
        {playerData && (
          <>
            <PlayerCard
              player={playerData}
              isAuthenticated={isAuthenticated}
              isFavorited={false}
            />
            <MasteryList 
              masteryData={masteryData} 
              onChampionClick={handleChampionClick} 
            />
          </>
        )}
      </div>
      
      <ChampionStatsModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isLoading={isStatsLoading}
        stats={championStats}
        champion={selectedChampion}
      />
      <ChallengerList />
    </div>
  );
}