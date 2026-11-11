import { ref, reactive } from 'vue';
import { generateBoard, isValidAnswer, checkWinner, getAIChoice, getPossibleAnswers } from '../utils/gameEngine.js';

/**
 * Service / Facade Pattern — GameFacade
 * Centraliza o estado reativo do jogo, reprodução de sons e regras de negócio,
 * desacoplando a interface visual (componentes Vue) da lógica da engine.
 */

// Estado global reativo
export const gameState = ref('setup'); // 'setup' | 'playing'
export const gameMode = ref('pvp');   // 'pvp' | 'pve'
export const aiDifficulty = ref('medio'); // 'facil' | 'medio' | 'dificil'

export const currentPlayer = ref('CT'); // 'CT' | 'T'
export const scores = reactive({ CT: 0, T: 0 });
export const steals = reactive({ CT: 3, T: 3 });

export const board = ref(Array(9).fill(null));
export const activeCriteria = ref({ rows: [], cols: [] });

export const winner = ref(null); // 'CT' | 'T' | 'draw' | null
export const winPattern = ref([]);

// Modais e HUD Feedback
export const showSearchModal = ref(false);
export const showSummaryModal = ref(false);
export const showExitConfirm = ref(false);
export const showRulesModal = ref(false);
export const currentCellIndex = ref(-1);
export const isStealAttempt = ref(false);
export const summaryReason = ref(''); // 'victory' | 'draw' | 'giveup'
export const hudToast = ref(null); // { text: string, tone: 'info' | 'warn' | 'error' | 'ct' | 't' }
let toastTimer = null;

export function notifyHud(text, tone = 'info', duration = 3200) {
  if (toastTimer) clearTimeout(toastTimer);
  hudToast.value = { text, tone };
  if (duration > 0) {
    toastTimer = setTimeout(() => {
      hudToast.value = null;
    }, duration);
  }
}

export function getCellCoord(index) {
  const rows = ['A', 'B', 'C'];
  const r = Math.floor(index / 3);
  const c = (index % 3) + 1;
  return `${rows[r] || 'A'}${c}`;
}

// Audio Web API
export const soundEnabled = ref(true);
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSound(type) {
  if (!soundEnabled.value) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'correct') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      osc.frequency.setValueAtTime(783.99, now + 0.16);
      gainNode.gain.setValueAtTime(0.15, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'incorrect') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(90, now + 0.25);
      gainNode.gain.setValueAtTime(0.15, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'steal') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(600, now + 0.1);
      osc.frequency.linearRampToValueAtTime(100, now + 0.25);
      gainNode.gain.setValueAtTime(0.15, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'victory') {
      const notes = [261.63, 329.63, 392.00, 523.25];
      notes.forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, now + idx * 0.12);
        g.gain.setValueAtTime(0.1, now + idx * 0.12);
        g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.3);
        o.start(now + idx * 0.12);
        o.stop(now + idx * 0.12 + 0.3);
      });
    }
  } catch (error) {
    console.error("Falha ao reproduzir som", error);
  }
}

/**
 * Inicia uma nova partida
 */
export function startNewGame(mode, difficulty = 'medio') {
  playSound('click');
  gameMode.value = mode;
  aiDifficulty.value = difficulty;

  winner.value = null;
  winPattern.value = [];
  board.value = Array(9).fill(null);
  steals.CT = 3;
  steals.T = 3;
  currentPlayer.value = 'CT';
  showSummaryModal.value = false;
  showExitConfirm.value = false;
  hudToast.value = null;

  activeCriteria.value = generateBoard();
  gameState.value = 'playing';
}

/**
 * Reseta a rodada atual com novo tabuleiro
 */
export function resetGame() {
  playSound('click');
  winner.value = null;
  winPattern.value = [];
  board.value = Array(9).fill(null);
  steals.CT = 3;
  steals.T = 3;
  currentPlayer.value = 'CT';
  showSummaryModal.value = false;
  hudToast.value = null;
  activeCriteria.value = generateBoard();
  triggerAIMoveIfNeeded();
}

/**
 * Solicita ou confirma saída para a tela de setup
 */
export function confirmReset() {
  playSound('click');
  showExitConfirm.value = true;
}

export function executeResetToSetup() {
  playSound('click');
  showExitConfirm.value = false;
  showSummaryModal.value = false;
  showSearchModal.value = false;
  hudToast.value = null;
  gameState.value = 'setup';
  scores.CT = 0;
  scores.T = 0;
}

export function cancelResetToSetup() {
  playSound('click');
  showExitConfirm.value = false;
}

/**
 * Alterna o turno
 */
