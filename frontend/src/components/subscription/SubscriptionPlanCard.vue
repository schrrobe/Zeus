<template>
  <div class="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-lg transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
    <div>
      <h3 class="text-xl font-semibold text-slate-900 dark:text-slate-100">{{ title }}</h3>
      <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">{{ description }}</p>
    </div>
    <div>
      <p class="text-3xl font-bold text-slate-900 dark:text-slate-100">{{ price }}</p>
      <p class="text-xs text-slate-400 dark:text-slate-500">{{ billingHint }}</p>
    </div>
    <ul class="space-y-3 text-sm text-slate-600 dark:text-slate-300">
      <li v-for="feature in features" :key="feature" class="flex items-start gap-3">
        <span class="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
        <span>{{ feature }}</span>
      </li>
    </ul>
    <button class="mt-auto w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark" @click="$emit('select')">
      {{ ctaLabel }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  price: string;
  billingHint: string;
  features: string[];
  ctaLabel: string;
}>();

defineEmits<{ (e: 'select'): void }>();
</script>
