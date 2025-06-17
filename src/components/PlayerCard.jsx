import { StarIcon } from './icons/StarIcon';

const RankDisplay = ({ rankData, queueName }) => {
  if (!rankData || !rankData.tier) { // Verifica se há dados de rank e tier
    return (
      <div className="mt-2">
        <h4 className="text-sm font-semibold text-theme-gold-text">{queueName}</h4>
        <p className="text-xs text-theme-primary-text">Unranked</p>
      </div>
    );
  }
  return (
    <div className="mt-2">
      <h4 className="text-sm font-semibold text-theme-gold-text">{queueName}</h4>
      <p className="text-xs text-theme-primary-text">
        {rankData.tier} {rankData.rank} - {rankData.leaguePoints} PDL
      </p>
      <p className="text-xs text-theme-primary-text">
        Vitórias: {rankData.wins} / Derrotas: {rankData.losses}
      </p>
    </div>
  );
};

export const PlayerCard = ({ player, onFavorite, isFavorited, isAuthenticated }) => {
  if (!player) return null;

  const iconUrl = player.profileIconUrl || `https://placehold.co/80x80/0A323C/F0E6D2?text=${player.gameName?.charAt(0) || 'P'}`;

  // O backend na rota /riot/profile deve popular player.ranks com soloDuo e flex
  const soloDuoRank = player.ranks?.soloDuo;
  const flexRank = player.ranks?.flex;

  return (
    <div className="bg-[#0A1428]/80 backdrop-blur-sm border-2 border-theme-input-border rounded-lg p-4 w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300 hover:border-theme-border">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <img
          src={iconUrl}
          alt={`Ícone de ${player.gameName}`}
          className="rounded-full w-16 h-16 sm:w-20 sm:h-20 border-2 border-theme-border flex-shrink-0"
        />
        <div className="flex-grow">
          <h3 className="text-xl sm:text-2xl font-bold text-theme-primary-text">
            {player.gameName} <span className="text-theme-gold-text">#{player.tagLine}</span>
          </h3>
          <p className="text-theme-gold-text text-base sm:text-lg">Nível: {player.summonerLevel}</p>
          
          {/* Exibição dos Ranks */}
          <div className="mt-2 space-y-1">
            {(soloDuoRank || flexRank) ? (
              <>
                {soloDuoRank && <RankDisplay rankData={soloDuoRank} queueName="Ranqueada Solo/Duo" />}
                {flexRank && <RankDisplay rankData={flexRank} queueName="Ranqueada Flex" />}
              </>
            ) : (
              <p className="text-xs text-theme-primary-text mt-2">Unranked em ambas as filas.</p>
            )}
          </div>
        </div>
      </div>
      {isAuthenticated && onFavorite && (
        <button onClick={() => onFavorite(player)} className="p-2 self-center sm:ml-auto"> {/* Ajuste para alinhamento */}
          <StarIcon className={`w-8 h-8 transition-colors duration-300 ${isFavorited ? 'fill-yellow-400 text-yellow-400' : 'text-gray-500 hover:text-yellow-400'}`} />
        </button>
      )}
    </div>
  );
};