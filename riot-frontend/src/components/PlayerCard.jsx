import { StarIcon } from './icons/StarIcon';
// import { getProfileIconUrl } from '../api/RiotApi'; // Se a URL não vier pronta

export const PlayerCard = ({ player, onFavorite, isFavorited, isAuthenticated }) => {
  if (!player) return null;

  // player.profileIconUrl já deve vir construído da API ou da lógica de busca/favoritos
  const iconUrl = player.profileIconUrl || `https://placehold.co/80x80/0A323C/F0E6D2?text=${player.gameName?.charAt(0) || 'P'}`;

  return (
    <div className="bg-[#0A1428]/80 backdrop-blur-sm border-2 border-theme-input-border rounded-lg p-4 w-full flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300 hover:border-theme-border">
        <div className="flex items-center gap-4 w-full sm:w-auto">
            <img 
              src={iconUrl} 
              alt={`Ícone de ${player.gameName}`} 
              className="rounded-full w-16 h-16 sm:w-20 sm:h-20 border-2 border-theme-border"
            />
            <div>
                <h3 className="text-xl sm:text-2xl font-bold text-theme-primary-text">
                  {player.gameName} <span className="text-theme-gold-text">#{player.tagLine}</span>
                </h3>
                <p className="text-theme-gold-text text-base sm:text-lg">Nível: {player.summonerLevel}</p>
            </div>
        </div>
        {isAuthenticated && onFavorite && (
          <button onClick={() => onFavorite(player)} className="p-2 self-start sm:self-center">
            <StarIcon className={`w-8 h-8 transition-colors duration-300 ${isFavorited ? 'fill-yellow-400 text-yellow-400' : 'text-gray-500 hover:text-yellow-400'}`} />
          </button>
        )}
    </div>
  );
};