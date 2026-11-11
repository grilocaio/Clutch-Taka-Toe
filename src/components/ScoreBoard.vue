<template>
  <section class="hltv-box overflow-hidden" aria-label="Placar">
    <div class="grid grid-cols-[1fr_auto_1fr] items-center">
      <!-- CT (Esquerda) -->
      <div
        class="relative px-3 sm:px-4 py-2.5 transition-colors"
        :class="isActive('CT') ? 'bg-ct-bg' : 'bg-panel'"
      >
        <span class="absolute inset-x-0 top-0 h-[3px] transition-colors" :class="isActive('CT') ? 'bg-ct-bright' : 'bg-transparent'"></span>
        <div class="flex items-center gap-2 min-w-0">
          <span class="hltv-badge-rank">CT</span>
          <span class="font-bold text-xs sm:text-sm truncate" :class="isActive('CT') ? 'text-ink' : 'text-soft'">
            {{ gameMode === 'pve' ? 'Você' : 'Jogador 1' }}
          </span>
        </div>
        <StealPips side="CT" :count="steals.CT" class="mt-1.5" />
      </div>

      <!-- Placar central enxuto -->
      <div class="px-3 sm:px-5 py-2 flex flex-col items-center justify-center border-x border-line-box bg-panel-alt min-w-[88px]">
        <div class="font-sans font-bold text-2xl sm:text-3xl leading-none tabular-nums flex items-center gap-1.5">
          <span :class="scores.CT > scores.T ? 'text-ct-bright' : 'text-ink'">{{ scores.CT }}</span>
          <span class="text-muted text-lg">:</span>
          <span :class="scores.T > scores.CT ? 'text-t-bright' : 'text-ink'">{{ scores.T }}</span>
        </div>
        <span class="text-[10px] text-muted mt-1 whitespace-nowrap">{{ modeLabel }}</span>
      </div>

      <!-- TR (Direita) -->
      <div
        class="relative px-3 sm:px-4 py-2.5 text-right transition-colors"
        :class="isActive('T') ? 'bg-t-bg' : 'bg-panel'"
      >
        <span class="absolute inset-x-0 top-0 h-[3px] transition-colors" :class="isActive('T') ? 'bg-vrs' : 'bg-transparent'"></span>
        <div class="flex items-center justify-end gap-2 min-w-0">
          <span class="font-bold text-xs sm:text-sm truncate" :class="isActive('T') ? 'text-ink' : 'text-soft'">
            {{ gameMode === 'pve' ? 'Bot' : 'Jogador 2' }}
          </span>
          <span class="hltv-badge-vrs">TR</span>
        </div>
        <StealPips side="T" :count="steals.T" class="mt-1.5 justify-end" />
      </div>
    </div>

    <!-- Barra de status / feedback -->
    <div
      class="bg-panel-alt border-t border-line px-3 sm:px-4 py-1.5 flex items-center gap-2 text-xs"
      role="status"
      aria-live="polite"
    >
      <span class="w-2 h-2 rounded-full shrink-0" :class="status.dot"></span>
      <span class="truncate" :class="status.text">{{ status.message }}</span>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import StealPips from './StealPips.vue';
import {
  currentPlayer,
  scores,
  steals,
  gameMode,
  aiDifficulty,
  winner,
  hudToast
} from '../services/gameFacade';
import { sideLabel } from '../utils/uiHelpers';

const DIFFICULTY_LABELS = { facil: 'Fácil', medio: 'Médio', dificil: 'Difícil' };

const modeLabel = computed(() =>
  gameMode.value === 'pve' ? `Bot · ${DIFFICULTY_LABELS[aiDifficulty.value] || ''}` : 'Mesma tela'
);

function isActive(side) {
  return winner.value === null && currentPlayer.value === side;
}

const TONE_STYLES = {
  ct: { dot: 'bg-ct-bright', text: 'text-ct-ink' },
  t: { dot: 'bg-t-bright', text: 'text-t-ink' },
  error: { dot: 'bg-loss', text: 'text-[#ff9c9c] font-semibold' },
  warn: { dot: 'bg-vrs', text: 'text-t-ink' },
  info: { dot: 'bg-hltv-link', text: 'text-soft' }
};

const status = computed(() => {
  if (hudToast.value) {
    return { message: hudToast.value.text, ...(TONE_STYLES[hudToast.value.tone] || TONE_STYLES.info) };
  }
  if (winner.value === 'draw') {
    return { message: 'Empate. Confira as respostas abaixo.', dot: 'bg-muted', text: 'text-soft' };
  }
  if (winner.value) {
    const style = winner.value === 'CT' ? TONE_STYLES.ct : TONE_STYLES.t;
    return { message: `${sideLabel(winner.value)} venceu a rodada!`, ...style };
  }
  if (gameMode.value === 'pve' && currentPlayer.value === 'T') {
    return { message: 'Bot pensando…', dot: 'bg-t-bright animate-pulse', text: 'text-t-ink' };
  }
  const style = currentPlayer.value === 'CT' ? TONE_STYLES.ct : TONE_STYLES.t;
  return { message: `Vez de ${sideLabel(currentPlayer.value)} — escolha uma casa.`, dot: style.dot, text: 'text-soft' };
});
</script>
