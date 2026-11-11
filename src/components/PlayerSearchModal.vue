<template>
  <BaseDialog :open="showSearchModal" label="Escolher jogador" width-class="max-w-md" @close="closeSearchModal">
    <!-- Barra superior na cor do lado ativo -->
    <div class="h-1 w-full shrink-0" :class="currentPlayer === 'CT' ? 'bg-ct-bright' : 'bg-vrs'"></div>

    <!-- Cabeçalho estilo barra de título HLTV -->
    <div class="px-4 py-2.5 bg-panel-2 border-b border-line flex items-center justify-between gap-2 shrink-0">
      <div class="flex items-center gap-2 min-w-0">
        <span :class="currentPlayer === 'CT' ? 'hltv-badge-rank' : 'hltv-badge-vrs'">
          Vez de {{ sideLabel(currentPlayer) }}
        </span>
        <span class="text-xs font-bold text-ink">Casa {{ getCellCoord(currentCellIndex) }}</span>
      </div>

      <button
        type="button"
        @click="closeSearchModal"
        class="w-7 h-7 rounded-[2px] flex items-center justify-center text-muted hover:text-ink hover:bg-panel-3 transition-colors"
        aria-label="Fechar"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
      </button>
    </div>

    <div class="p-4 overflow-y-auto space-y-3">
      <!-- Cruzamento de critérios -->
      <div
        v-if="currentCellIndex >= 0"
        class="hltv-box p-2.5 grid grid-cols-[1fr_auto_1fr] items-center gap-2 bg-panel"
      >
        <div class="flex items-center gap-2 min-w-0">
          <div class="w-9 h-9 rounded-[2px] bg-panel-alt border border-line-box p-1 flex items-center justify-center shrink-0">
            <CsImage
              :src="getImageUrl(rowCriterion.value, rowCriterion.type)"
              :alt="rowCriterion.label"
              :fallback-text="getInitials(rowCriterion.label)"
              fallback-class="w-full h-full rounded-[2px] text-xs"
              :class="isPortraitCriterion(rowCriterion.type) ? 'w-full h-full rounded-[2px] object-cover object-top' : 'max-w-full max-h-full object-contain'"
            />
          </div>
          <div class="min-w-0">
            <span class="block text-[9px] font-bold uppercase tracking-wider text-hltv-link">{{ getCriterionTypeLabel(rowCriterion.type) }}</span>
            <span class="font-sans text-xs sm:text-sm font-bold leading-tight text-ink clamp-2 break-words">
              {{ rowCriterion.label }}
            </span>
          </div>
        </div>

        <span class="px-1.5 py-0.5 rounded-[2px] bg-panel-alt border border-line-box text-[10px] font-bold text-muted" aria-hidden="true">+</span>

        <div class="flex items-center justify-end gap-2 min-w-0 text-right">
          <div class="min-w-0">
            <span class="block text-[9px] font-bold uppercase tracking-wider text-hltv-link">{{ getCriterionTypeLabel(colCriterion.type) }}</span>
            <span class="font-sans text-xs sm:text-sm font-bold leading-tight text-ink clamp-2 break-words">
              {{ colCriterion.label }}
            </span>
          </div>
          <div class="w-9 h-9 rounded-[2px] bg-panel-alt border border-line-box p-1 flex items-center justify-center shrink-0">
            <CsImage
              :src="getImageUrl(colCriterion.value, colCriterion.type)"
              :alt="colCriterion.label"
              :fallback-text="getInitials(colCriterion.label)"
              fallback-class="w-full h-full rounded-[2px] text-xs"
              :class="isPortraitCriterion(colCriterion.type) ? 'w-full h-full rounded-[2px] object-cover object-top' : 'max-w-full max-h-full object-contain'"
            />
          </div>
        </div>
      </div>

      <!-- Aviso de roubo -->
      <div
        v-if="isStealAttempt"
        class="px-3 py-2 rounded-[2px] bg-t-bg border border-vrs/60 flex items-center justify-between gap-2 text-xs text-t-ink"
      >
        <span>
          Roubo de casa: escolha um jogador válido diferente de <strong class="text-ink">{{ targetCellPlayerNickname }}</strong>.
        </span>
        <span class="hltv-badge-vrs shrink-0">ROUBO</span>
      </div>

      <!-- Feedback de erro -->
      <div
        v-if="searchFeedback"
        role="alert"
        class="px-3 py-2 rounded-[2px] bg-panel border border-loss flex items-center justify-between gap-2 text-xs text-ink anim-shake"
      >
        <span>{{ searchFeedback }}</span>
        <span class="hltv-pill-loss px-2 py-0.5 text-[10px] shrink-0">ERRO</span>
      </div>

      <!-- Campo de busca + Tabela zebrada estilo HLTV -->
      <div>
        <label for="player-search-input" class="sr-only">Buscar jogador pelo nickname ou nome</label>
        <div class="relative flex items-center">
          <svg class="w-4 h-4 text-muted absolute left-3 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
          </svg>
          <input
            id="player-search-input"
            ref="searchInput"
            v-model="searchQuery"
            data-autofocus
            type="text"
            autocomplete="off"
            spellcheck="false"
            placeholder="Digite o nick ou nome (ex.: s1mple, FalleN, KSCERATO, donk)"
            @input="onSearchInput"
            @keydown.down.prevent="moveActiveSuggestion(1)"
            @keydown.up.prevent="moveActiveSuggestion(-1)"
            @keydown.enter.prevent="handleEnterKey"
            class="w-full h-9 rounded-[2px] bg-panel border border-line-strong focus:border-hltv-link text-ink placeholder:text-muted pl-9 pr-8 text-xs sm:text-sm outline-none transition-colors"
          />
          <button
            v-if="searchQuery"
            type="button"
            @click="clearSearch"
            class="w-7 h-7 rounded-[2px] flex items-center justify-center text-muted hover:text-ink absolute right-1"
            aria-label="Limpar busca"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <!-- Lista de sugestões zebrada estilo HLTV -->
        <ul
          v-if="suggestions.length > 0"
          ref="suggestionsList"
          role="listbox"
          aria-label="Sugestões de jogadores"
          class="mt-1.5 border border-line-box rounded-[2px] overflow-y-auto max-h-56 divide-y divide-line"
        >
          <li
            v-for="(player, idx) in suggestions"
            :key="player.id"
            role="option"
            :aria-selected="idx === activeSuggestionIndex"
            @click="selectPlayer(player)"
            @mousemove="activeSuggestionIndex = idx"
            class="px-3 py-2 flex items-center justify-between gap-2 text-xs cursor-pointer transition-colors"
            :class="idx === activeSuggestionIndex
              ? 'bg-panel-3 text-ink'
              : (idx % 2 === 0 ? 'bg-panel text-soft hover:bg-panel-2' : 'bg-panel-alt text-soft hover:bg-panel-2')"
          >
            <div class="flex items-center gap-2 min-w-0">
              <CsImage
                :src="getImageUrl(player.nationality, 'nationality')"
                :alt="player.nationality"
                class="w-4 h-3 object-cover rounded-[1px] shrink-0 shadow-[0_0_2px_rgba(0,0,0,0.8)]"
              />
              <span class="font-bold text-ink truncate">
                {{ player.nickname }}
              </span>
              <span class="text-[11px] text-muted truncate hidden sm:inline">
                ({{ player.name }})
              </span>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <span class="text-[11px] text-muted">{{ player.nationality }}</span>
            </div>
          </li>
        </ul>

        <p
          v-else-if="searchQuery.trim() && !selectedPlayerObject"
          class="mt-2 text-xs text-muted px-1"
        >
          Nenhum jogador encontrado para "{{ searchQuery.trim() }}".
        </p>
      </div>

      <!-- Jogador selecionado -->
      <div
        v-if="selectedPlayerObject"
        class="hltv-box p-2.5 bg-panel-2 flex items-center justify-between gap-2"
      >
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="w-9 h-9 rounded-[2px] overflow-hidden bg-column border border-line-strong flex items-center justify-center shrink-0">
            <CsImage
              :src="getPlayerImageUrl(selectedPlayerObject.nickname)"
              :alt="selectedPlayerObject.nickname"
              :fallback-text="getInitials(selectedPlayerObject.nickname)"
              fallback-class="w-full h-full text-xs"
              class="w-full h-full object-cover object-top"
            />
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-1.5">
              <CsImage
                :src="getImageUrl(selectedPlayerObject.nationality, 'nationality')"
                :alt="selectedPlayerObject.nationality"
                class="w-3.5 h-2.5 object-cover rounded-[1px] shrink-0"
              />
              <span class="font-bold text-sm text-ink truncate">
                {{ selectedPlayerObject.nickname }}
              </span>
            </div>
            <span class="block text-[11px] text-muted truncate mt-0.5">
              {{ selectedPlayerObject.name }}
            </span>
          </div>
        </div>
        <span class="hltv-pill-win px-2 py-0.5 text-[10px] shrink-0">Enter ↵</span>
      </div>
    </div>

    <!-- Rodapé de ações -->
    <div class="px-4 py-2.5 bg-panel-alt border-t border-line flex items-center justify-end gap-2 shrink-0">
      <button
        type="button"
        @click="closeSearchModal"
        class="h-8 px-3 rounded-[3px] bg-panel border border-line-box hover:bg-panel-2 text-xs font-semibold text-soft hover:text-ink transition-colors"
      >
        Cancelar
      </button>
      <button
        type="button"
        @click="onConfirmGuess"
        :disabled="!selectedPlayerObject"
        class="h-8 px-4 rounded-[3px] text-xs font-bold text-white transition-opacity disabled:opacity-40"
        :class="currentPlayer === 'CT' ? 'bg-ct hover:opacity-90' : 'bg-vrs hover:opacity-90'"
      >
        Confirmar
      </button>
    </div>
  </BaseDialog>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import BaseDialog from './BaseDialog.vue';
