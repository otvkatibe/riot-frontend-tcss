import { useEffect, useState } from "react";

export const ChampionLoreModal = ({ onClose }) => {
  const [champions, setChampions] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch("https://ddragon.leagueoflegends.com/cdn/14.12.1/data/pt_BR/champion.json")
      .then(res => res.json())
      .then(data => setChampions(Object.values(data.data)));
  }, []);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-theme-bg border-2 border-theme-border rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-2 right-2 text-theme-primary-text hover:text-theme-gold-text text-2xl z-10">&times;</button>
        <h2 className="text-2xl font-bold text-theme-gold-text mb-4 text-center">História dos Campeões</h2>
        {/* Grid de campeões ocupando toda a largura */}
        <div className="overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 gap-4">
            {champions.map(champ => (
              <button
                key={champ.key}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 border-transparent hover:border-theme-gold-text transition bg-theme-input-bg/60 hover:bg-theme-input-bg/90 focus:outline-none ${selected?.id === champ.id ? 'ring-2 ring-theme-gold-text' : ''}`}
                onClick={() => setSelected(champ)}
                title={champ.name}
                type="button"
              >
                <img
                  src={`https://ddragon.leagueoflegends.com/cdn/14.12.1/img/champion/${champ.image.full}`}
                  alt={champ.name}
                  className="w-16 h-16 rounded"
                />
                <span className="text-xs text-theme-primary-text text-center truncate w-16">{champ.name}</span>
              </button>
            ))}
          </div>
        </div>
        {/* Modal da história do campeão */}
        {selected && (
          <ChampionLoreBox champ={selected} onClose={() => setSelected(null)} />
        )}
      </div>
    </div>
  );
};

const TAG_ICONS = {
  Assassin: (
    <svg className="w-5 h-5 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth="2" d="M12 3l2 7h7l-5.5 4 2 7-5.5-4-5.5 4 2-7L3 10h7z"/>
    </svg>
  ),
  Fighter: (
    <svg className="w-5 h-5 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth="2" d="M16 3l-4 4-4-4M12 7v13"/>
    </svg>
  ),
  Mage: (
    <svg className="w-5 h-5 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4" strokeWidth="2"/>
      <path strokeWidth="2" d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.07-7.07l-1.41 1.41M6.34 17.66l-1.41 1.41m12.02 0l-1.41-1.41M6.34 6.34L4.93 4.93"/>
    </svg>
  ),
  Marksman: (
    <svg className="w-5 h-5 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" strokeWidth="2"/>
      <path strokeWidth="2" d="M12 7v5l3 3"/>
    </svg>
  ),
  Support: (
    <svg className="w-5 h-5 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth="2" d="M12 21C7 21 2 17 2 12a10 10 0 0120 0c0 5-5 9-10 9z"/>
    </svg>
  ),
  Tank: (
    <svg className="w-5 h-5 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="4" y="7" width="16" height="13" rx="2" strokeWidth="2"/>
      <path strokeWidth="2" d="M8 7V5a4 4 0 018 0v2"/>
    </svg>
  ),
};

const ChampionLoreBox = ({ champ, onClose }) => {
  const [lore, setLore] = useState(null);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (!champ?.id) return;
    fetch(`https://ddragon.leagueoflegends.com/cdn/14.12.1/data/pt_BR/champion/${champ.id}.json`)
      .then(res => res.json())
      .then(data => {
        setLore(data.data[champ.id].lore);
        setTags(data.data[champ.id].tags || []);
      });
  }, [champ]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70" onClick={onClose}>
      <div
        className="bg-theme-bg border-2 border-theme-gold-text rounded-lg p-8 w-[1200px] h-[600px] max-w-full max-h-[90vh] relative flex flex-col md:flex-row gap-8"
        onClick={e => e.stopPropagation()}
        style={{ minWidth: 320, minHeight: 320 }}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-theme-primary-text hover:text-theme-gold-text text-2xl z-10"
        >
          &times;
        </button>
        {/* Splash art grande à esquerda */}
        <div className="flex-shrink-0 w-full md:w-[500px] flex justify-center items-start h-full">
          <img
            src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champ.id}_0.jpg`}
            alt={champ.name}
            className="rounded-lg object-cover w-full md:w-[500px] h-[560px] shadow-lg"
            style={{ objectPosition: 'top center' }}
          />
        </div>
        {/* Info à direita */}
        <div className="flex-1 flex flex-col items-center md:items-start h-full">
          <h3 className="text-3xl font-bold text-theme-gold-text mb-2">{champ.name}</h3>
          <p className="text-theme-primary-text mb-4 italic text-lg">{champ.title}</p>
          <div className="text-theme-primary-text whitespace-pre-line text-base overflow-y-auto w-full"
            style={{ maxHeight: '400px' }}>
            {lore ? lore : "Carregando história..."}
          </div>
          {/* Classes do campeão */}
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map(tag => (
              <span
                key={tag}
                className="flex items-center px-3 py-1 bg-theme-gold-text/20 text-theme-gold-text rounded-full text-sm font-semibold border border-theme-gold-text"
              >
                {TAG_ICONS[tag] || null}
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};