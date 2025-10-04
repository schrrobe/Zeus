<template>
  <div class="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <header class="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
      <div>
        <h2 class="text-lg font-semibold">Assets</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">Alle Wallets & Börsen auf einen Blick</p>
      </div>
    </header>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800">
        <thead class="bg-slate-50 dark:bg-slate-900/60">
          <tr>
            <th class="px-6 py-3 font-semibold">Name</th>
            <th class="px-6 py-3 font-semibold">Typ</th>
            <th class="px-6 py-3 font-semibold">Balance</th>
            <th class="px-6 py-3 font-semibold">Wert (EUR)</th>
            <th class="px-6 py-3 font-semibold">Zuletzt synchronisiert</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-900">
          <tr v-for="balance in balances" :key="balance.id" class="hover:bg-primary/5">
            <td class="px-6 py-4">
              <p class="font-semibold">{{ balance.name }}</p>
              <p class="text-xs text-slate-500">{{ balance.addressOrAccount }}</p>
            </td>
            <td class="px-6 py-4 capitalize">{{ balance.platform }}</td>
            <td class="px-6 py-4">{{ balance.balance }} {{ balance.currency }}</td>
            <td class="px-6 py-4">{{ formatCurrency(balance.fiatValue) }}</td>
            <td class="px-6 py-4">{{ formatDate(balance.lastSyncedAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ExchangeBalance } from '../../types/portfolio';

const props = defineProps<{ balances: ExchangeBalance[] }>();

function formatCurrency(value: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}
</script>
