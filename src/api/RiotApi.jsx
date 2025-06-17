import axios from "axios";
import API from "./Auth"; // Deve importar a instância API de Auth.jsx

const DDragon_VERSION = "14.12.1"; // Mantenha atualizado ou obtenha dinamicamente

export const getProfileIconUrl = (profileIconId) => {
  if (!profileIconId) return `https://placehold.co/80x80/0A323C/F0E6D2?text=?`;
  return `https://ddragon.leagueoflegends.com/cdn/${DDragon_VERSION}/img/profileicon/${profileIconId}.png`;
};

export const searchPlayer = async (gameName, tagLine) => {
  // O backend espera nome e tag, não gameName e tagLine diretamente na URL para esta operação combinada.
  // Primeiro, obtemos o PUUID.
  const puuidResponse = await API.get(`/riot/puuid?nome=${encodeURIComponent(gameName)}&tag=${encodeURIComponent(tagLine)}`);
  const puuid = puuidResponse.data.puuid;

  if (!puuid) {
    throw new Error("PUUID não encontrado para o jogador.");
  }

  // Depois, obtemos o perfil usando o PUUID.
  const profileResponse = await API.get(`/riot/profile?puuid=${puuid}`);
  
  // Montamos o objeto de jogador esperado pelo PlayerCard
  return {
    puuid: puuid,
    gameName: profileResponse.data.name || gameName, // O nome da rota profile pode ser o nome de invocador
    tagLine: tagLine, // A tag original da busca
    summonerLevel: profileResponse.data.summonerLevel,
    profileIconId: profileResponse.data.profileIconId,
    profileIconUrl: getProfileIconUrl(profileResponse.data.profileIconId),
    ranks: profileResponse.data.ranks,
    // Adicione outros campos que seu PlayerCard ou lógica possam precisar
  };
};

export const getFavorites = async () => {
  const { data } = await API.get("/riot/favorites");
  // O backend retorna profileIconId, precisamos mapear para profileIconUrl
  return data.map(fav => ({
    ...fav,
    gameName: fav.name, // Ajuste se o nome do campo for diferente
    // tag: fav.tag, // Já deve estar presente
    profileIconUrl: getProfileIconUrl(fav.profileIconId)
  }));
};

export const addFavorite = async (playerData) => {
  // O backend espera nome, tag, tipo, e pode aceitar outros campos via ...req.body
  const payload = {
    nome: playerData.gameName,
    tag: playerData.tagLine,
    tipo: "player", // Assumindo tipo player por padrão
    puuid: playerData.puuid,
    profileIconId: playerData.profileIconId,
    summonerLevel: playerData.summonerLevel,
    // observacao: "Minha observação aqui", // Adicionar se tiver campo de observação
  };
  const { data } = await API.post("/riot/favorites", payload);
  return { ...data, profileIconUrl: getProfileIconUrl(data.profileIconId) };
};

export const removeFavorite = async (favoriteId) => {
  // O backend espera o ID do favorito na URL
  // O endpoint é /riot/favorites/:id
  // O controller do backend usa req.params.id
  // A rota em favorite.riot.route.js é router.delete('/:favoriteId', ...)
  // Então, o nome do parâmetro é 'favoriteId'
  await API.delete(`/riot/favorites/${favoriteId}`);
};