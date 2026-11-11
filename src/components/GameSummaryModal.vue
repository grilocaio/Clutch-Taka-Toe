<template>
  <section
    v-if="showSummaryModal || winner !== null"
    class="mt-1 anim-rise-in"
    aria-label="Resultado e respostas da rodada"
  >
    <div class="hltv-box overflow-hidden">
      <!-- Barra superior de vitória/empate -->
      <div
        class="h-1 w-full"
        :class="winner === 'CT' ? 'bg-ct-bright' : winner === 'T' ? 'bg-vrs' : 'bg-line-strong'"
      ></div>

      <!-- Cabeçalho do resultado -->
      <div class="p-3.5 sm:p-4 bg-panel-2 border-b border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span class="text-[11px] font-semibold text-muted block">{{ outcomeCaption }}</span>
          <h2 class="font-sans text-base sm:text-lg font-bold text-ink leading-tight mt-0.5">
            {{ outcomeTitle }}
          </h2>
        </div>

        <button
          type="button"
          @click="resetGame"
          class="h-8 px-3.5 rounded-[3px] bg-ct hover:opacity-90 text-white text-xs font-bold transition-opacity inline-flex items-center justify-center gap-1.5 shrink-0"
        >
          Novo tabuleiro
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 12a9 9 0 1 1-3-6.7L21 8" /><path d="M21 3v5h-5" />
          </svg>
        </button>
      </div>

      <!-- Grade de casas com respostas válidas -->
      <div class="p-3 sm:p-4 bg-column">
        <div class="flex items-center justify-between mb-2.5">
          <h3 class="section-label">Respostas possíveis por casa</h3>
          <span class="text-xs text-muted">9 casas</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div
            v-for="item in gabaritoList"
            :key="item.index"
            class="hltv-box overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div class="px-2.5 py-1.5 bg-panel-2 border-b border-line flex items-center justify-between gap-2 text-xs">
                <span class="font-bold text-ink">Casa {{ item.coord }}</span>
                <span
                  v-if="item.cellFilled"
                  class="px-1.5 py-0.5 text-[10px] truncate max-w-[130px]"
                  :class="item.cellFilled.player === 'CT' ? 'hltv-badge-rank' : 'hltv-badge-vrs'"
                >
                  {{ sideLabel(item.cellFilled.player) }} · {{ item.cellFilled.playerNickname }}
                </span>
                <span v-else class="text-[11px] text-muted">Vazia</span>
              </div>

              <div class="px-2.5 py-2 bg-panel-alt border-b border-line flex flex-wrap items-center gap-1.5 text-[11px] text-soft font-semibold">
                <span class="inline-flex items-center gap-1 min-w-0">
                  <CsImage
                    :src="getImageUrl(item.rowValue, item.rowType)"
                    :alt="item.rowLabel"
                    :fallback-text="getInitials(item.rowLabel)"
                    fallback-class="w-3.5 h-3.5 rounded-[1px] text-[8px]"
                    :class="isPortraitCriterion(item.rowType) ? 'w-3.5 h-3.5 rounded-[1px] object-cover object-top shrink-0' : 'w-3.5 h-3.5 object-contain shrink-0'"
                  />
                  <span class="truncate">{{ shortCriterionLabel(item.rowLabel) }}</span>
                </span>
                <span class="text-muted">×</span>
                <span class="inline-flex items-center gap-1 min-w-0">
                  <CsImage
                    :src="getImageUrl(item.colValue, item.colType)"
                    :alt="item.colLabel"
                    :fallback-text="getInitials(item.colLabel)"
                    fallback-class="w-3.5 h-3.5 rounded-[1px] text-[8px]"
                    :class="isPortraitCriterion(item.colType) ? 'w-3.5 h-3.5 rounded-[1px] object-cover object-top shrink-0' : 'w-3.5 h-3.5 object-contain shrink-0'"
                  />
                  <span class="truncate">{{ shortCriterionLabel(item.colLabel) }}</span>
                </span>
              </div>
            </div>

            <div class="p-2.5 bg-panel">
              <div class="flex items-center justify-between text-[10px] text-muted mb-1.5">
                <span>Jogadores válidos</span>
                <span class="font-bold text-hltv-link tabular-nums">{{ item.answers.length }}</span>
              </div>
              <div class="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-0.5">
                <span
                  v-for="ans in item.answers"
                  :key="ans.id"
                  class="px-1.5 py-0.5 rounded-[2px] text-[11px] leading-tight border"
                  :class="
                    item.cellFilled?.playerId === ans.id
                      ? 'hltv-pill-win border-transparent'
                      : 'bg-panel-alt border-line-box text-soft'
                  "
                >
                  {{ ans.nickname }}
                </span>
                <span v-if="item.answers.length === 0" class="text-xs text-loss">
                  Nenhum registro
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import CsImage from './CsImage.vue';
import { getImageUrl } from '../utils/csData';
import { isPortraitCriterion, getInitials, sideLabel, shortCriterionLabel } from '../utils/uiHelpers';
import {
  showSummaryModal,
  winner,
  summaryReason,
  resetGame,
  getBoardGabarito
} from '../services/gameFacade';

const gabaritoList = computed(() => getBoardGabarito());

const outcomeCaption = computed(() => {
  if (summaryReason.value === 'giveup') return 'Rodada encerrada por desistência';
  if (winner.value === 'draw') return 'Fim da rodada';
  return 'Fim da rodada';
});

const outcomeTitle = computed(() => {
  if (winner.value === 'draw') return 'Empate';
  return `Vitória de ${sideLabel(winner.value)}`;
});
</script>
