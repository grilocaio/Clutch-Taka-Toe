<template>
  <div class="flex items-center gap-1" :title="`${count} de ${max} roubos restantes`">
    <span v-if="side === 'T'" class="text-[10px] font-semibold uppercase tracking-wide text-muted mr-0.5 hidden sm:inline">Roubos</span>
    <span
      v-for="i in max"
      :key="i"
      class="w-3.5 h-1.5 rounded-[1px] transition-colors"
      :class="i <= count ? (side === 'CT' ? 'bg-ct-bright' : 'bg-vrs') : 'bg-column border border-line-box'"
    ></span>
    <span v-if="side === 'CT'" class="text-[10px] font-semibold uppercase tracking-wide text-muted ml-0.5 hidden sm:inline">Roubos</span>
    <span class="sr-only">{{ count }} de {{ max }} roubos restantes</span>
  </div>
</template>

<script setup>
defineProps({
  side: { type: String, required: true },
  count: { type: Number, default: 0 },
  max: { type: Number, default: 3 }
});
</script>
