import { PLAYERS } from './csData.js';
import { evaluateCriterion } from '../evaluators/criterionEvaluators.js';
import { createBoard } from '../factories/boardFactory.js';

/**
 * Game Engine — Utilitários refatorados (SRP e DIP)
 */

// Delegado ao Evaluator Strategy
export function matchCriterion(player, criterion) {
  return evaluateCriterion(player, criterion);
}

// Verifica se um jogador atende a ambos os critérios da célula
export function isValidAnswer(player, rowCriterion, colCriterion) {
  return evaluateCriterion(player, rowCriterion) && evaluateCriterion(player, colCriterion);
}

// Retorna todas as respostas possíveis para uma célula
export function getPossibleAnswers(rowCriterion, colCriterion) {
  if (!rowCriterion || !colCriterion) return [];
  return PLAYERS.filter(player => isValidAnswer(player, rowCriterion, colCriterion));
}

// Delegado à BoardFactory
export function generateBoard() {
  return createBoard();
}

// Verifica condição de vitória ou empate no tabuleiro 3x3
export function checkWinner(board) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (
      board[a] && board[a].player &&
      board[b] && board[b].player &&
      board[c] && board[c].player &&
      board[a].player === board[b].player &&
      board[a].player === board[c].player
    ) {
      return { won: true, winner: board[a].player, pattern };
    }
  }

  const isFull = board.every(cell => cell !== null && cell.player !== null);
  if (isFull) return { draw: true };

  return { won: false };
}

// Decisão da IA baseada na dificuldade e respostas válidas
export function getAIChoice(rowCriterion, colCriterion, difficulty, usedPlayerIds = []) {
  const possibleAnswers = getPossibleAnswers(rowCriterion, colCriterion)
    .filter(p => !usedPlayerIds.includes(p.id));

  if (possibleAnswers.length === 0) return null;

  let hitRate = 0.4;
  if (difficulty === 'medio') hitRate = 0.7;
  else if (difficulty === 'dificil') hitRate = 0.95;

  if (Math.random() < hitRate) {
    return possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)];
  } else {
    if (Math.random() < 0.5) {
      const invalid = PLAYERS.filter(p =>
        !isValidAnswer(p, rowCriterion, colCriterion) && !usedPlayerIds.includes(p.id)
      );
      if (invalid.length > 0) {
        return invalid[Math.floor(Math.random() * invalid.length)];
      }
    }
    return null;
  }
}
