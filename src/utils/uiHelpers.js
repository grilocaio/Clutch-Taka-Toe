/**
 * Helpers de apresentação compartilhados pelos componentes de UI.
 * Não contém regras de jogo — apenas formatação de rótulos.
 */

const CRITERION_TYPE_LABELS = {
  team: 'Equipe',
  nationality: 'País',
  achievement: 'Conquista',
  coach: 'Treinador',
  teammate: 'Companheiro'
};

export function getCriterionTypeLabel(type) {
  return CRITERION_TYPE_LABELS[type] || 'Critério';
}

// Critérios que usam retrato de pessoa (foto) em vez de logotipo
export function isPortraitCriterion(type) {
  return type === 'coach' || type === 'teammate';
}

export function getInitials(label, max = 2) {
  if (!label) return '?';
  const words = label.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, max).toUpperCase();
  return words.map(w => w[0]).join('').slice(0, max).toUpperCase();
}

export function sideLabel(side) {
  return side === 'T' ? 'TR' : 'CT';
}

export function shortCriterionLabel(label = '') {
  return label.replace(/^(Treinado por|Jogou com)\s+/i, '');
}
