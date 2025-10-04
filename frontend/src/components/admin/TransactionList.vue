<template>
  <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <header>
      <h3 class="text-lg font-semibold">Transaktionen</h3>
      <p class="text-sm text-slate-500 dark:text-slate-400">Letzte Stripe Zahlungen</p>
    </header>
    <ul class="mt-4 space-y-3 text-sm">
      <li
        v-for="transaction in transactions"
        :key="transaction.id"
        class="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700"
      >
        <div>
          <p class="font-semibold">{{ transaction.userEmail }}</p>
          <p class="text-xs text-slate-500">{{ formatDate(transaction.createdAt) }}</p>
        </div>
        <div class="text-right">
          <p class="font-semibold">{{ formatCurrency(transaction.amount) }}</p>
          <Badge :label="transaction.status" :variant="statusVariant(transaction.status)" />
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import Badge from '../ui/Badge.vue';
import type { AdminDashboardSummary } from '../../types/portfolio';

defineProps<{ transactions: AdminDashboardSummary['transactions'] }>();

function formatCurrency(value: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value / 100);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function statusVariant(status: 'pending' | 'succeeded' | 'failed') {
  switch (status) {
    case 'succeeded':
      return 'success';
    case 'pending':
      return 'warning';
    case 'failed':
    default:
      return 'danger';
  }
}
</script>
