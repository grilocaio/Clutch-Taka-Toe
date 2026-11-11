<template>
  <div class="w-full">
    <!-- Tabuleiro 3x3 com cabeçalhos de critérios no estilo HLTV -->
    <div class="hltv-box p-2 sm:p-3 bg-panel/60">
      <div class="grid grid-cols-4 gap-1.5 sm:gap-2 select-none" role="grid" aria-label="Tabuleiro">
        <!-- Canto superior esquerdo: Indicador de vez / resultado -->
        <div
          class="aspect-square rounded-[2px] border flex flex-col items-center justify-center text-center transition-colors"
          :class="corner.box"
          role="presentation"
        >
          <span class="text-[10px] sm:text-xs font-bold uppercase tracking-wider" :class="corner.captionClass">
            {{ corner.caption }}
          </span>
          <span class="font-display font-bold uppercase leading-none mt-0.5 text-[26px] sm:text-[42px]" :class="corner.titleClass">
            {{ corner.title }}
          </span>
          <span v-if="corner.sub" class="text-[10px] sm:text-xs text-muted mt-1">{{ corner.sub }}</span>
        </div>

        <!-- Critérios das colunas -->
        <CriterionHeader v-for="col in activeCriteria.cols" :key="col.id" :criterion="col" />

        <template v-for="(row, rIndex) in activeCriteria.rows" :key="row.id">
          <!-- Critério da linha -->
          <CriterionHeader :criterion="row" />

          <!-- Casas jogáveis -->
          <button
            v-for="cIndex in [0, 1, 2]"
            :key="`${row.id}-${cIndex}`"
            type="button"
            :disabled="isLocked"
            @click="handleCellClick(rIndex * 3 + cIndex)"
            class="group relative aspect-square rounded-[2px] border overflow-hidden transition-[border-color,background-color,opacity] duration-150 disabled:cursor-default"
            :class="cellClass(rIndex * 3 + cIndex)"
            :aria-label="cellAriaLabel(rIndex, cIndex)"
          >
            <template v-if="board[rIndex * 3 + cIndex]?.player">
              <div :key="board[rIndex * 3 + cIndex].playerId" class="absolute inset-0 anim-cell-in">
                <FilledCell :cell="board[rIndex * 3 + cIndex]" />
              </div>

              <!-- Sobreposição de roubo -->
              <div
                v-if="canStealCell(rIndex * 3 + cIndex)"
                class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 bg-canvas/90 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"
              >
                <span class="hltv-badge-vrs">ROUBAR</span>
                <span class="font-sans text-xs sm:text-sm font-bold text-ink mt-0.5">Roubar casa</span>
                <span class="text-[10px] text-muted tabular-nums">{{ steals[currentPlayer] }} restantes</span>
              </div>
            </template>

            <!-- Casa vazia (limpa, com ícone + e contagem ao passar o mouse) -->
            <template v-else>
              <span class="absolute inset-0 flex items-center justify-center">
                <svg
                  class="w-6 h-6 sm:w-7 sm:h-7 transition-colors"
                  :class="isLocked ? 'text-panel-3' : (currentPlayer === 'CT' ? 'text-line-strong group-hover:text-ct-bright' : 'text-line-strong group-hover:text-t-bright')"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"
                >
                  <path d="M12 6v12M6 12h12" />
                </svg>
              </span>
              <span
                v-if="!isLocked"
                class="absolute inset-x-0 bottom-1.5 sm:bottom-2 text-center text-[10px] sm:text-xs font-medium text-hltv-link opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity tabular-nums"
              >
                {{ poolLabel(rIndex, cIndex) }}
              </span>
            </template>
          </button>
        </template>
      </div>
    </div>

    <!-- Ações secundárias -->
    <div class="mt-2.5 flex items-center gap-2">
      <button
        type="button"
        @click="skipTurn"
        :disabled="isLocked"
        class="h-8 px-3 rounded-[3px] bg-panel-3 hover:bg-line-strong border border-line-strong text-xs font-semibold text-ink disabled:opacity-40 transition-colors flex items-center gap-1.5"
      >
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 5 8 7-8 7V5ZM18 5v14" /></svg>
        Passar a vez
      </button>

      <div class="ml-auto flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          @click="requestAction('draw')"
          :disabled="winner !== null"
          class="h-8 px-3 rounded-[3px] border text-xs font-semibold transition-colors disabled:opacity-40"
          :class="pendingAction === 'draw'
            ? 'bg-panel-3 border-hltv-link text-white'
            : 'bg-panel border-line-box text-soft hover:bg-panel-2 hover:text-ink'"
        >
          {{ pendingAction === 'draw' ? 'Confirmar empate' : 'Empate' }}
        </button>
        <button
          type="button"
          @click="requestAction('giveup')"
          :disabled="winner !== null"
          class="h-8 px-3 rounded-[3px] border text-xs font-semibold transition-colors disabled:opacity-40"
          :class="pendingAction === 'giveup'
            ? 'bg-loss border-loss text-white'
            : 'bg-panel border-line-box text-soft hover:bg-loss/20 hover:border-loss hover:text-[#ff9c9c]'"
        >
          {{ pendingAction === 'giveup' ? 'Confirmar desistência' : 'Desistir' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onBeforeUnmount } from 'vue';
import CriterionHeader from './CriterionHeader.vue';
import FilledCell from './FilledCell.vue';
import { getPossibleAnswers } from '../utils/gameEngine';
import { sideLabel } from '../utils/uiHelpers';
import {
  activeCriteria,
  board,
  winPattern,
  currentPlayer,
  steals,
  winner,
  gameMode,
  getCellCoord,
  handleCellClick,
  skipTurn,
  endAsDraw,
  giveUp
} from '../services/gameFacade';

const isBotTurn = computed(() => gameMode.value === 'pve' && currentPlayer.value === 'T');
const isLocked = computed(() => winner.value !== null || isBotTurn.value);

const corner = computed(() => {
  if (winner.value === 'draw') {
    return {
      caption: 'Fim',
      title: 'Empate',
      box: 'bg-panel border-line-box',
      captionClass: 'text-muted',
      titleClass: 'text-soft text-[22px] sm:text-[32px]'
    };
  }
  if (winner.value) {
    const isCT = winner.value === 'CT';
    return {
      caption: 'Vitória',
      title: sideLabel(winner.value),
      box: isCT ? 'bg-ct-bg border-ct-bright' : 'bg-t-bg border-t-bright',
      captionClass: isCT ? 'text-ct-ink' : 'text-t-ink',
      titleClass: isCT ? 'text-ct-bright' : 'text-t-bright'
    };
  }
  const isCT = currentPlayer.value === 'CT';
  return {
    caption: isBotTurn.value ? 'Bot' : 'Vez de',
    title: sideLabel(currentPlayer.value),
    sub: isBotTurn.value ? 'pensando…' : '',
    box: isCT ? 'bg-ct-bg border-ct-bright/70' : 'bg-t-bg border-t-bright/70',
    captionClass: isCT ? 'text-ct-ink' : 'text-t-ink',
    titleClass: isCT ? 'text-ct-bright' : 'text-t-bright'
  };
});

const poolCounts = computed(() => {
  const { rows, cols } = activeCriteria.value;
  const counts = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      counts.push(rows[r] && cols[c] ? getPossibleAnswers(rows[r], cols[c]).length : 0);
    }
  }
  return counts;
});

