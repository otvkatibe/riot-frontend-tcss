import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOutIcon } from './icons/LogOutIcon';
import { useState } from 'react';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { ChampionLoreModal } from './ChampionLoreModal';

/**
 * Componente de cabeçalho da aplicação.
 * Exibe o título e os links de navegação, que mudam com base no estado de autenticação do usuário.
 * @returns {JSX.Element} O elemento do cabeçalho.
 */
export const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoreOpen, setIsLoreOpen] = useState(false);

  /**
   * Lida com o processo de logout do usuário e redireciona para a página inicial.
   */
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleOpenLore = () => setIsLoreOpen(true);
  const handleCloseLore = () => setIsLoreOpen(false);

  return (
    <header className="bg-theme-bg p-4 border-b-2 border-theme-border flex justify-between items-center shadow-lg shadow-black/20 sticky top-0 z-50">
      <Link to={isAuthenticated ? "/dashboard" : "/"} className="text-2xl sm:text-3xl font-bold text-theme-gold-text cursor-pointer hover:text-white transition-colors duration-300">
        LoL Stats
      </Link>
      <nav>
        {isAuthenticated ? (
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-theme-primary-text hidden sm:block">Olá, {user?.name || 'Jogador'}!</span>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 p-2 bg-theme-button-bg text-theme-primary-text rounded-md font-semibold transition-colors duration-300 hover:bg-theme-button-hover"
            >
              <LogOutIcon className="w-5 h-5"/> <span className="hidden sm:inline">Sair</span>
            </button>
            <button
              onClick={handleOpenLore}
              className="flex items-center gap-2 p-2 bg-theme-button-bg text-theme-primary-text rounded-md font-semibold transition-colors duration-300 hover:bg-theme-button-hover"
            >
              <BookOpenIcon className="w-5 h-5" />
              História
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="p-2 px-3 sm:px-4 bg-theme-button-bg text-theme-primary-text rounded-md font-semibold transition-colors duration-300 hover:bg-theme-button-hover">
              Login
            </Link>
            <Link to="/register" className="p-2 px-3 sm:px-4 bg-transparent border-2 border-theme-border text-theme-gold-text rounded-md font-semibold transition-colors duration-300 hover:bg-theme-border hover:text-black">
              Registrar
            </Link>
            <button
              onClick={handleOpenLore}
              className="flex items-center gap-2 p-2 bg-theme-button-bg text-theme-primary-text rounded-md font-semibold transition-colors duration-300 hover:bg-theme-button-hover"
            >
              <BookOpenIcon className="w-5 h-5" />
              História
            </button>
          </div>
        )}
      </nav>
      {/* Modal de história dos campeões */}
      {isLoreOpen && (
        <ChampionLoreModal onClose={handleCloseLore} />
      )}
    </header>
  );
};