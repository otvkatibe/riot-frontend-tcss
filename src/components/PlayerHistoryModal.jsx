import { LoadingSpinner } from "./LoadingSpinner";

export const PlayerHistoryModal = ({ isOpen, onClose, isLoading, historyData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-theme-bg border-2 border-theme-border rounded-lg p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-2 right-2 text-theme-primary-text hover:text-theme-gold-text text-2xl z-10">&times;</button>
        {isLoading ? (
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
                  <img
                    src={`https://ddragon.leagueoflegends.com/cdn/14.12.1/img/champion/${match.championName}.png`}
                    alt={match.championName}
                    className="w-12 h-12 rounded-md border-2 border-theme-gold-text mr-2"
                    style={{ minWidth: 48 }}
                  />
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
  );
};