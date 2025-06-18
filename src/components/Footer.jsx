/**
 * Componente de rodapé da aplicação.
 * @returns {JSX.Element} O elemento do rodapé.
 */
export const Footer = () => (
  <footer className="text-center p-4 mt-auto border-t border-theme-border text-theme-primary-text text-sm">
      League-Stats © {new Date().getFullYear()}. Todos os direitos reservados.
  </footer>
);