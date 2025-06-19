import { useState, useEffect } from 'react';
import { getChallengerTop } from '../api/RiotApi'; // Função atualizada
import { LoadingSpinner } from './LoadingSpinner';

export const ChallengerList = () => {
  const [challengers, setChallengers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChallengers = async () => {
      try {
        const data = await getChallengerTop(); // Chamando a nova função
        setChallengers(data);
      } catch (err) {
        setError('Não foi possível carregar a lista de Desafiantes.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallengers();
  }, []);

  if (error) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-800/50 text-white p-3 rounded-lg shadow-lg max-w-xs w-full">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-theme-input-bg/80 backdrop-blur-md border-2 border-theme-border rounded-lg shadow-lg max-w-xs w-full max-h-80 overflow-y-auto">
      <h4 className="text-lg font-bold text-theme-gold-text p-3 border-b border-theme-border sticky top-0 bg-theme-input-bg/90">
        Top 5 Desafiantes
      </h4>
      {isLoading ? (
        <div className="p-4">
          <LoadingSpinner />
        </div>
      ) : (
        <ul className="divide-y divide-theme-input-border">
          {challengers.map((player, index) => (
            <li key={player.summonerId || index} className="p-3 flex justify-between items-center text-sm gap-3">
              <div className="flex-grow truncate">
                <span className="font-semibold text-theme-primary-text">
                  {index + 1}. {player.name}
                </span>
                <span className="text-theme-gold-text/70 ml-1">
                  #{player.tag}
                </span>
              </div>
              <span className="text-theme-gold-text flex-shrink-0">
                {player.leaguePoints.toLocaleString('pt-BR')} PDL
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};