<template>
  <div class="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Performance über die Zeit</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400">Verfolge deine Wertentwicklung auf Monatsbasis.</p>
      </div>
      <slot name="actions" />
    </div>
    <apexchart type="area" height="320" :options="chartOptions" :series="series" class="mt-6" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import type { PortfolioSnapshot } from '../../types';

const props = defineProps<{ snapshots: PortfolioSnapshot[] }>();

const series = computed(() => [
  {
    name: 'Portfolio Wert',
    data: props.snapshots.map((snapshot) => ({ x: snapshot.timestamp, y: snapshot.totalValueEUR }))
  }
]);

const chartOptions = computed(() => ({
  chart: {
    id: 'performance-chart',
    toolbar: { show: false },
    foreColor: '#94a3b8'
  },
  stroke: {
    curve: 'smooth',
    width: 3
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.1,
      stops: [0, 90, 100]
    }
  },
  xaxis: {
    type: 'datetime'
  },
  theme: {
    mode: typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  }
}));

const apexchart = VueApexCharts;
</script>
