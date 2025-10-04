<template>
  <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <header class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold">Allokation</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">Verteilung deiner Bestände</p>
      </div>
    </header>
    <Doughnut
      v-if="chartData"
      :data="chartData"
      :options="chartOptions"
      class="mt-6"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import type { ExchangeBalance } from '../../types/portfolio';

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps<{ balances: ExchangeBalance[] }>();

const chartData = computed(() => ({
  labels: props.balances.map((balance) => balance.name),
  datasets: [
    {
      data: props.balances.map((balance) => balance.fiatValue),
      backgroundColor: ['#6366f1', '#22d3ee', '#f97316', '#22c55e', '#0ea5e9', '#14b8a6']
    }
  ]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const
    }
  }
};
</script>

<style scoped>
.Doughnut {
  height: 280px;
}
</style>
