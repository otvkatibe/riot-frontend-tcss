import { useState } from 'react';
import { toast } from 'react-toastify';
import { SearchIcon } from './icons/SearchIcon';

export const SearchBar = ({ onSearch, isLoading }) => {
  const [gameName, setGameName] = useState('');
  const [tagLine, setTagLine] = useState('');
  const [region, setRegion] = useState('americas'); // novo estado de região

  const handleSearch = (e) => {
    e.preventDefault();
    if (gameName && tagLine) {
      onSearch({ gameName, tagLine, region });
    } else {
      toast.error("Por favor, preencha o nome e a tag.");
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full max-w-2xl mx-auto">
      <div className="flex w-full bg-theme-input-bg rounded-md border border-theme-input-border focus-within:ring-2 focus-within:ring-theme-border">
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="p-3 bg-theme-button-bg text-theme-primary-text rounded-md font-semibold transition-colors duration-300"
          disabled={isLoading}
        >
          <option value="americas">Américas</option>
          <option value="europe">Europa</option>
          <option value="asia">Ásia</option>
        </select>
        <input 
          type="text" 
          value={gameName} 
          onChange={(e) => setGameName(e.target.value)} 
          placeholder="Nome de Invocador" 
          className="w-3/5 p-3 bg-transparent text-theme-primary-text placeholder-theme-input-placeholder focus:outline-none rounded-l-md" 
          disabled={isLoading} 
        />
        <span className="flex items-center text-theme-input-placeholder text-2xl font-thin">#</span>
        <input 
          type="text" 
          value={tagLine} 
          onChange={(e) => setTagLine(e.target.value.toUpperCase())} 
          placeholder="TAG" 
          className="w-2/5 p-3 bg-transparent text-theme-primary-text placeholder-theme-input-placeholder focus:outline-none rounded-r-md" 
          maxLength="5" 
          disabled={isLoading} 
        />
      </div>
      <button 
        type="submit" 
        className="mt-4 sm:mt-0 w-full sm:w-auto flex items-center justify-center gap-2 p-3 bg-theme-button-bg text-theme-gold-text border-2 border-theme-border rounded-md font-bold transition-all duration-300 hover:bg-theme-button-hover disabled:opacity-50 disabled:cursor-not-allowed" 
        disabled={isLoading}
      >
        {isLoading ? <div className="small-loader"></div> : <><SearchIcon className="w-5 h-5" /><span>Buscar</span></>}
      </button>
    </form>
  );
};