import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../contexts/AuthContext.jsx';
import { SearchBar } from '../components/SearchBar';
import { PlayerCard } from '../components/PlayerCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { searchPlayer, getFavorites, addFavorite, removeFavorite, getChampionMastery, getChampionStats, getPlayerHistory } from '../api/RiotApi';
import { MasteryList } from '../components/MasteryList';
import { ChampionStatsModal } from '../components/ChampionStatsModal';
import { FavoriteCard } from '../components/FavoriteCard';
import { ChallengerList } from '../components/ChallengerList';

/**
 * Página de Dashboard, acessível apenas para usuários autenticados.
 * Permite buscar jogadores, gerenciá-los como favoritos e visualizar
 * estatísticas detalhadas.
 * @returns {JSX.Element} A página de dashboard.
 */
export default function Dashboard() {
  const [searchResult, setSearchResult] = useState(null);
  const [searchMastery, setSearchMastery] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChampion, setSelectedChampion] = useState(null);
  const [championStats, setChampionStats] = useState(null);
  const [isStatsLoading, setIsStatsLoading] = useState(false);

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyData, setHistoryData] = useState(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated || !user) {
        setFavorites([]);
        setIsFavoritesLoading(false);
        return;
      }
      
      setIsFavoritesLoading(true);
      try {
        const favsData = await getFavorites();
        setFavorites(favsData);
      } catch (error) {
        toast.error(error.message || "Não foi possível carregar os favoritos.");
        setFavorites([]);
      } finally {
        setIsFavoritesLoading(false);
      }
    };
    
    fetchFavorites();
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    setSearchResult(null);
    setSearchMastery(null);
    setIsModalOpen(false);
    setSelectedChampion(null);
    setChampionStats(null);
    setIsHistoryOpen(false);
    setHistoryData(null);
  }, [user?.id]);

  /**
   * Lida com a busca de um jogador, buscando dados do perfil e maestrias.
   * @param {{ gameName: string, tagLine: string }} searchData - Os dados da busca.
   */
  const handleSearch = async ({ gameName, tagLine }) => {
    setIsSearchLoading(true);
    setSearchResult(null);
    setSearchMastery(null);
    try {
      const [player, mastery] = await Promise.all([
        searchPlayer(gameName, tagLine),
        getChampionMastery(gameName, tagLine)
      ]);
      
      setSearchResult(player);
      setSearchMastery(mastery);
      toast.success("Invocador encontrado!");
    } catch (error) {
      toast.error(error.message || "Erro ao buscar invocador.");
    } finally {
      setIsSearchLoading(false);
    }
  };

  /**
   * Adiciona ou remove um jogador da lista de favoritos.
   * @param {object} player - O objeto do jogador a ser favoritado/desfavoritado.
   */
  const handleFavorite = async (player) => {
    const isFav = isFavorited(player.puuid);
    try {
      if (isFav) {
        const favToRemove = favorites.find(f => f.puuid === player.puuid);
        if (favToRemove) {
          await removeFavorite(favToRemove._id);
          setFavorites(prevFavorites => prevFavorites.filter(f => f._id !== favToRemove._id));
          toast.info(`${player.gameName} removido dos favoritos.`);
        }
      } else {
        let obsValue = "";
        const toastId = toast(
          ({ closeToast }) => (
            <div>
              <p className="mb-2">Adicionar uma observação (opcional):</p>
              <input
                type="text"
                autoFocus
                className="border p-1 rounded w-full text-black"
                onChange={e => { obsValue = e.target.value; }}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    closeToast();
                    addFavorite(player, obsValue).then(newFavorite => {
                      setFavorites(prev => [...prev, newFavorite]);
                      toast.success(`${player.gameName} adicionado aos favoritos!`);
                    });
                  }
                }}
              />
              <button
                className="mt-2 px-3 py-1 bg-theme-gold-text text-theme-bg rounded"
                onClick={() => {
                  closeToast();
                  addFavorite(player, obsValue).then(newFavorite => {
                    setFavorites(prev => [...prev, newFavorite]);
                    toast.success(`${player.gameName} adicionado aos favoritos!`);
                  });
                }}
              >
                Salvar
              </button>
            </div>
          ),
          { autoClose: false }
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Erro ao gerenciar favoritos.");
    }
  };

  /**
   * Remove um jogador da lista de favoritos usando seu ID.
   * @param {string} favoriteId - O ID do favorito a ser removido.
   * @param {string} favoriteName - O nome do jogador para exibir na notificação.
   */
  const handleRemoveFavorite = async (favoriteId, favoriteName) => {
    try {
      await removeFavorite(favoriteId);
      setFavorites(prevFavorites => prevFavorites.filter(f => f._id !== favoriteId));
      toast.info(`${favoriteName} removido dos favoritos.`);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Erro ao remover favorito.");
    }
  };

  /**
   * Lida com o clique em um card de favorito, acionando uma nova busca
   * e rolando a página para o topo para exibir o resultado.
   * @param {object} favorite - O objeto do favorito clicado.
   */
  const handleFavoriteClick = (favorite) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    handleSearch({ gameName: favorite.nome, tagLine: favorite.tag });
  };

  /**
   * Verifica se um jogador já está na lista de favoritos.
   * @param {string} puuid - O PUUID do jogador a ser verificado.
   * @returns {boolean} Verdadeiro se o jogador for um favorito.
   */
  const isFavorited = (puuid) => favorites.some(fav => fav.puuid === puuid);

  /**
   * Lida com o clique em um campeão, abrindo o modal de estatísticas.
   * @param {object} champion - O objeto do campeão clicado.
   */
  const handleChampionClick = async (champion) => {
    if (!searchResult) return;
    setSelectedChampion(champion);
    setIsModalOpen(true);
    setIsStatsLoading(true);
    try {
      const stats = await getChampionStats(searchResult.gameName, searchResult.tagLine, champion.championIcon);
      setChampionStats(stats);
    } catch (error) {
      toast.error(error.message || "Erro ao buscar estatísticas do campeão.");
      handleCloseModal();
    } finally {
      setIsStatsLoading(false);
    }
  };

  /**
   * Fecha o modal de estatísticas do campeão.
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedChampion(null);
    setChampionStats(null);
  };

  /**
   * Abre o modal com o histórico geral recente do jogador.
   */
  const handleOpenHistory = async () => {
    if (!searchResult) return;
    setIsHistoryOpen(true);
    setIsHistoryLoading(true);
    try {
      const data = await getPlayerHistory(searchResult.gameName, searchResult.tagLine);
      setHistoryData(data);
    } catch (error) {
      toast.error("Erro ao buscar histórico geral.");
      setIsHistoryOpen(false);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  /**
   * Fecha o modal de histórico geral.
   */
  const handleCloseHistory = () => {
    setIsHistoryOpen(false);
    setHistoryData(null);
  };

  return (
    <div className="flex-grow p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-theme-gold-text mb-6">Painel do Invocador</h2>
        <SearchBar onSearch={handleSearch} isLoading={isSearchLoading} />
        
        <div className="mt-8 space-y-4 max-w-2xl mx-auto">
          {isSearchLoading && <LoadingSpinner />}
          {searchResult && (
            <>
              <PlayerCard 
                player={searchResult} 
                onFavorite={handleFavorite} 
                isFavorited={isFavorited(searchResult.puuid)} 
                isAuthenticated={isAuthenticated} 
              />
              {/* Botão para ver histórico geral */}
              <button
                className="mt-4 w-full p-3 bg-theme-button-bg text-theme-gold-text border-2 border-theme-border rounded-md font-bold transition-all duration-300 hover:bg-theme-button-hover"
                onClick={handleOpenHistory}
              >
                Ver Histórico Geral Recente
              </button>
              <MasteryList 
                masteryData={searchMastery} 
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

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-theme-gold-text border-b-2 border-theme-border pb-2">
            Seus Favoritos
          </h2>
          {isFavoritesLoading ? (
            <div className="flex justify-center mt-8">
              <LoadingSpinner />
            </div>
          ) : favorites.length > 0 ? (
            <div className="mt-4 space-y-4">
              {favorites.map((fav) => (
                <FavoriteCard 
                  key={fav._id} 
                  favorite={fav} 
                  onRemove={handleRemoveFavorite} 
                  onCardClick={handleFavoriteClick}
                />
              ))}
            </div>
          ) : (
            <p className="mt-4 text-theme-primary-text/70">Você ainda não adicionou nenhum jogador aos favoritos.</p>
          )}
        </div>
      </div>

      <ChampionStatsModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        champion={selectedChampion}
        stats={championStats}
        isLoading={isStatsLoading}
      />
      <ChallengerList />
    </div>
  );
}
