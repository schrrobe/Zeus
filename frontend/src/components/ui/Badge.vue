<template>
  <span :class="classes">{{ label }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  variant: {
    type: String as () => 'success' | 'warning' | 'danger' | 'neutral',
    default: 'neutral'
  }
});

const classes = computed(() => {
  const base = 'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold';
  const variants: Record<string, string> = {
    success: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200',
    warning: 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
    neutral: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
  };
  return `${base} ${variants[props.variant]}`;
});
</script>