import CsImage from './CsImage.vue';
import { PLAYERS, getImageUrl, getPlayerImageUrl } from '../utils/csData';
import { getCriterionTypeLabel, isPortraitCriterion, getInitials, sideLabel } from '../utils/uiHelpers';
import {
  showSearchModal,
  currentCellIndex,
  activeCriteria,
  board,
  currentPlayer,
  isStealAttempt,
  getCellCoord,
  closeSearchModal,
  submitPlayerGuess,
  playSound
} from '../services/gameFacade';

const searchQuery = ref('');
const suggestions = ref([]);
const activeSuggestionIndex = ref(0);
const selectedPlayerObject = ref(null);
const searchFeedback = ref('');
const searchInput = ref(null);
const suggestionsList = ref(null);

const rowCriterion = computed(() => {
  if (currentCellIndex.value < 0) return { label: '', value: '', type: '' };
  return activeCriteria.value.rows[Math.floor(currentCellIndex.value / 3)] || { label: '', value: '', type: '' };
});

const colCriterion = computed(() => {
  if (currentCellIndex.value < 0) return { label: '', value: '', type: '' };
  return activeCriteria.value.cols[currentCellIndex.value % 3] || { label: '', value: '', type: '' };
});

const targetCellPlayerNickname = computed(() => {
  if (currentCellIndex.value < 0) return '';
  const cell = board.value[currentCellIndex.value];
  return cell ? cell.playerNickname : '';
});

