<template>
  <div
    class="aspect-square rounded-[2px] bg-panel border border-line-box flex flex-col justify-between overflow-hidden min-w-0"
    :title="`${typeLabel}: ${criterion.label}`"
  >
    <!-- Faixa superior estilo header de caixa da HLTV -->
    <div class="bg-panel-2 border-b border-line-box px-1 py-0.5 sm:py-1 text-center shrink-0">
      <span class="block text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-hltv-link leading-none truncate">
        {{ typeLabel }}
      </span>
    </div>

    <!-- Área central da imagem -->
    <div class="flex-1 min-h-0 w-full flex items-center justify-center p-1 sm:p-2">
      <!-- Retrato (treinador / companheiro) -->
      <CsImage
        v-if="isPortrait"
        :src="imageUrl"
        :alt="criterion.label"
        :fallback-text="getInitials(criterion.value)"
        fallback-class="h-[84%] aspect-square rounded-[2px] text-sm sm:text-lg"
        class="h-[84%] aspect-square rounded-[2px] object-cover object-top border border-line-strong"
      />
      <!-- Bandeira -->
      <CsImage
        v-else-if="criterion.type === 'nationality'"
        :src="imageUrl"
        :alt="criterion.label"
        :fallback-text="getInitials(criterion.label)"
        fallback-class="w-[64%] aspect-[3/2] rounded-[2px] text-xs"
        class="w-[64%] max-h-full aspect-[3/2] object-cover rounded-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.65)] border border-black/40"
      />
      <!-- Logo de equipe / troféu -->
      <CsImage
        v-else
        :src="imageUrl"
        :alt="criterion.label"
        :fallback-text="getInitials(criterion.label)"
        fallback-class="h-[75%] aspect-square rounded-[2px] text-sm sm:text-lg"
        class="max-h-[82%] max-w-[76%] object-contain drop-shadow-[0_2px_3px_rgba(0,0,0,0.65)]"
      />
    </div>

    <!-- Faixa inferior estilo rodapé de card da HLTV -->
    <div class="bg-panel-alt border-t border-line px-1 py-1 sm:py-1.5 text-center shrink-0">
      <span class="block font-sans font-bold text-[10px] sm:text-[12px] leading-[1.1] truncate text-soft">
        {{ shortLabel }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import CsImage from './CsImage.vue';
import { getImageUrl } from '../utils/csData';
import { getCriterionTypeLabel, isPortraitCriterion, getInitials, shortCriterionLabel } from '../utils/uiHelpers';

const props = defineProps({
  criterion: { type: Object, required: true }
});

const typeLabel = computed(() => getCriterionTypeLabel(props.criterion.type));
const isPortrait = computed(() => isPortraitCriterion(props.criterion.type));
const imageUrl = computed(() => getImageUrl(props.criterion.value, props.criterion.type));
const shortLabel = computed(() => shortCriterionLabel(props.criterion.label));
</script>
