<template>
  <div class="overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
    <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
      <thead class="bg-slate-50/80 dark:bg-slate-800/50">
        <tr>
          <th scope="col" class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Asset</th>
          <th scope="col" class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Standort</th>
          <th scope="col" class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Bestand</th>
          <th scope="col" class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Preis (EUR)</th>
          <th scope="col" class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Wert (EUR)</th>
          <th scope="col" class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">24h</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-200 bg-white/50 dark:divide-slate-800 dark:bg-slate-900/50">
        <tr v-for="position in positions" :key="position.assetSymbol + position.provider" class="hover:bg-primary/5">
          <td class="whitespace-nowrap px-6 py-4">
            <div class="text-sm font-semibold text-slate-900 dark:text-slate-100">{{ position.assetName }}</div>
            <div class="text-xs text-slate-500 dark:text-slate-400">{{ position.assetSymbol }}</div>
          </td>
          <td class="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
            {{ position.location === 'wallet' ? 'Wallet' : 'Börse' }} — {{ position.provider }}
          </td>
          <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-slate-700 dark:text-slate-200">{{ position.quantity.toLocaleString() }}</td>
          <td class="whitespace-nowrap px-6 py-4 text-right text-sm text-slate-600 dark:text-slate-300">{{ formatCurrency(position.currentPriceEUR) }}</td>
          <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-semibold text-slate-900 dark:text-slate-100">{{ formatCurrency(position.valueEUR) }}</td>
          <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium" :class="position.change24hPercent >= 0 ? 'text-emerald-500' : 'text-rose-500'">
            {{ position.change24hPercent.toFixed(2) }}%
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { AssetPosition } from '../../types';
import { formatCurrency } from '../../utils/numberFormat';

defineProps<{ positions: AssetPosition[] }>();
</script>