export function switchTurn() {
  currentPlayer.value = currentPlayer.value === 'CT' ? 'T' : 'CT';
  triggerAIMoveIfNeeded();
}

/**
 * Pula vez
 */
export function skipTurn() {
  playSound('click');
  const skippedBy = currentPlayer.value;
  notifyHud(`${skippedBy === 'T' ? 'TR' : 'CT'} passou a vez.`, 'info', 2200);
  switchTurn();
}

/**
 * Força empate
 */
export function endAsDraw() {
  playSound('incorrect');
  winner.value = 'draw';
  summaryReason.value = 'draw';
  showSummaryModal.value = true;
}

/**
 * Desistir do jogo (exibe o gabarito)
 */
export function giveUp() {
  playSound('incorrect');
  const otherPlayer = currentPlayer.value === 'CT' ? 'T' : 'CT';
  winner.value = otherPlayer;
  scores[otherPlayer]++;
  summaryReason.value = 'giveup';
  showSummaryModal.value = true;
}

/**
 * Clique em célula do tabuleiro
 */
export function handleCellClick(index) {
  if (winner.value !== null) return;
  if (gameMode.value === 'pve' && currentPlayer.value === 'T') return;

  const cell = board.value[index];
  if (cell && cell.player === currentPlayer.value) {
    notifyHud(`${getCellCoord(index)} já é sua.`, 'info', 2200);
    return;
  }

  if (cell && cell.player !== currentPlayer.value) {
    if (steals[currentPlayer.value] <= 0) {
      playSound('incorrect');
      notifyHud('Sem roubos disponíveis.', 'error', 3000);
      return;
    }
    isStealAttempt.value = true;
  } else {
    isStealAttempt.value = false;
  }

  playSound('click');
  currentCellIndex.value = index;
  showSearchModal.value = true;
}

export function closeSearchModal() {
  playSound('click');
  showSearchModal.value = false;
}

export function closeSummaryModal() {
  playSound('click');
  showSummaryModal.value = false;
}

export function openRulesModal() {
  playSound('click');
  showRulesModal.value = true;
}

export function closeRulesModal() {
  showRulesModal.value = false;
}

/**
 * Processa palpite do jogador humano
 */
export function submitPlayerGuess(playerObject) {
  if (!playerObject) return { success: false, message: 'Selecione um jogador da lista.' };

  const cellIdx = currentCellIndex.value;
  const rowCriterion = activeCriteria.value.rows[Math.floor(cellIdx / 3)];
  const colCriterion = activeCriteria.value.cols[cellIdx % 3];
  const currentCell = board.value[cellIdx];

  if (isStealAttempt.value && currentCell && currentCell.playerId === playerObject.id) {
    playSound('incorrect');
    return {
      success: false,
      message: `Para roubar, escolha um jogador diferente de ${playerObject.nickname}.`
    };
  }

  if (isValidAnswer(playerObject, rowCriterion, colCriterion)) {
    const actingSide = currentPlayer.value;
    const coord = getCellCoord(cellIdx);
    if (isStealAttempt.value) {
      steals[actingSide]--;
      playSound('steal');
      notifyHud(`${actingSide === 'T' ? 'TR' : 'CT'} roubou ${coord} com ${playerObject.nickname}.`, actingSide === 'CT' ? 'ct' : 't');
    } else {
      playSound('correct');
      notifyHud(`${actingSide === 'T' ? 'TR' : 'CT'} marcou ${coord} com ${playerObject.nickname}.`, actingSide === 'CT' ? 'ct' : 't');
    }

    board.value[cellIdx] = {
      player: actingSide,
      playerNickname: playerObject.nickname,
      playerRealName: playerObject.name,
      playerNationality: playerObject.nationality,
      playerId: playerObject.id
    };
    showSearchModal.value = false;
    checkGameStatus();
    return { success: true };
  } else {
    playSound('incorrect');
    const failedSide = currentPlayer.value;
    setTimeout(() => {
      showSearchModal.value = false;
      notifyHud(`${playerObject.nickname} não serve para essa casa. ${failedSide === 'T' ? 'TR' : 'CT'} perdeu a vez.`, 'error');
      switchTurn();
    }, 1100);
    return {
      success: false,
      message: `${playerObject.nickname} não cumpre os dois critérios. Você perdeu a vez.`
    };
  }
}

/**
 * Verifica vitória / empate
 */
export function checkGameStatus() {
  const result = checkWinner(board.value);

  if (result.won) {
    playSound('victory');
    winner.value = result.winner;
    winPattern.value = result.pattern;
    scores[result.winner]++;
    summaryReason.value = 'victory';
    showSummaryModal.value = true;
  } else if (result.draw) {
    playSound('incorrect');
    winner.value = 'draw';
    summaryReason.value = 'draw';
    showSummaryModal.value = true;
  } else {
    switchTurn();
  }
}

