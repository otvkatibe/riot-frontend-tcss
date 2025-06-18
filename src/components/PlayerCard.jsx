import { StarIcon } from './icons/StarIcon';

// A função getRankIconUrl foi removida pois não é mais necessária.

// Componente de exibição de ranqueada simplificado, sem a imagem do elo.
const RankDisplay = ({ rankData, queueName }) => {
  const isRanked = rankData && rankData.tier;

  return (
    <div>
      <h4 className="text-sm font-semibold text-theme-gold-text">{queueName}</h4>
      {isRanked ? (
        <>
          <p className="text-xs text-theme-primary-text">
            {rankData.tier} {rankData.rank} - {rankData.leaguePoints} PDL
          </p>
          <p className="text-xs text-theme-primary-text">
            Vitórias: {rankData.wins} / Derrotas: {rankData.losses}
          </p>
        </>
      ) : (
        <p className="text-xs text-theme-primary-text">Unranked</p>
      )}
    </div>
  );
};

export const PlayerCard = ({ player, onFavorite, isFavorited, isAuthenticated }) => {
  if (!player) return null;

  const iconUrl = player.profileIconUrl || `https://placehold.co/80x80/0A323C/F0E6D2?text=${player.gameName?.charAt(0) || 'P'}`;

  const soloDuoRank = player.ranks?.soloDuo;
  const flexRank = player.ranks?.flex;

  return (
    <div className="bg-[#0A1428]/80 backdrop-blur-sm border-2 border-theme-input-border rounded-lg p-4 w-full flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300 hover:border-theme-border">
      {/* Container principal para o conteúdo do jogador */}
      <div className="flex items-center gap-4 w-full">
        <img
          src={iconUrl}
          alt={`Ícone de ${player.gameName}`}
          className="rounded-full w-20 h-20 border-2 border-theme-border flex-shrink-0 self-start"
        />
        {/* Container para todas as informações de texto */}
        <div className="flex-grow flex flex-col">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-theme-primary-text">
              {player.gameName} <span className="text-theme-gold-text">#{player.tagLine}</span>
            </h3>
            <p className="text-theme-gold-text text-base sm:text-lg">Nível: {player.summonerLevel}</p>
          </div>
          
          {/* Container para os ranks, agora horizontal */}
          <div className="mt-2 flex flex-col sm:flex-row gap-x-6 gap-y-2">
            <RankDisplay rankData={soloDuoRank} queueName="Ranqueada Solo/Duo" />
            <RankDisplay rankData={flexRank} queueName="Ranqueada Flex" />
          </div>
        </div>
      </div>
      
      {/* Botão de Favorito */}
      {isAuthenticated && onFavorite && (
        <button onClick={() => onFavorite(player)} className="p-2 self-center sm:self-start">
          <StarIcon className={`w-8 h-8 transition-colors duration-300 ${isFavorited ? 'fill-yellow-400 text-yellow-400' : 'text-gray-500 hover:text-yellow-400'}`} />
        </button>
      )}
    </div>
  );
};