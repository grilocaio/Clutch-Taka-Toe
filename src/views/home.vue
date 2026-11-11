<template>
  <div class="min-h-screen flex flex-col bg-canvas text-ink">
    <!-- Cabeçalho único no estilo HLTV -->
    <header class="bg-nav border-b border-line sticky top-0 z-30">
      <div class="max-w-[980px] mx-auto h-13 px-3 sm:px-5 flex items-center justify-between gap-3">
        <!-- Logo estilo HLTV (Quadrado Azul + Nome) -->
        <div class="flex items-center gap-2.5 min-w-0">
          <BrandMark class="w-8 h-8 sm:w-9 sm:h-9 shrink-0 shadow-sm" />
          <div class="flex items-baseline gap-1.5 min-w-0">
            <span class="font-display text-xl sm:text-2xl font-bold uppercase tracking-wider leading-none text-ink">
              CLUTCH
            </span>
            <span class="font-display text-base sm:text-xl font-bold uppercase tracking-wide leading-none text-hltv-link">
              TAKA TOE
            </span>
          </div>
        </div>

        <!-- Ações da direita -->
        <nav class="flex items-center gap-1.5 sm:gap-2 shrink-0" aria-label="Navegação principal">
          <button
            type="button"
            @click="openRulesModal"
            class="h-8 px-2.5 rounded-[2px] bg-panel-2 hover:bg-panel-3 border border-line-box text-xs font-semibold text-soft hover:text-ink transition-colors whitespace-nowrap"
          >
            Como jogar
          </button>

          <button
            type="button"
            @click="soundEnabled = !soundEnabled"
            class="h-8 w-8 rounded-[2px] bg-panel-2 hover:bg-panel-3 border border-line-box flex items-center justify-center text-muted hover:text-ink transition-colors shrink-0"
            :aria-label="soundEnabled ? 'Desativar som' : 'Ativar som'"
            :aria-pressed="soundEnabled"
            :title="soundEnabled ? 'Som ligado' : 'Som desligado'"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 5 6 9H3v6h3l5 4V5Z" />
              <template v-if="soundEnabled">
                <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                <path d="M18.5 5.5a9 9 0 0 1 0 13" />
              </template>
              <template v-else>
                <path d="m22 9-6 6M16 9l6 6" />
              </template>
            </svg>
          </button>

          <template v-if="gameState !== 'setup'">
            <div
              v-if="showExitConfirm"
              class="flex items-center gap-1 pl-2 ml-0.5 border-l border-line-box anim-fade-in whitespace-nowrap"
              role="group"
              aria-label="Confirmar saída"
            >
              <span class="text-xs text-soft px-1 hidden sm:inline">Sair da partida?</span>
              <button
                type="button"
                @click="executeResetToSetup"
                class="h-8 px-2.5 rounded-[2px] bg-loss hover:opacity-90 text-white text-xs font-bold transition-opacity"
              >
                Sair
              </button>
              <button
                type="button"
                @click="cancelResetToSetup"
                class="h-8 px-2.5 rounded-[2px] bg-panel-3 hover:bg-line-strong text-soft text-xs font-semibold transition-colors"
              >
                Ficar
              </button>
            </div>
            <button
              v-else
              type="button"
              @click="confirmReset"
              class="h-8 px-2.5 rounded-[2px] bg-panel-3 hover:bg-line-strong border border-line-strong text-xs font-bold text-ink transition-colors flex items-center gap-1 whitespace-nowrap"
            >
              <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Menu
            </button>
          </template>
        </nav>
      </div>
    </header>

    <!-- Coluna central estilo HLTV (#242b33) -->
    <div class="flex-1 w-full max-w-[980px] mx-auto bg-column border-x border-nav flex flex-col">
      <main class="flex-1 w-full px-3 sm:px-5 py-4 sm:py-6">
        <GameSetup v-if="gameState === 'setup'" />

        <div v-else class="w-full max-w-[620px] mx-auto flex flex-col gap-3">
          <ScoreBoard />
          <GameBoard />
          <GameSummaryModal />
        </div>
      </main>

      <footer class="mt-auto border-t border-line bg-nav/60 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-1 text-[11px] text-muted">
        <span>Clutch Taka Toe · Jogo da velha de Counter-Strike</span>
        <span>{{ PLAYERS.length }} jogadores · {{ CRITERIA_POOL.length }} critérios</span>
      </footer>
    </div>

    <PlayerSearchModal />
    <RulesDialog />
  </div>
</template>

<script setup>
import {
  gameState,
  soundEnabled,
  showExitConfirm,
  confirmReset,
  executeResetToSetup,
  cancelResetToSetup,
  openRulesModal
} from '../services/gameFacade';
import { PLAYERS, CRITERIA_POOL } from '../utils/csData';
import BrandMark from '../components/BrandMark.vue';
import GameSetup from '../components/GameSetup.vue';
import ScoreBoard from '../components/ScoreBoard.vue';
import GameBoard from '../components/GameBoard.vue';
import PlayerSearchModal from '../components/PlayerSearchModal.vue';
import GameSummaryModal from '../components/GameSummaryModal.vue';
import RulesDialog from '../components/RulesDialog.vue';
</script>
