import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext.jsx';
import { SearchBar } from '../components/SearchBar';
import { PlayerCard } from '../components/PlayerCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { searchPlayer, getFavorites, addFavorite, removeFavorite, getChampionMastery, getChampionStats } from '../api/RiotApi';
import { MasteryList } from '../components/MasteryList';
import { ChampionStatsModal } from '../components/ChampionStatsModal';
import { FavoriteCard } from '../components/FavoriteCard';

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
  const { isAuthenticated } = useAuth();

  // Estados para o modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChampion, setSelectedChampion] = useState(null);
  const [championStats, setChampionStats] = useState(null);
  const [isStatsLoading, setIsStatsLoading] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated) return; // Não busca se não estiver autenticado
      setIsFavoritesLoading(true);
      try {
        const favsData = await getFavorites();
        setFavorites(favsData);
      } catch (error) {
        toast.error(error.message || "Não foi possível carregar os favoritos.");
      } finally {
        setIsFavoritesLoading(false);
      }
    };
    fetchFavorites();
  }, [isAuthenticated]);

  /**
   * Lida com a busca de um jogador, buscando dados do perfil e maestrias.
   * @param {{ gameName: string, tagLine: string }} searchData - Os dados da busca.
   */
  const handleSearch = async ({ gameName, tagLine }) => {
    setIsSearchLoading(true);
    setSearchResult(null);
    setSearchMastery(null); // Limpa maestria anterior
    try {
      // Busca dados do perfil e maestrias em paralelo
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
          setFavorites(favorites.filter(f => f.puuid !== player.puuid));
          toast.info(`${player.gameName} removido dos favoritos.`);
        }
      } else {
        const newFavorite = await addFavorite(player);
        setFavorites([...favorites, newFavorite]);
        toast.success(`${player.gameName} adicionado aos favoritos!`);
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
              <MasteryList 
                masteryData={searchMastery} 
                onChampionClick={handleChampionClick} 
              />
            </>
          )}
        </div>

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
    </div>
  );
}
