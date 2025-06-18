import { LoadingSpinner } from './LoadingSpinner';

const DDragon_VERSION = "14.12.1";

const getChampionIconUrl = (championId) => {
  if (!championId) return '';
  return `https://ddragon.leagueoflegends.com/cdn/${DDragon_VERSION}/img/champion/${championId}.png`;
};

/**
 * Formata a duração de segundos para o formato MM:SS.
 * @param {number} seconds - A duração total em segundos.
 * @returns {string} A duração formatada.
 */
const formatDuration = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const ChampionStatsModal = ({ isOpen, onClose, isLoading, stats, champion }) => {
  if (!isOpen) return null;

  const calculateKDA = () => {
    if (!stats || stats.totalDeaths === 0) {
      return ((stats?.totalKills || 0) + (stats?.totalAssists || 0)).toFixed(2);
    }
    return (((stats.totalKills || 0) + (stats.totalAssists || 0)) / stats.totalDeaths).toFixed(2);
  };

  const calculateWinRate = () => {
    if (!stats || stats.total === 0) return "0.00";
    return ((stats.vitorias / stats.total) * 100).toFixed(2);
  };

  const calculateCSPerMin = () => {
    if (!stats || !stats.totalGameDuration || stats.totalGameDuration === 0) return "0.0";
    return (stats.totalCS / stats.totalGameDuration).toFixed(1);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-theme-bg border-2 border-theme-border rounded-lg p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-theme-primary-text hover:text-theme-gold-text text-2xl z-10"
        >
          &times;
        </button>
        
        {isLoading ? (
          <LoadingSpinner />
        ) : stats && champion ? (
          <div className="text-center">
            <img 
              src={getChampionIconUrl(champion.championIcon)} 
              alt={champion.nome}
              className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-theme-gold-text"
            />
            <h2 className="text-3xl font-bold text-theme-gold-text">{champion.nome}</h2>
            <p className="text-theme-primary-text mb-4">Estatísticas nas últimas {stats.total} partidas</p>
            
            <div className="grid grid-cols-2 gap-4 text-left mt-6">
              <div className="bg-theme-input-bg p-3 rounded-md">
                <p className="text-sm text-theme-primary-text">Vitórias</p>
                <p className="text-lg font-bold text-green-400">{calculateWinRate()}%</p>
              </div>
              <div className="bg-theme-input-bg p-3 rounded-md">
                <p className="text-sm text-theme-primary-text">KDA</p>
                <p className="text-lg font-bold text-theme-gold-text">{calculateKDA()}</p>
              </div>
              <div className="bg-theme-input-bg p-3 rounded-md">
                <p className="text-sm text-theme-primary-text">CS/min</p>
                <p className="text-lg font-bold text-theme-gold-text">{calculateCSPerMin()}</p>
              </div>
              <div className="bg-theme-input-bg p-3 rounded-md">
                <p className="text-sm text-theme-primary-text">Média K/D/A</p>
                <p className="text-lg font-bold text-theme-gold-text">
                  {(stats.totalKills / stats.total).toFixed(1)} / <span className="text-red-400">{(stats.totalDeaths / stats.total).toFixed(1)}</span> / {(stats.totalAssists / stats.total).toFixed(1)}
                </p>
              </div>
            </div>

            {stats.matches && stats.matches.length > 0 && (
              <div className="mt-6 text-left">
                <h3 className="text-xl font-bold text-theme-gold-text mb-3 text-center">Histórico de Partidas Recentes</h3>
                <ul className="space-y-2">
                  {stats.matches.map((match, index) => (
                    <li key={index} className={`p-3 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ${match.win ? 'bg-green-800/20' : 'bg-red-800/20'}`}>
                      <div className="flex-shrink-0">
                        <p className={`font-bold ${match.win ? 'text-green-400' : 'text-red-400'}`}>
                          {match.win ? 'Vitória' : 'Derrota'}
                        </p>
                        <p className="text-sm text-theme-primary-text/80">
                          {match.kills}/{match.deaths}/{match.assists}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-right flex-grow">
                        <p>Duração: <span className="font-semibold">{formatDuration(match.gameDuration)}</span></p>
                        <p>Lane: <span className="font-semibold capitalize">{match.lane.toLowerCase()}</span></p>
                        <p>CS: <span className="font-semibold">{match.totalCS}</span></p>
                        <p>Role: <span className="font-semibold capitalize">{match.role.toLowerCase()}</span></p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="text-theme-primary-text text-center">Não foi possível carregar as estatísticas.</p>
        )}
      </div>
    </div>
  );
};