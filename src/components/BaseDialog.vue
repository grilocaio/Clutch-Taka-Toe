<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-start sm:items-center justify-center px-3 pt-[7vh] sm:pt-0 pb-4 bg-black/75 anim-fade-in"
      @mousedown.self="$emit('close')"
    >
      <div
        ref="panel"
        role="dialog"
        aria-modal="true"
        :aria-label="label"
        tabindex="-1"
        class="w-full bg-column border border-line-strong rounded-[2px] shadow-[0_18px_50px_rgba(0,0,0,0.65)] anim-rise-in outline-none max-h-[88vh] flex flex-col"
        :class="widthClass"
      >
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick, onBeforeUnmount } from 'vue';

const props = defineProps({
  open: { type: Boolean, default: false },
  label: { type: String, default: '' },
  widthClass: { type: String, default: 'max-w-md' }
});
const emit = defineEmits(['close']);
const panel = ref(null);
let lastFocused = null;

function onKeydown(e) {
  if (e.key === 'Escape') {
    e.preventDefault();
    emit('close');
  }
}

watch(() => props.open, async (isOpen) => {
  if (isOpen) {
    lastFocused = document.activeElement;
    window.addEventListener('keydown', onKeydown);
    await nextTick();
    const target = panel.value?.querySelector('[data-autofocus]') || panel.value;
    target?.focus();
  } else {
    window.removeEventListener('keydown', onKeydown);
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }
});

onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));
</script>
