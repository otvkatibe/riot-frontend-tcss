# LoL Stats - Verificador de Estatísticas de League of Legends

LoL Stats é uma aplicação web interativa construída com React e Tailwind CSS que permite aos usuários buscar estatísticas detalhadas de jogadores de League of Legends. A plataforma oferece funcionalidades de autenticação, busca de perfis, visualização de maestrias de campeões e um sistema de favoritos.

## Funcionalidades Principais

*   **Autenticação de Usuários:**
    *   Sistema completo de registro e login.
    *   Sessão de usuário persistente com JWT, mantendo o usuário conectado.
    *   Rotas protegidas, como o Dashboard, acessíveis apenas para usuários autenticados.

*   **Busca e Visualização de Jogadores:**
    *   Pesquisa de jogadores por Nome de Invocador e Tag.
    *   Exibição de um card de perfil com:
        *   Ícone de perfil, nome e nível.
        *   Ranks detalhados para as filas Solo/Duo e Flex (elo, divisão, PDL, vitórias e derrotas).

*   **Análise de Campeões:**
    *   **Lista de Maestrias:** Exibe os 10 campeões com maior pontuação de maestria do jogador pesquisado.
    *   **Modal de Estatísticas Detalhadas:** Ao clicar no ícone de um campeão, um modal exibe estatísticas agregadas (KDA, Win Rate, CS/min) e um **histórico de partidas recentes** com aquele campeão, mostrando KDA, duração, CS, rota (lane) e função (role) de cada jogo.

*   **Sistema de Favoritos (Requer Login):**
    *   Adicione ou remova jogadores pesquisados da sua lista de favoritos com um clique.
    *   **Busca Rápida:** Clique em um jogador na sua lista de favoritos para buscá-lo instantaneamente.
    *   Visualize e gerencie sua lista de jogadores favoritos no Dashboard.

*   **Interface Moderna e Responsiva:**
    *   Design construído com Tailwind CSS, totalmente adaptável para desktops e dispositivos móveis.
    *   Notificações (toasts) para fornecer feedback claro sobre as ações do usuário.

## Tecnologias Utilizadas

*   **Frontend:**
    *   **React:** Biblioteca para construção de interfaces de usuário.
    *   **Vite:** Ferramenta de build e servidor de desenvolvimento de alta performance.
    *   **Tailwind CSS:** Framework CSS utility-first para estilização rápida e consistente.
    *   **React Router DOM:** Para gerenciamento de rotas na aplicação.
    *   **Axios:** Cliente HTTP para realizar requisições à API do backend.
    *   **React Toastify:** Para exibir notificações amigáveis.
*   **Backend (Dependência):**
    *   A aplicação consome uma API backend (Node.js/Express) responsável pela autenticação, gerenciamento de favoritos e por atuar como um proxy seguro para a API oficial da Riot Games.

## Pré-requisitos

*   Node.js (versão 18.x ou superior)
*   npm, yarn ou pnpm
*   Um backend compatível em execução.

## Como Executar o Projeto

1.  **Clone o repositório:**
    ```bash
    git clone <url-do-seu-repositorio>
    cd <nome-do-repositorio>
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure a URL da API:**
    *   A URL base da API está definida no arquivo `src/api/Auth.jsx`. Por padrão, está configurada como `https://riot-backend.vercel.app`.
    *   Se o seu backend estiver rodando em outro endereço, altere a propriedade `baseURL` neste arquivo:
    
    ```javascript
    // em src/api/Auth.jsx
    const API = axios.create({
      baseURL: "http://localhost:3001", // Altere para a URL do seu backend
      withCredentials: true,
    });
    ```

4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    A aplicação estará disponível em `http://localhost:5173` (ou em outra porta, caso a 5173 esteja em uso).

## Scripts Disponíveis

*   `npm run dev`: Inicia o servidor de desenvolvimento com Hot Module Replacement (HMR).
*   `npm run build`: Compila a aplicação para produção na pasta `dist`.
*   `npm run lint`: Executa o ESLint para verificar erros e padrões de código.
*   `npm run preview`: Inicia um servidor local para visualizar a build de produção.

## Estrutura de Pastas (`src`)

```
src/
├── api/          # Módulos para comunicação com a API (Auth, RiotApi)
├── components/   # Componentes React reutilizáveis (Header, PlayerCard, etc.)
│   └── icons/    # Componentes de ícones SVG
├── contexts/     # Contextos React (AuthContext para gerenciamento de sessão)
├── hooks/        # Hooks personalizados (PrivateRoute)
├── pages/        # Componentes de página (Dashboard, Home, Login, Register)
├── App.jsx       # Componente principal, define rotas e layout
├── index.css     # Configurações base do Tailwind e estilos globais
└── main.jsx      # Ponto de entrada da aplicação React
```