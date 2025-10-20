<template>
  <div class="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
    <div class="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
      <div>
        <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Verteilung Wallets & Börsen</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400">Wo liegen deine Coins in Prozent?</p>
      </div>
      <div class="grid gap-4 md:grid-cols-2">
        <div v-for="item in allocation" :key="item.label" class="flex items-center gap-3">
          <span class="h-3 w-3 rounded-full" :style="{ backgroundColor: item.color }" />
          <div>
            <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ item.label }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">{{ item.value.toFixed(2) }}%</p>
          </div>
        </div>
      </div>
    </div>
    <apexchart type="donut" height="320" :series="allocation.map((item) => item.value)" :options="chartOptions" class="mt-6" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import type { PortfolioSnapshot } from '../../types';

const props = defineProps<{ snapshot: PortfolioSnapshot | null }>();

const allocation = computed(() => {
  if (!props.snapshot) return [];
  const walletTotals = props.snapshot.wallets.map((wallet) => ({
    label: `Wallet · ${wallet.network.toUpperCase()}`,
    value: wallet.percentage,
    color: '#6366f1'
  }));
  const exchangeTotals = props.snapshot.exchanges.map((exchange) => ({
    label: `Börse · ${exchange.exchangeName}`,
    value: exchange.percentage,
    color: '#8b5cf6'
  }));
  return [...walletTotals, ...exchangeTotals];
});

const chartOptions = computed(() => ({
  labels: allocation.value.map((item) => item.label),
  legend: {
    show: false
  },
  theme: {
    mode: typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  }
}));

const apexchart = VueApexCharts;
</script>
