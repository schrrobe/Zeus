<template>
  <button
    type="button"
    class="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700 shadow-sm transition hover:border-primary hover:text-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-primary"
    @click="toggle"
  >
    <span class="mr-2">{{ themeLabel }}</span>
    <span v-if="theme === 'light'" aria-hidden="true">🌞</span>
    <span v-else aria-hidden="true">🌙</span>
  </button>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useUiStore } from '../stores/ui-store';

const ui = useUiStore();
const { theme } = storeToRefs(ui);
const themeLabel = computed(() => (theme.value === 'light' ? 'Light Mode' : 'Dark Mode'));

function toggle() {
  ui.toggleTheme();
}
</script>
