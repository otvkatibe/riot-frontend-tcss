import { StarIcon } from './icons/StarIcon';

// Componente interno para exibir os dados de uma fila ranqueada
const RankDisplay = ({ rankData, queueName }) => {
  const isRanked = rankData && rankData.tier;

  return (
    <div>
      <p className="font-semibold text-theme-gold-text/90">{queueName}</p>
      {isRanked ? (
        <>
          <p>
            {rankData.tier} {rankData.rank} - {rankData.leaguePoints} PDL
          </p>
          <p>
            {rankData.wins}V / {rankData.losses}D
          </p>
        </>
      ) : (
        <p>Unranked</p>
      )}
    </div>
  );
};

export const FavoriteCard = ({ favorite, onRemove, onCardClick }) => {
  if (!favorite) return null;

  const gameName = favorite.nome;
  const tagLine = favorite.tag;
  const soloDuoRank = favorite.ranks?.soloDuo;
  const flexRank = favorite.ranks?.flex;

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    onRemove(favorite._id, gameName);
  };

  return (
    <div 
      className="bg-[#0A1428]/80 backdrop-blur-sm border-2 border-theme-input-border rounded-lg p-4 w-full flex items-center justify-between gap-4 transition-all duration-300 hover:border-theme-border cursor-pointer"
      onClick={() => onCardClick(favorite)}
    >
      <div className="flex items-center gap-4 flex-grow">
        <img
          src={favorite.profileIconUrl}
          alt={`Ícone de ${gameName}`}
          className="rounded-full w-16 h-16 border-2 border-theme-border flex-shrink-0"
        />
        <div className="flex-grow flex flex-col">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-theme-primary-text">
              {gameName} <span className="text-theme-gold-text">#{tagLine}</span>
            </h3>
            <p className="text-theme-gold-text text-base sm:text-lg">Nível: {favorite.summonerLevel}</p>
            {/* Exibe a observação, se existir */}
            {favorite.observacao && (
              <p className="text-theme-primary-text/80 text-xs mt-1 italic">
                Obs: {favorite.observacao}
              </p>
            )}
          </div>
          {/* Container para exibir os ranks lado a lado */}
          <div className="mt-1 flex gap-x-6 text-xs text-theme-primary-text/80">
            <RankDisplay rankData={soloDuoRank} queueName="Ranqueada Solo/Duo" />
            <RankDisplay rankData={flexRank} queueName="Ranqueada Flex" />
          </div>
        </div>
      </div>
      
      {/* Botão para remover o favorito */}
      <button 
        onClick={handleRemoveClick} 
        className="p-2 self-center group"
        aria-label={`Remover ${gameName} dos favoritos`}
      >
        <StarIcon className="w-8 h-8 fill-yellow-400 text-yellow-400 group-hover:fill-gray-500 group-hover:text-gray-500 transition-colors" />
      </button>
    </div>
  );
};