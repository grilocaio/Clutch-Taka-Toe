<template>
  <div class="w-full max-w-[760px] mx-auto space-y-6">
    <!-- Seleção de modo de jogo — direta e sem distrações -->
    <section aria-labelledby="play-heading">
      <div class="flex items-center justify-between mb-2">
        <h1 id="play-heading" class="section-label">Escolha o modo de jogo</h1>
        <button
          type="button"
          @click="openRulesModal"
          class="text-xs font-semibold text-hltv-link hover:text-ink transition-colors"
        >
          Como jogar?
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <!-- Card 1: Mesma tela (2 jogadores) -->
        <div class="hltv-box overflow-hidden flex flex-col justify-between">
          <div>
            <div class="px-3.5 py-2.5 bg-panel-2 border-b border-line flex items-center justify-between">
              <span class="font-bold text-xs sm:text-sm text-ink">Mesma tela (2 jogadores)</span>
              <div class="flex items-center gap-1">
                <span class="hltv-badge-rank">CT</span>
                <span class="text-[10px] text-muted">vs</span>
                <span class="hltv-badge-vrs">TR</span>
              </div>
            </div>

            <div class="p-3.5 space-y-2.5 text-xs text-soft">
              <p class="text-muted leading-relaxed">
                Dois jogadores alternam a vez no mesmo dispositivo. Cada lado tem direito a <strong class="text-ink">3 roubos</strong> de casa por partida.
              </p>
              <div class="divide-y divide-line border border-line-box rounded-[2px] overflow-hidden">
                <div class="px-3 py-2 bg-panel flex items-center justify-between">
                  <span class="text-muted">Jogador 1</span>
                  <span class="hltv-badge-rank">Lado CT</span>
                </div>
                <div class="px-3 py-2 bg-panel-alt flex items-center justify-between">
                  <span class="text-muted">Jogador 2</span>
                  <span class="hltv-badge-vrs">Lado TR</span>
                </div>
              </div>
            </div>
          </div>

          <div class="p-3.5 pt-0">
            <button
              type="button"
              @click="startNewGame('pvp')"
              class="w-full h-9 rounded-[2px] bg-ct hover:opacity-90 text-xs sm:text-sm font-bold text-white transition-opacity flex items-center justify-center gap-2"
            >
              <span>Começar partida (2 jogadores)</span>
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>
          </div>
        </div>

        <!-- Card 2: Contra o Bot (1 jogador) -->
        <div class="hltv-box overflow-hidden flex flex-col justify-between">
          <div>
            <div class="px-3.5 py-2.5 bg-panel-2 border-b border-line flex items-center justify-between">
              <span class="font-bold text-xs sm:text-sm text-ink">Contra o Bot (1 jogador)</span>
              <span class="hltv-pill-neutral px-2 py-0.5 text-[10px]">Você vs IA</span>
            </div>

            <div class="p-3.5 space-y-2.5">
              <p class="text-xs text-muted leading-relaxed">
                Você joga de <strong class="text-ink">CT</strong>. Escolha a dificuldade do Bot abaixo para começar a partida:
              </p>

              <!-- Linhas zebradas estilo tabela da HLTV -->
              <div class="divide-y divide-line border border-line-box rounded-[2px] overflow-hidden">
                <button
                  v-for="(tier, idx) in botTiers"
                  :key="tier.id"
                  type="button"
                  @click="startNewGame('pve', tier.id)"
                  class="w-full px-3 py-2.5 flex items-center justify-between gap-2 text-xs transition-colors text-left group"
                  :class="idx % 2 === 0 ? 'bg-panel hover:bg-panel-3' : 'bg-panel-alt hover:bg-panel-3'"
                >
                  <div class="flex items-center gap-2 min-w-0">
                    <span class="font-bold text-ink group-hover:text-white">{{ tier.label }}</span>
                    <span class="text-[11px] text-muted truncate">· {{ tier.desc }}</span>
                  </div>

                  <div class="flex items-center gap-2 shrink-0">
                    <span
                      class="px-2 py-0.5 text-[10px] tabular-nums min-w-[52px] text-center"
                      :class="tier.pillClass"
                    >
                      {{ tier.hitRate }}
                    </span>
                    <span class="px-2 py-0.5 rounded-[2px] bg-panel-3 group-hover:bg-ct text-white font-bold text-[11px] transition-colors">
                      Jogar
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Estatísticas da base e organizações -->
    <section aria-labelledby="db-heading">
      <div class="flex items-center justify-between mb-2">
        <h2 id="db-heading" class="section-label">Base de dados (CS 1.6, CS:GO &amp; CS2)</h2>
      </div>

      <div class="hltv-box overflow-hidden">
        <dl class="grid grid-cols-3 sm:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-line border-b border-line bg-panel-2">
          <div v-for="stat in stats" :key="stat.label" class="px-3 py-2.5 text-center">
            <dt class="text-[10px] text-muted uppercase tracking-wider font-semibold">{{ stat.label }}</dt>
            <dd class="font-sans text-lg sm:text-xl font-bold tabular-nums text-ink leading-tight mt-0.5">{{ stat.value }}</dd>
          </div>
        </dl>

        <ul class="flex flex-wrap items-center justify-center gap-x-3.5 gap-y-2.5 px-4 py-3.5 bg-panel" aria-label="Equipes presentes nos critérios">
          <li
            v-for="team in teams"
            :key="team.id"
            :title="team.label"
            class="w-7 h-7 flex items-center justify-center"
          >
            <CsImage
              :src="getImageUrl(team.value, 'team')"
              :alt="team.label"
              :fallback-text="getInitials(team.label)"
              fallback-class="w-7 h-7 rounded-[2px] text-[10px]"
              class="max-w-full max-h-full object-contain opacity-85 hover:opacity-100 transition-opacity"
            />
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup>
import { startNewGame, openRulesModal } from '../services/gameFacade';
import { PLAYERS, CRITERIA_POOL, getImageUrl } from '../utils/csData';
import { getInitials } from '../utils/uiHelpers';
import CsImage from './CsImage.vue';

const botTiers = [
  { id: 'facil', label: 'Fácil', desc: 'Iniciante', hitRate: '40% IA', pillClass: 'hltv-pill-win' },
  { id: 'medio', label: 'Médio', desc: 'Competitivo', hitRate: '70% IA', pillClass: 'hltv-badge-vrs' },
  { id: 'dificil', label: 'Difícil', desc: 'Pro / Top 1', hitRate: '95% IA', pillClass: 'hltv-pill-loss' }
];

const countType = (type) => CRITERIA_POOL.filter(c => c.type === type).length;

const stats = [
  { label: 'Jogadores', value: PLAYERS.length },
  { label: 'Equipes', value: countType('team') },
  { label: 'Países', value: countType('nationality') },
  { label: 'Conquistas', value: countType('achievement') },
  { label: 'Treinadores', value: countType('coach') },
  { label: 'Duplas', value: countType('teammate') }
];

const teams = CRITERIA_POOL.filter(c => c.type === 'team');
</script>
