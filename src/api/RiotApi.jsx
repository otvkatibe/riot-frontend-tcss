/**
 * Módulo de API para endpoints relacionados aos dados da Riot Games.
 */
import API from "./Auth";

const DDragon_VERSION = "14.12.1";

/**
 * Gera a URL para o ícone de perfil de um jogador.
 * @param {number} profileIconId - O ID do ícone de perfil.
 * @returns {string} A URL completa da imagem do ícone.
 */
export const getProfileIconUrl = (profileIconId) => {
  if (!profileIconId) return `https://placehold.co/80x80/0A323C/F0E6D2?text=?`;
  return `https://ddragon.leagueoflegends.com/cdn/${DDragon_VERSION}/img/profileicon/${profileIconId}.png`;
};

/**
 * Busca os dados de um jogador na API.
 * @param {string} gameName - O nome de invocador do jogador.
 * @param {string} tagLine - A tag do jogador.
 * @returns {Promise<object>} Um objeto com os dados do perfil do jogador.
 */
export const searchPlayer = async (gameName, tagLine) => {
  const puuidResponse = await API.get(`/riot/puuid?nome=${encodeURIComponent(gameName)}&tag=${encodeURIComponent(tagLine)}`);
  const puuid = puuidResponse.data.puuid;

  if (!puuid) {
    throw new Error("PUUID não encontrado para o jogador.");
  }

  const profileResponse = await API.get(`/riot/profile?puuid=${puuid}`);
  
  return {
    puuid: puuid,
    gameName: profileResponse.data.name || gameName,
    tagLine: tagLine,
    summonerLevel: profileResponse.data.summonerLevel,
    profileIconId: profileResponse.data.profileIconId,
    profileIconUrl: getProfileIconUrl(profileResponse.data.profileIconId),
    ranks: profileResponse.data.ranks,
  };
};

/**
 * Busca os dados de maestria de campeão de um jogador.
 * @param {string} gameName - O nome de invocador do jogador.
 * @param {string} tagLine - A tag do jogador.
 * @returns {Promise<Array<object>>} Uma lista com os campeões de maior maestria.
 */
export const getChampionMastery = async (gameName, tagLine) => {
  const { data } = await API.get(
    `/riot/maestria?nome=${encodeURIComponent(gameName)}&tag=${encodeURIComponent(
      tagLine
    )}`
  );
  return data.dados;
};

/**
 * Busca as estatísticas de um campeão específico para um jogador.
 * @param {string} gameName - O nome de invocador do jogador.
 * @param {string} tagLine - A tag do jogador.
 * @param {string} championId - O ID do campeão (ex: "Aatrox").
 * @returns {Promise<object>} Um objeto com as estatísticas do campeão.
 */
export const getChampionStats = async (gameName, tagLine, championId) => {
  const { data } = await API.get(`/riot/champion-stats?nome=${encodeURIComponent(gameName)}&tag=${encodeURIComponent(tagLine)}&champion=${championId}`);
  return data;
};

/**
 * Busca o top 5 de jogadores do elo Desafiante (Solo/Duo).
 * @returns {Promise<Array<object>>} Uma lista com os 5 melhores jogadores.
 */
export const getChallengerTop = async () => {
  const { data } = await API.get('/riot/challenger-top5'); // Rota corrigida e mais clara
  return data;
};

/**
 * Busca a lista de jogadores favoritos do usuário autenticado.
 * @returns {Promise<Array<object>>} Uma lista de objetos de favoritos.
 */
export const getFavorites = async () => {
  const { data } = await API.get("/riot/favorites");
  return data.map(fav => ({
    ...fav,
    gameName: fav.nome,
    tagLine: fav.tag,
    profileIconUrl: getProfileIconUrl(fav.profileIconId)
  }));
};

/**
 * Adiciona um jogador à lista de favoritos.
 * @param {object} playerData - Os dados do jogador a ser favoritado.
 * @param {string} observacao - Uma nota opcional sobre o jogador.
 * @returns {Promise<object>} O objeto do favorito recém-criado.
 */
export const addFavorite = async (playerData, observacao = '') => {
  const payload = {
    nome: playerData.gameName,
    tag: playerData.tagLine,
    tipo: "player",
    puuid: playerData.puuid,
    profileIconId: playerData.profileIconId,
    summonerLevel: playerData.summonerLevel,
    ranks: playerData.ranks,
    observacao: observacao, // Adiciona o campo observação
  };
  const { data } = await API.post("/riot/favorites", payload);
  return { ...data, profileIconUrl: getProfileIconUrl(data.profileIconId) };
};

/**
 * Remove um jogador da lista de favoritos.
 * @param {string} favoriteId - O ID do favorito a ser removido.
 */
export const removeFavorite = async (favoriteId) => {
  await API.delete(`/riot/favorites/${favoriteId}`);
};

/**
 * Busca o histórico de partidas de um jogador.
 * @param {string} gameName - O nome de invocador do jogador.
 * @param {string} tagLine - A tag do jogador.
 * @returns {Promise<Array<object>>} Uma lista com o histórico de partidas.
 */
export const getPlayerHistory = async (gameName, tagLine) => {
  const { data } = await API.get(`/riot/history?nome=${encodeURIComponent(gameName)}&tag=${encodeURIComponent(tagLine)}`);
  return data;
};