/**
 * Strategy Pattern para Avaliação de Critérios (Open/Closed Principle - OCP)
 * Permite estender novos tipos de critérios sem alterar a lógica da engine de jogo.
 */

const criterionEvaluators = {
  team: (player, criterion) => {
    if (!Array.isArray(player.teams)) return false;
    if (criterion.value === 'SK Gaming') {
      return player.teams.includes('SK Gaming') || player.teams.includes('Luminosity');
    }
    if (criterion.value === 'Virtus.pro') {
      return player.teams.includes('Virtus.pro') || player.teams.includes('Outsiders');
    }
    return player.teams.includes(criterion.value);
  },

  nationality: (player, criterion) => {
    return player.nationality === criterion.value;
  },

  teammate: (player, criterion) => {
    if (player.nickname === criterion.value || player.id === criterion.value) {
      return false;
    }
    return Array.isArray(player.teammates) && player.teammates.includes(criterion.value);
  },

  coach: (player, criterion) => {
    return Array.isArray(player.coaches) && player.coaches.includes(criterion.value);
  },

  achievement: (player, criterion) => {
    if (criterion.value === 'multiMajor') {
      return (player.majorsCount || 0) >= 2;
    }
    return !!player[criterion.value];
  }
};

/**
 * Avalia se um jogador atende a um critério usando a estratégia correspondente.
 * @param {Object} player - Objeto do jogador de CS
 * @param {Object} criterion - Critério a ser avaliado
 * @returns {boolean}
 */
export function evaluateCriterion(player, criterion) {
  if (!player || !criterion) return false;
  const evaluator = criterionEvaluators[criterion.type];
  if (!evaluator) return false;
  return evaluator(player, criterion);
}

/**
 * Registra ou estende uma nova estratégia de avaliação dinamicamente (OCP).
 * @param {string} type - Tipo do critério
 * @param {Function} evaluatorFn - Função (player, criterion) => boolean
 */
export function registerCriterionEvaluator(type, evaluatorFn) {
  criterionEvaluators[type] = evaluatorFn;
}

export default criterionEvaluators;
