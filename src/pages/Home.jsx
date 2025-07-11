import { useState } from "react";
import { toast } from "react-toastify";

import { SearchBar } from "../components/SearchBar";
import { PlayerCard } from "../components/PlayerCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { HextechIcon } from "../components/icons/HextechIcon";
import { searchPlayer, getChampionMastery, getChampionStats, getPlayerHistory } from "../api/RiotApi";
import { useAuth } from "../contexts/AuthContext";
import { MasteryList } from "../components/MasteryList";
import { ChampionStatsModal } from "../components/ChampionStatsModal";
import { ChallengerList } from "../components/ChallengerList"; // Importar
import { PlayerHistoryModal } from "../components/PlayerHistoryModal";

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

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyData, setHistoryData] = useState(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

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

  const handleOpenHistory = async () => {
    if (!playerData) return;
    setIsHistoryOpen(true);
    setIsHistoryLoading(true);
    try {
      const data = await getPlayerHistory(playerData.gameName, playerData.tagLine);
      setHistoryData(data);
    } catch (error) {
      toast.error("Erro ao buscar histórico geral.");
      setIsHistoryOpen(false);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const handleCloseHistory = () => {
    setIsHistoryOpen(false);
    setHistoryData(null);
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
            {/* Botão para ver histórico geral */}
            <button
              className="mt-4 w-full p-3 bg-theme-button-bg text-theme-gold-text border-2 border-theme-border rounded-md font-bold transition-all duration-300 hover:bg-theme-button-hover"
              onClick={handleOpenHistory}
            >
              Ver Histórico Geral Recente
            </button>
            <MasteryList 
              masteryData={masteryData} 
              onChampionClick={handleChampionClick} 
            />
          </>
        )}
      </div>
      {/* Modal simples para histórico geral */}
      {isHistoryOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={handleCloseHistory}>
          <div className="bg-theme-bg border-2 border-theme-border rounded-lg p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <button onClick={handleCloseHistory} className="absolute top-2 right-2 text-theme-primary-text hover:text-theme-gold-text text-2xl z-10">&times;</button>
            {isHistoryLoading ? (
              <LoadingSpinner />
            ) : historyData && historyData.matches ? (
              <div>
                <h2 className="text-2xl font-bold text-theme-gold-text mb-4 text-center">Histórico Geral Recente</h2>
                <ul className="space-y-2">
                  {historyData.matches.map((match, idx) => (
                    <li
                      key={idx}
                      className={`p-3 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ${match.win ? 'bg-green-800/20' : 'bg-red-800/20'}`}
                    >
                      {/* Foto do campeão */}
                      <img
                        src={`https://ddragon.leagueoflegends.com/cdn/14.12.1/img/champion/${match.championName}.png`}
                        alt={match.championName}
                        className="w-12 h-12 rounded-md border-2 border-theme-gold-text mr-2"
                        style={{ minWidth: 48 }}
                      />
                      {/* Stats principais */}
                      <div className="flex flex-col flex-grow">
                        <span className={`font-bold ${match.win ? 'text-green-400' : 'text-red-400'}`}>
                          {match.win ? 'Vitória' : 'Derrota'}
                        </span>
                        <span className="text-theme-primary-text font-semibold">
                          {match.championName} - {match.kills}/{match.deaths}/{match.assists}
                        </span>
                        <span className="text-theme-primary-text text-xs">
                          KDA: {((match.kills + match.assists) / Math.max(1, match.deaths)).toFixed(2)}
                        </span>
                      </div>
                      {/* Stats adicionais */}
                      <div className="flex flex-col text-xs text-theme-primary-text/80 items-end">
                        <span>Duração: {Math.floor(match.gameDuration/60)}:{(match.gameDuration%60).toString().padStart(2,'0')}</span>
                        <span>CS: {match.totalCS}</span>
                        <span>Lane: {match.lane}</span>
                        <span>Role: {match.role}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-theme-primary-text text-center">Nenhum histórico encontrado.</p>
            )}
          </div>
        </div>
      )}
      <ChampionStatsModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isLoading={isStatsLoading}
        stats={championStats}
        champion={selectedChampion}
      />
      <ChallengerList />
      <PlayerHistoryModal
        isOpen={isHistoryOpen}
        onClose={handleCloseHistory}
        isLoading={isHistoryLoading}
        historyData={historyData}
      />
    </div>
  );
}