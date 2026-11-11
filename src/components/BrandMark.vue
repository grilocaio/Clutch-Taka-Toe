<template>
  <svg :class="$attrs.class" viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <!-- Quadrado azul oficial estilo HLTV -->
    <rect width="36" height="36" rx="2" fill="#3c6e9f" />
    <!-- Grade 3x3 sutil + arco/dots inspirados no símbolo da HLTV -->
    <path d="M13 6v24M23 6v24M6 13h24M6 23h24" stroke="#ffffff" stroke-opacity="0.22" stroke-width="1.2" />
    <circle cx="9.5" cy="26.5" r="2.1" fill="#ffffff" />
    <circle cx="18" cy="18" r="2.1" fill="#ffffff" />
    <circle cx="26.5" cy="9.5" r="2.1" fill="#ffffff" />
    <path d="M9.5 17C12.5 14 15.5 12.2 19.5 11.5" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
  </svg>
</template>

<script setup>
defineOptions({ inheritAttrs: false });
</script>
