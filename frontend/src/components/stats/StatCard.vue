<template>
  <article class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <p class="text-sm text-slate-500 dark:text-slate-400">{{ sublabel }}</p>
    <p class="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{{ value }}</p>
    <p class="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">{{ label }}</p>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: string | number;
  sublabel?: string;
}>();
</script>
