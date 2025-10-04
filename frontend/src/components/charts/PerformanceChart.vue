<template>
  <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <header class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold">Performance</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">Wertentwicklung deines Portfolios</p>
      </div>
      <slot name="actions" />
    </header>
    <Line
      v-if="chartData"
      :data="chartData"
      :options="chartOptions"
      class="mt-6"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import type { PerformancePoint } from '../../types/portfolio';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const props = defineProps<{ points: PerformancePoint[] }>();

const chartData = computed(() => ({
  labels: props.points.map((point) => point.date),
  datasets: [
    {
      label: 'Portfolio Wert',
      data: props.points.map((point) => point.value),
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99, 102, 241, 0.2)',
      tension: 0.3,
      fill: true
    }
  ]
}));

const chartOptions = {
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
