# LoL Stats - Verificador de Estatísticas de League of Legends

LoL Stats é uma aplicação web que permite aos usuários buscar estatísticas de jogadores de League of Legends, visualizar seus ranks, nível e adicionar jogadores a uma lista de favoritos. O projeto utiliza React com Vite para o frontend e se conecta a um backend para autenticação e para buscar dados da API da Riot Games.

## Funcionalidades Principais

*   **Autenticação de Usuários:**
    *   Registro de novas contas.
    *   Login para usuários existentes.
    *   Sessão persistente (o usuário continua logado após recarregar a página).
*   **Busca de Jogadores:**
    *   Pesquisa de jogadores de League of Legends por Nome de Invocador e Tag.
    *   Exibição de informações do jogador, incluindo:
        *   Nome de Invocador e Tag.
        *   Ícone de Perfil.
        *   Nível de Invocador.
        *   Estatísticas de Ranqueadas Solo/Duo e Flex (Tier, Rank, PDL, Vitórias/Derrotas).
*   **Sistema de Favoritos:**
    *   Adicionar jogadores pesquisados à lista de favoritos (requer login).
    *   Remover jogadores da lista de favoritos.
    *   Visualizar a lista de jogadores favoritos no Dashboard.
*   **Interface Responsiva:**
    *   Design adaptável para diferentes tamanhos de tela.
    *   Notificações (toasts) para feedback ao usuário.

## Tecnologias Utilizadas (Frontend)

*   **React (v19+):** Biblioteca JavaScript para construção de interfaces de usuário.
*   **Vite:** Ferramenta de build e servidor de desenvolvimento rápido.
*   **Tailwind CSS:** Framework CSS utility-first para estilização rápida.
*   **React Router DOM (v6+):** Para gerenciamento de rotas na aplicação.
*   **Axios:** Cliente HTTP para realizar requisições à API backend.
*   **React Toastify:** Para exibir notificações (toasts) amigáveis.
*   **ESLint:** Para linting de código JavaScript/JSX.

## Pré-requisitos

*   Node.js (versão 18.x ou superior recomendada)
*   npm, yarn ou pnpm
*   Um backend configurado e em execução que sirva os endpoints esperados (autenticação, proxy para Riot API, gerenciamento de favoritos).

## Como Executar o Frontend

1.  **Clone o repositório (se ainda não o fez):**
    ```bash
    git clone <url-do-seu-repositorio>
    cd <nome-do-repositorio>/riot-frontend
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```
    ou
    ```bash
    yarn install
    ```

3.  **Configure as Variáveis de Ambiente (se necessário):**
    *   Este projeto, como configurado em `#src/api/Auth.jsx`, aponta para `https://riot-backend.vercel.app` como `baseURL`. Se o seu backend estiver em outro local, você pode:
        *   Alterar diretamente no arquivo `#src/api/Auth.jsx`.
        *   (Recomendado para flexibilidade) Modificar para usar uma variável de ambiente Vite (ex: `import.meta.env.VITE_API_BASE_URL`) e criar um arquivo `.env` na raiz de `riot-frontend` com:
            ```env
            VITE_API_BASE_URL=http://localhost:3001 # Ou a URL do seu backend
            ```

4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    ou
    ```bash
    yarn dev
    ```
    A aplicação estará disponível em `http://localhost:5173` (ou outra porta, se a 5173 estiver ocupada).

## Scripts Disponíveis

No diretório `riot-frontend`, você pode executar os seguintes scripts:

*   `npm run dev` ou `yarn dev`:
    Inicia o servidor de desenvolvimento Vite com Hot Module Replacement (HMR).

*   `npm run build` ou `yarn build`:
    Compila a aplicação para produção na pasta `dist`.

*   `npm run lint` ou `yarn lint`:
    Executa o ESLint para verificar erros e padrões de código.

*   `npm run preview` ou `yarn preview`:
    Inicia um servidor local para visualizar a build de produção (após executar `npm run build`).

## Estrutura de Pastas (Frontend - `src`)

```
src/
├── api/              # Lógica de comunicação com a API backend (Auth, RiotApi)
├── components/       # Componentes React reutilizáveis (Header, PlayerCard, etc.)
│   └── icons/        # Componentes de ícones SVG
├── contexts/         # Contextos React (ex: AuthContext para gerenciamento de autenticação)
├── hooks/            # Hooks personalizados (ex: PrivateRoute)
├── pages/            # Componentes de página (Dashboard, Home, Login, Register)
├── App.jsx           # Componente principal da aplicação, define rotas e layout base
├── App.css           # Estilos globais (se houver, a maior parte é Tailwind)
├── index.css         # Configurações base do Tailwind e estilos globais
└── main.jsx          # Ponto de entrada da aplicação React
```