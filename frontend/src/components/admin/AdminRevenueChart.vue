<template>
  <div class="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Umsatzentwicklung</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400">Tracke die monatlichen Stripe-Transaktionen.</p>
      </div>
    </div>
    <apexchart type="bar" height="280" :series="series" :options="chartOptions" class="mt-6" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import type { RevenuePoint } from '../../types';

const props = defineProps<{ revenue: RevenuePoint[] }>();

const chartOptions = computed(() => ({
  chart: {
    toolbar: { show: false },
    foreColor: '#94a3b8'
  },
  plotOptions: {
    bar: {
      borderRadius: 8,
      columnWidth: '45%'
    }
  },
  xaxis: {
    categories: props.revenue.map((point) => point.month)
  },
  dataLabels: { enabled: false },
  theme: {
    mode: typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  }
}));

const series = computed(() => [
  {
    name: 'Umsatz EUR',
    data: props.revenue.map((point) => point.revenueEUR)
  }
]);

const apexchart = VueApexCharts;
</script>
