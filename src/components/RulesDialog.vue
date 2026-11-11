<template>
  <BaseDialog :open="showRulesModal" label="Como jogar" width-class="max-w-lg" @close="closeRulesModal">
    <div class="h-1 w-full bg-ct-bright shrink-0"></div>
    <div class="flex items-center justify-between px-4 h-10 bg-panel-2 border-b border-line shrink-0">
      <div class="flex items-center gap-2">
        <span class="hltv-badge-rank">RULEBOOK</span>
        <h2 class="font-sans text-xs sm:text-sm font-bold text-ink">Como jogar Clutch Taka Toe</h2>
      </div>
      <button
        type="button"
        @click="closeRulesModal"
        class="w-7 h-7 rounded-[2px] flex items-center justify-center text-muted hover:text-ink hover:bg-panel-3 transition-colors"
        aria-label="Fechar"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
      </button>
    </div>

    <div class="p-4 overflow-y-auto">
      <ol class="hltv-box divide-y divide-line overflow-hidden text-xs sm:text-[13px] text-soft">
        <li
          v-for="(rule, i) in rules"
          :key="rule.title"
          class="px-3.5 py-3 flex items-start justify-between gap-3"
          :class="i % 2 === 0 ? 'bg-panel' : 'bg-panel-alt'"
        >
          <div class="flex items-start gap-2.5 min-w-0">
            <span class="hltv-pill-neutral px-1.5 py-0.5 text-[10px] shrink-0 mt-0.5">#{{ i + 1 }}</span>
            <div>
              <h3 class="font-bold text-ink leading-snug">{{ rule.title }}</h3>
              <p class="text-muted mt-0.5 leading-relaxed">{{ rule.text }}</p>
            </div>
          </div>
          <span class="px-2 py-0.5 text-[10px] shrink-0" :class="rule.pillClass">{{ rule.pill }}</span>
        </li>
      </ol>
    </div>

    <div class="px-4 py-2.5 bg-panel-alt border-t border-line flex justify-end shrink-0">
      <button
        type="button"
        data-autofocus
        @click="closeRulesModal"
        class="h-8 px-4 rounded-[3px] bg-ct hover:opacity-90 text-white text-xs font-bold transition-opacity"
      >
        Entendi
      </button>
    </div>
  </BaseDialog>
</template>

<script setup>
import BaseDialog from './BaseDialog.vue';
import { showRulesModal, closeRulesModal } from '../services/gameFacade';

const rules = [
  {
    title: 'Cruze os dois critérios da casa',
    text: 'Cada casa exige um pro player que cumpra simultaneamente o critério da linha e o da coluna (equipe, país, conquista, treinador ou companheiro de time).',
    pill: '3×3',
    pillClass: 'hltv-badge-rank'
  },
  {
    title: 'Feche 3 em linha para vencer o mapa',
    text: 'CT começa. Acertou o jogador, a casa fica marcada com o card dele; errou, a vez passa para o adversário.',
    pill: '2 - 0',
    pillClass: 'hltv-pill-win'
  },
  {
    title: 'Use até 3 roubos (Steals)',
    text: 'Cada lado tem 3 roubos por partida. Clique em uma casa já dominada pelo rival e cite outro jogador válido para tomá-la.',
    pill: 'STEAL',
    pillClass: 'hltv-badge-vrs'
  },
  {
    title: 'Passe a vez, empate ou desista',
    text: 'Ao final da partida (ou em caso de empate/desistência), o painel estilo HLTV revela todos os jogadores válidos de cada uma das 9 casas.',
    pill: 'STATS',
    pillClass: 'hltv-pill-neutral'
  }
];
</script>
