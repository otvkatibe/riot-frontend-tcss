import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext.jsx'; // Caminho corrigido
import { SearchBar } from '../components/SearchBar'; // Caminho corrigido
import { PlayerCard } from '../components/PlayerCard'; // Caminho corrigido
import { LoadingSpinner } from '../components/LoadingSpinner'; // Caminho corrigido
import { searchPlayer, getFavorites, addFavorite, removeFavorite } from '../api/RiotApi';

export default function Dashboard() {
  const [searchResult, setSearchResult] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(true);
  const { isAuthenticated } = useAuth(); // user e token são gerenciados internamente pela API agora

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

  const handleSearch = async ({ gameName, tagLine }) => {
    setIsSearchLoading(true);
    setSearchResult(null);
    try {
      const data = await searchPlayer(gameName, tagLine);
      setSearchResult(data);
      toast.success("Invocador encontrado!");
    } catch (error) {
      toast.error(error.message || "Erro ao buscar invocador.");
    } finally {
      setIsSearchLoading(false);
    }
  };

  const handleFavorite = async (player) => {
    // player aqui é o objeto retornado por searchPlayer ou um item de favorites
    const isAlreadyFavorited = favorites.some(fav => fav.puuid === player.puuid);
    
    try {
      if (isAlreadyFavorited) {
        // Para remover, precisamos do ID do favorito, não do PUUID do jogador.
        // O backend usa o _id do documento FavoriteRiot.
        const favToDelete = favorites.find(f => f.puuid === player.puuid);
        if (favToDelete && favToDelete._id) { // _id é o ID do favorito no banco
          await removeFavorite(favToDelete._id);
          setFavorites(prev => prev.filter(fav => fav.puuid !== player.puuid));
          toast.info(`${player.gameName} removido dos favoritos.`);
        } else {
          toast.error("Não foi possível encontrar o ID do favorito para remover.");
        }
      } else {
        const newFavoriteData = await addFavorite(player); // addFavorite envia os dados necessários
        setFavorites(prev => [...prev, newFavoriteData]);
        toast.success(`${player.gameName} adicionado aos favoritos!`);
      }
      // Atualiza o estado do ícone no resultado da busca, se aplicável
      if (searchResult && searchResult.puuid === player.puuid) {
        setSearchResult(prev => ({ ...prev, isNowFavorited: !isAlreadyFavorited }));
      }
    } catch (error) {
      toast.error(error.message || "Erro ao atualizar favoritos.");
    }
  };

  const isFavorited = (puuid) => favorites.some(fav => fav.puuid === puuid);

  return (
    <div className="flex-grow p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-theme-gold-text mb-6">Painel do Invocador</h2>
        <SearchBar onSearch={handleSearch} isLoading={isSearchLoading} />
        
        <div className="mt-8 space-y-4 max-w-2xl mx-auto">
          {isSearchLoading && <LoadingSpinner />}
          {searchResult && (
            <PlayerCard 
              player={searchResult} 
              onFavorite={handleFavorite} 
              isFavorited={isFavorited(searchResult.puuid)} 
              isAuthenticated={isAuthenticated} 
            />
          )}
        </div>

        <div className="mt-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-theme-gold-text mb-4 border-b-2 border-theme-border pb-2">Seus Favoritos</h3>
          {isFavoritesLoading ? (
            <LoadingSpinner />
          ) : favorites.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {favorites.map(fav => (
                <PlayerCard 
                  key={fav.puuid || fav._id} // Usar _id se puuid não for único ou garantido
                  player={fav} 
                  onFavorite={handleFavorite} 
                  isFavorited={true} // Já que está listado, é um favorito
                  isAuthenticated={isAuthenticated} 
                />
              ))}
            </div>
          ) : (
            <p className="text-theme-primary-text text-center sm:text-left">Você ainda não adicionou jogadores aos favoritos.</p>
          )}
        </div>
      </div>
    </div>
  );
}
