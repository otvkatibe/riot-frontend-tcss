const DDragon_VERSION = "14.12.1"; // Manter sincronizado com RiotApi.jsx

const getChampionIconUrl = (championId) => {
  if (!championId) return '';
  // O backend retorna o ID do campeão (ex: "Aatrox"), que é usado na URL do DDragon.
  return `https://ddragon.leagueoflegends.com/cdn/${DDragon_VERSION}/img/champion/${championId}.png`;
};

export const MasteryList = ({ masteryData, onChampionClick }) => { // Adicionado onChampionClick
  if (!masteryData || masteryData.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 bg-[#0A1428]/80 backdrop-blur-sm border-2 border-theme-input-border rounded-lg p-4 w-full">
      <h3 className="text-xl font-bold text-theme-gold-text mb-4 text-center">Top 10 Maestrias</h3>
      {/* Usamos grid para um layout mais visual e responsivo */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {masteryData.map((champ) => (
          // Cada campeão é um item flexível em coluna
          <div 
            key={champ.posicao} 
            className="flex flex-col items-center gap-2 bg-theme-input-bg/50 p-3 rounded-md border border-transparent hover:border-theme-border transition-colors text-center cursor-pointer" // Adicionado cursor-pointer
            onClick={() => onChampionClick(champ)} // Adicionado onClick
          >
            <img 
              src={getChampionIconUrl(champ.championIcon)} 
              alt={champ.nome}
              className="w-16 h-16 rounded-md" // Ícone maior
            />
            {/* Centraliza o conteúdo de cada campeão */}
            <div>
              <p className="font-semibold text-theme-primary-text truncate w-full">{champ.nome}</p>
              <p className="text-sm text-theme-gold-text">{champ.championPoints.toLocaleString('pt-BR')} pts</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};