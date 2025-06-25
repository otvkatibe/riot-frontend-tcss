import { useState, useEffect } from 'react';
import { getChallengerTop } from '../api/RiotApi';
import { LoadingSpinner } from './LoadingSpinner';

export const ChallengerList = () => {
  const [challengers, setChallengers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChallengers = async () => {
      try {
        const data = await getChallengerTop();
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
      <div className="bg-red-800/50 text-white p-3 rounded-lg shadow-lg max-w-xs w-full mx-auto my-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto my-8 bg-theme-input-bg/80 backdrop-blur-md border-2 border-theme-border rounded-lg shadow-lg">
      <h4 className="text-lg font-bold text-theme-gold-text p-3 border-b border-theme-border text-center bg-theme-input-bg/90 rounded-t-lg">
        Top 5 Desafiantes
      </h4>
      {isLoading ? (
        <div className="p-4 flex justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <ul className="divide-y divide-theme-input-border">
          {challengers.map((player, index) => (
            <li key={player.puuid || player.summonerId || index} className="p-3 flex justify-between items-center text-sm gap-3">
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