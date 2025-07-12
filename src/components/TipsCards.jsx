import React, { useState } from "react";

const tips = [
  "Sempre compre wards! A visão é crucial para evitar ganks e controlar objetivos importantes como Dragão e Barão.",
  "Aprenda a fazer last hit nos minions. Apenas eliminar o minion no último momento garante o ouro máximo.",
  "Mantenha o mapa sempre visível. Olhe para o minimapa a cada 3-5 segundos para ter consciência situacional.",
  "Controle as ondas de minions. Saber quando empurrar ou congelar a lane pode determinar o resultado do jogo.",
  "Coordene com seu time para objetivos. Dragões e Barão podem virar completamente uma partida.",
  "Builds são situacionais. Adapte seus itens baseado na composição inimiga e no estado do jogo.",
  "Aprenda os tempos de respawn dos camps da jungle. Isso ajuda no controle de território e farm eficiente.",
  "Use pings para comunicar com o time. Comunicação clara é essencial, mesmo sem chat de voz.",
  "Gerencie seu mana/energia. Ficar sem recursos no momento errado pode custar kills ou objetivos.",
  "Pratique combos de habilidades no Practice Tool. Muscle memory é fundamental em situações de pressão.",
  "Observe as builds dos profissionais, mas entenda o porquê de cada escolha antes de copiar.",
  "Aprenda a fazer roaming no momento certo. Ajudar outras lanes pode acelerar sua vantagem no jogo.",
  "Controle seu tilt. Manter a calma e foco é mais importante que habilidade mecânica em muitos casos.",
  "Estude os power spikes dos campeões. Saber quando você é forte ou fraco define suas jogadas.",
  "Sempre tenha um plano de escape. Posicionamento é tão importante quanto saber atacar.",
  "Use o recall estrategicamente. Voltar na base no momento certo pode dar vantagem significativa na lane.",
  "Aprenda a calcular dano. Saber se consegue matar o oponente evita trades ruins.",
  "Gerencie as waves antes de objectives. Minions podem decidir se você consegue contestar ou não.",
  "Pratique diferentes campeões em cada role. Versatilidade te torna um jogador mais completo.",
  "Analise suas replays. Identificar erros próprios é a forma mais rápida de melhorar no jogo.",
  "Aprenda a controlar as waves: freezing, slow push e fast push são técnicas fundamentais para dominar a lane.",
  "Invada a jungle inimiga quando souber onde o jungler está. Roubar camps pode atrasar muito o adversário.",
  "Use o Teleport para objetivos, não apenas para voltar à lane. Um TP bem usado pode decidir uma teamfight.",
  "Compre itens de controle como Lembrete Sombrio ou Cajado do Vazio contra times com muito tank ou cura.",
  "Aprenda os cooldowns das ultimates inimigas. Engage quando souber que eles não têm escape.",
  "Posicione-se sempre atrás dos minions contra campeões com skillshots (Blitzcrank, Thresh, Morgana).",
  "Use a fog of war a seu favor. Desapareça do mapa para criar pressão psicológica no inimigo.",
  "Aprenda a fazer split push efetivo. Pressione uma lane enquanto seu time agrupa em outro lugar.",
  "Compre Elixires nos late game. Eles podem dar a vantagem necessária para fechar o jogo.",
  "Controle os bushes próximos aos objetivos. A visão pode determinar quem consegue roubar o Dragão/Barão.",
  "Aprenda quando fazer dive nas torres. Tankar a torre no momento certo pode garantir kills importantes.",
  "Use o chat para cronometrar summoner spells inimigas. Flash sem cooldown = oportunidade de kill.",
  "Não persiga kills desnecessárias. Às vezes é melhor pegar uma torre ou farm que uma kill arriscada.",
  "Aprenda a jogar ao redor do seu carry. Se o ADC está fed, proteja-o; se está fraco, procure outros win conditions.",
  "Estude matchups antes de jogar ranked. Saber o que fazer contra cada campeão é meio caminho andado.",
  "Compre QSS/Mercurial contra CCs pesados. Um cleanse bem usado pode virar uma teamfight inteira.",
  "Aprenda os timings de volta à base. Sempre tente voltar com gold suficiente para um item significativo.",
  "Use wards ofensivas, não apenas defensivas. Vision no território inimigo permite picks e controle.",
  "Pratique kiting e orb walking. Atacar enquanto se move é essencial para ADCs e alguns midlaners.",
  "Aprenda a gerenciar as waves antes de fazer recall. Empurrar ou congelar pode negar farm ao oponente.",
  "Use sweeper quando estiver na frente. Negar visão inimiga é tão importante quanto ter a sua própria.",
  "Aprenda os power spikes de itens. Alguns campeões ficam muito fortes com 1-2 itens específicos.",
  "Não force objectives quando não tem visão. É melhor recuar que dar uma teamfight às cegas.",
  "Estude rotas de jungle. Saber onde o jungler vai estar pode prevenir ganks e permitir counter-jungle.",
  "Use pings de perigo liberalmente. É melhor avisar demais que de menos sobre rotações inimigas.",
  "Aprenda a fazer bait. Fingir estar vulnerável pode atrair inimigos para uma emboscada do seu time.",
  "Compre boots adequados à situação: Ninja Tabi contra AD, Mercury contra AP/CC.",
  "Pratique teamfighting no ARAM. É um ótimo modo para melhorar mecânicas de luta em grupo.",
  "Aprenda a calcular experiência. Às vezes vale mais negar XP que conseguir um kill.",
  "Use Pink Wards em bushes estratégicos. Uma ward bem posicionada pode durar o jogo inteiro.",
  "Estude builds situacionais. Itens como Armadura de Espinhos ou Força da Natureza podem counter builds específicas.",
  "Aprenda quando fazer proxy farming. Farmar atrás da torre inimiga pode quebrar o freeze.",
  "Use a vantagem numérica. Se estão 5v4, force um objetivo imediatamente.",
  "Pratique cancel de animação. Cancelar animações desnecessárias pode acelerar seu combo significativamente.",
  "Aprenda a identificar win conditions. Nem sempre o objetivo é matar; às vezes é controlar, às vezes é escalar.",
  "Use informações do scoreboard. KDA, farm e itens dos inimigos mostram quem está forte ou fraco.",
  "Aprenda timing de jungle camps. Saber quando buffs e camps importantes respawnam é crucial.",
  "Pratique flashes ofensivos. Um flash agressivo bem executado pode garantir kills impossíveis.",
  "Gerencie sua economia. Às vezes é melhor economizar para um item grande que comprar vários pequenos.",
  "Aprenda a fazer zone control. Controlar área pode ser mais valioso que conseguir kills.",
  "Use advantages temporárias. Se o inimigo recallou, aproveite para empurrar e conseguir vantagem."
];

function getRandomTip(currentIndex) {
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * tips.length);
  } while (newIndex === currentIndex && tips.length > 1);
  return newIndex;
}

const TipsCards = () => {
  const [tipIndex, setTipIndex] = useState(() => getRandomTip(-1));

  const handleNewTip = () => {
    setTipIndex(getRandomTip(tipIndex));
  };

  return (
    <div className="flex flex-col items-center py-6">
      <h2 className="text-2xl font-bold text-theme-gold-text mb-6 text-center">
        Dicas para Melhorar no LoL
      </h2>
      <div className="bg-[#0A1428]/80 backdrop-blur-sm border-l-4 border-theme-gold-text text-theme-primary-text p-4 rounded shadow-md max-w-xl w-full mb-4 transition-all duration-200 border-2 border-theme-input-border">
        <span className="block text-lg font-medium">{tips[tipIndex]}</span>
      </div>
      <button
        onClick={handleNewTip}
        className="bg-theme-button-bg hover:bg-theme-button-hover text-theme-primary-text font-semibold py-2 px-6 rounded shadow transition-colors duration-300 border-2 border-theme-border hover:border-theme-gold-text"
      >
        Nova dica
      </button>
    </div>
  );
};

export default TipsCards;