function poolLabel(r, c) {
  const n = poolCounts.value[r * 3 + c];
  return n === 1 ? '1 resposta' : `${n} respostas`;
}

function canStealCell(index) {
  if (isLocked.value) return false;
  const cell = board.value[index];
  if (!cell || !cell.player) return false;
  return cell.player !== currentPlayer.value && steals[currentPlayer.value] > 0;
}

function cellClass(index) {
  const cell = board.value[index];
  const inWin = winPattern.value.includes(index);
  const gameOver = winner.value !== null;
  const classes = [];

  if (!cell || !cell.player) {
    classes.push('bg-panel border-line-box');
    if (!isLocked.value) {
      classes.push(currentPlayer.value === 'CT' ? 'hover:border-ct-bright hover:bg-panel-2' : 'hover:border-t-bright hover:bg-panel-2');
    }
  } else if (cell.player === 'CT') {
    classes.push('bg-ct-bg', inWin ? 'border-ct-bright border-2' : 'border-ct-bright/70');
  } else {
    classes.push('bg-t-bg', inWin ? 'border-t-bright border-2' : 'border-t-bright/70');
  }

  if (gameOver && winPattern.value.length && !inWin) classes.push('opacity-45');
  return classes;
}

function cellAriaLabel(r, c) {
  const index = r * 3 + c;
  const row = activeCriteria.value.rows[r];
  const col = activeCriteria.value.cols[c];
  const cell = board.value[index];
  const base = `${getCellCoord(index)}: ${row?.label} e ${col?.label}`;
  if (cell?.player) return `${base}. Marcada por ${sideLabel(cell.player)} com ${cell.playerNickname}.`;
  return `${base}. Vazia.`;
}

const pendingAction = ref(null);
let pendingTimer = null;

function requestAction(action) {
  if (pendingAction.value === action) {
    clearTimeout(pendingTimer);
    pendingAction.value = null;
    if (action === 'draw') endAsDraw();
    else giveUp();
    return;
  }
  pendingAction.value = action;
  clearTimeout(pendingTimer);
  pendingTimer = setTimeout(() => { pendingAction.value = null; }, 3000);
}

onBeforeUnmount(() => clearTimeout(pendingTimer));
</script>
