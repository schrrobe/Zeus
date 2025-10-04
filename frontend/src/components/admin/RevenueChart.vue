<template>
  <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <header>
      <h3 class="text-lg font-semibold">Umsatzentwicklung</h3>
      <p class="text-sm text-slate-500 dark:text-slate-400">Premium Subscription Revenue (EUR)</p>
    </header>
    <Line :data="data" :options="options" class="mt-6" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import type { PerformancePoint } from '../../types/portfolio';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const props = defineProps<{ history: PerformancePoint[] }>();

const data = computed(() => ({
  labels: props.history.map((point) => point.date),
  datasets: [
    {
      label: 'MRR',
      data: props.history.map((point) => point.value),
      borderColor: '#22d3ee',
      backgroundColor: 'rgba(34, 211, 238, 0.2)',
      tension: 0.3,
      fill: true
    }
  ]
}));

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: { display: false }
    },
    y: {
      grid: { color: 'rgba(148, 163, 184, 0.2)' }
    }
  }
};
</script>

<style scoped>
.Line {
  height: 280px;
}
</style>