/**
 * Dispara vez da IA se necessário
 */
export function triggerAIMoveIfNeeded() {
  if (gameMode.value === 'pve' && currentPlayer.value === 'T' && winner.value === null) {
    setTimeout(() => {
      aiPlayTurn();
    }, 1150);
  }
}

/**
 * Executa turno da IA
 */
export function aiPlayTurn() {
  if (winner.value !== null || currentPlayer.value !== 'T') return;

  const emptyIndices = [];
  const stealableIndices = [];

  board.value.forEach((cell, idx) => {
    if (cell === null || cell.player === null) {
      emptyIndices.push(idx);
    } else if (cell.player === 'CT' && steals.T > 0) {
      stealableIndices.push(idx);
    }
  });

  let targetIndex = -1;
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  // 1. Ganhar imediatamente
  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    const cells = [board.value[a], board.value[b], board.value[c]];
    const tCount = cells.filter(cell => cell && cell.player === 'T').length;
    const emptyCount = cells.filter(cell => cell === null).length;

    if (tCount === 2 && emptyCount === 1) {
      const emptyIdx = [a, b, c].find(idx => board.value[idx] === null);
      if (emptyIdx !== undefined) {
        targetIndex = emptyIdx;
        break;
      }
    }
  }

  // 2. Bloquear CT
  if (targetIndex === -1) {
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      const cells = [board.value[a], board.value[b], board.value[c]];
      const ctCount = cells.filter(cell => cell && cell.player === 'CT').length;
      const emptyCount = cells.filter(cell => cell === null).length;

      if (ctCount === 2 && emptyCount === 1) {
        const emptyIdx = [a, b, c].find(idx => board.value[idx] === null);
        if (emptyIdx !== undefined) {
          targetIndex = emptyIdx;
          break;
        }
      }
    }
  }

  // 3. Escolha aleatória ou roubo
  if (targetIndex === -1) {
    if (emptyIndices.length > 0 && (stealableIndices.length === 0 || Math.random() < 0.8)) {
      targetIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    } else if (stealableIndices.length > 0) {
      targetIndex = stealableIndices[Math.floor(Math.random() * stealableIndices.length)];
    }
  }

  if (targetIndex === -1) {
    skipTurn();
    return;
  }

  const rowCriterion = activeCriteria.value.rows[Math.floor(targetIndex / 3)];
  const colCriterion = activeCriteria.value.cols[targetIndex % 3];
  const existingCell = board.value[targetIndex];
  const isSteal = existingCell !== null;
  const excludedIds = isSteal && existingCell?.playerId ? [existingCell.playerId] : [];

  const aiChoice = getAIChoice(rowCriterion, colCriterion, aiDifficulty.value, excludedIds);
  const coord = getCellCoord(targetIndex);

  if (aiChoice && isValidAnswer(aiChoice, rowCriterion, colCriterion)) {
    if (isSteal) {
      steals.T--;
      playSound('steal');
      notifyHud(`Bot roubou ${coord} com ${aiChoice.nickname}.`, 't');
    } else {
      playSound('correct');
      notifyHud(`Bot marcou ${coord} com ${aiChoice.nickname}.`, 't');
    }

    board.value[targetIndex] = {
      player: 'T',
      playerNickname: aiChoice.nickname,
      playerRealName: aiChoice.name,
      playerNationality: aiChoice.nationality,
      playerId: aiChoice.id
    };

    checkGameStatus();
  } else {
    playSound('incorrect');
    notifyHud(
      aiChoice
        ? `Bot errou ${coord} com ${aiChoice.nickname}.`
        : `Bot não achou resposta para ${coord} e perdeu a vez.`,
      'info'
    );
    switchTurn();
  }
}

/**
 * Calcula Gabarito (respostas possíveis para cada célula do tabuleiro)
 */
export function getBoardGabarito() {
  if (!activeCriteria.value.rows.length || !activeCriteria.value.cols.length) return [];
  const gabarito = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const rowCrit = activeCriteria.value.rows[r];
      const colCrit = activeCriteria.value.cols[c];
      const index = r * 3 + c;
      const answers = getPossibleAnswers(rowCrit, colCrit);
      gabarito.push({
        index,
        coord: getCellCoord(index),
        rowLabel: rowCrit.label,
        colLabel: colCrit.label,
        rowValue: rowCrit.value,
        rowType: rowCrit.type,
        colValue: colCrit.value,
        colType: colCrit.type,
        answers,
        cellFilled: board.value[index]
      });
    }
  }
  return gabarito;
}
