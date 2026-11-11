<template>
  <img
    v-if="src && !failed"
    v-bind="$attrs"
    :src="src"
    :alt="alt"
    loading="lazy"
    decoding="async"
    draggable="false"
    @error="failed = true"
  />
  <span
    v-else-if="fallbackText"
    class="flex items-center justify-center font-display font-bold uppercase text-muted bg-panel-3 select-none"
    :class="fallbackClass"
    :title="$attrs.title"
    aria-hidden="true"
  >{{ fallbackText }}</span>
</template>

<script setup>
import { ref, watch } from 'vue';

defineOptions({ inheritAttrs: false });

/**
 * Imagem com fallback: quando o arquivo não existe (ex.: bandeira ou logo ausente),
 * exibe um texto curto no lugar de um ícone quebrado.
 */
const props = defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  fallbackText: { type: String, default: '' },
  fallbackClass: { type: [String, Array, Object], default: '' }
});

const failed = ref(false);
watch(() => props.src, () => { failed.value = false; });
</script>
