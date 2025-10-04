<template>
  <div class="grid gap-4 md:grid-cols-4">
    <article class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p class="text-sm text-slate-500">Nutzer</p>
      <p class="mt-2 text-2xl font-semibold">{{ summary?.totalUsers ?? 0 }}</p>
    </article>
    <article class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p class="text-sm text-slate-500">Premium Nutzer</p>
      <p class="mt-2 text-2xl font-semibold">{{ summary?.premiumUsers ?? 0 }}</p>
    </article>
    <article class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p class="text-sm text-slate-500">MRR</p>
      <p class="mt-2 text-2xl font-semibold">{{ formatCurrency(summary?.monthlyRecurringRevenue ?? 0) }}</p>
    </article>
    <article class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p class="text-sm text-slate-500">Transaktionen</p>
      <p class="mt-2 text-2xl font-semibold">{{ summary?.transactions.length ?? 0 }}</p>
    </article>
  </div>
</template>

<script setup lang="ts">
import type { AdminDashboardSummary } from '../../types/portfolio';

defineProps<{ summary?: AdminDashboardSummary | null }>();

function formatCurrency(value: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
}
</script>
