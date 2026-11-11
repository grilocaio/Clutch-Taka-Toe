<template>
  <div class="absolute inset-0 flex flex-col bg-column">
    <!-- Retrato no estilo dos cards de lineup da HLTV (Imagem 3: NAF, EliGE, FalleN, KSCERATO) -->
    <div
      class="relative flex-1 min-h-0 overflow-hidden"
      style="background: radial-gradient(circle at 50% 35%, #3a4756 0%, #222931 85%);"
    >
      <img
        v-if="photo && !photoFailed"
        :src="photo"
        :alt="cell.playerNickname"
        class="absolute inset-0 w-full h-full object-cover object-top"
        draggable="false"
        @error="photoFailed = true"
      />
      <span
        v-else
        class="absolute inset-0 flex items-center justify-center font-display font-bold uppercase text-[28px] sm:text-[46px] leading-none select-none"
        :class="isCT ? 'text-ct-bright/45' : 'text-t-bright/45'"
        aria-hidden="true"
      >{{ getInitials(cell.playerNickname) }}</span>

      <!-- Badge superior esquerdo estilo ícone de função/IGL da HLTV (coroa azul / mira) -->
      <span
        class="absolute top-1 left-1 sm:top-1.5 sm:left-1.5 px-1 py-0.5 rounded-[2px] text-[9px] sm:text-[10px] font-bold leading-none shadow-sm flex items-center gap-0.5"
        :class="isCT ? 'bg-ct text-white' : 'bg-vrs text-white'"
      >
        <svg v-if="isCT" class="w-2.5 h-2.5 hidden sm:inline" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"/>
        </svg>
        <svg v-else class="w-2.5 h-2.5 hidden sm:inline" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2L2 7l10 5 10-5-10-5zm0 7.5l-6-3 6-3 6 3-6 3zm0 2.5l-10-5v7l10 5 10-5v-7l-10 5z"/>
        </svg>
        <span>{{ isCT ? 'CT' : 'TR' }}</span>
      </span>
    </div>

    <!-- Faixa inferior idêntica ao card da HLTV: [Bandeira] Nickname -->
    <div
      class="shrink-0 h-6 sm:h-7 px-1.5 border-t flex items-center justify-center gap-1 sm:gap-1.5"
      :class="isCT ? 'bg-[#2b4c6f] border-ct-bright/50' : 'bg-[#6b4410] border-t-bright/50'"
      :title="`${cell.playerNickname} — ${cell.playerRealName} (${cell.playerNationality})`"
    >
      <CsImage
        v-if="cell.playerNationality"
        :src="getImageUrl(cell.playerNationality, 'nationality')"
        :alt="cell.playerNationality"
        class="w-3.5 h-2.5 sm:w-4 sm:h-[11px] object-cover rounded-[1px] shrink-0 shadow-[0_0_2px_rgba(0,0,0,0.8)]"
      />
      <span class="font-sans font-bold text-[11px] sm:text-[13px] leading-none text-ink truncate">
        {{ cell.playerNickname }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import CsImage from './CsImage.vue';
import { getImageUrl, getPlayerImageUrl } from '../utils/csData';
import { getInitials } from '../utils/uiHelpers';

const props = defineProps({
  cell: { type: Object, required: true }
});

const isCT = computed(() => props.cell.player === 'CT');
const photo = computed(() => getPlayerImageUrl(props.cell.playerNickname));
const photoFailed = ref(false);
watch(() => props.cell.playerId, () => { photoFailed.value = false; });
</script>