watch(showSearchModal, (isOpen) => {
  if (isOpen) {
    searchQuery.value = '';
    suggestions.value = [];
    selectedPlayerObject.value = null;
    searchFeedback.value = '';
    activeSuggestionIndex.value = 0;
  }
});

function clearSearch() {
  searchQuery.value = '';
  suggestions.value = [];
  selectedPlayerObject.value = null;
  searchFeedback.value = '';
  nextTick(() => searchInput.value?.focus());
}

function onSearchInput() {
  const query = searchQuery.value.trim().toLowerCase();
  selectedPlayerObject.value = null;
  searchFeedback.value = '';

  if (query.length < 1) {
    suggestions.value = [];
    activeSuggestionIndex.value = 0;
    return;
  }

  const starts = [];
  const contains = [];
  for (const player of PLAYERS) {
    const nick = player.nickname.toLowerCase();
    const real = player.name.toLowerCase();
    if (nick.startsWith(query)) {
      starts.push(player);
    } else if (nick.includes(query) || real.includes(query)) {
      contains.push(player);
    }
  }

  suggestions.value = [...starts, ...contains].slice(0, 40);
  activeSuggestionIndex.value = 0;
}

function moveActiveSuggestion(direction) {
  if (suggestions.value.length === 0) return;
  const newIndex = activeSuggestionIndex.value + direction;
  if (newIndex >= 0 && newIndex < suggestions.value.length) {
    activeSuggestionIndex.value = newIndex;
  } else if (newIndex < 0) {
    activeSuggestionIndex.value = suggestions.value.length - 1;
  } else if (newIndex >= suggestions.value.length) {
    activeSuggestionIndex.value = 0;
  }
}

watch(activeSuggestionIndex, (newIdx) => {
  if (suggestionsList.value) {
    const listEl = suggestionsList.value;
    const activeEl = listEl.children[newIdx];
    if (activeEl) {
      const containerTop = listEl.scrollTop;
      const containerBottom = containerTop + listEl.clientHeight;
      const elemTop = activeEl.offsetTop;
      const elemBottom = elemTop + activeEl.offsetHeight;

      if (elemTop < containerTop) {
        listEl.scrollTop = elemTop;
      } else if (elemBottom > containerBottom) {
        listEl.scrollTop = elemBottom - listEl.clientHeight;
      }
    }
  }
});

function handleEnterKey() {
  if (suggestions.value.length > 0) {
    selectPlayer(suggestions.value[activeSuggestionIndex.value]);
  } else if (selectedPlayerObject.value) {
    onConfirmGuess();
  }
}

function selectPlayer(player) {
  playSound('click');
  searchQuery.value = player.nickname;
  selectedPlayerObject.value = player;
  suggestions.value = [];
}

function onConfirmGuess() {
  if (!selectedPlayerObject.value) return;
  const res = submitPlayerGuess(selectedPlayerObject.value);
  if (!res.success) {
    searchFeedback.value = res.message;
  }
}
</script>
