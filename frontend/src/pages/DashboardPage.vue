<template>
  <section class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <Headline size="xl">Organisationsübersicht</Headline>
        <Text tone="muted">Gesamtumsatz und Status deiner Organisation.</Text>
      </div>
      <Button variant="secondary">Zeitraum filtern</Button>
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
      <div class="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <Text tone="muted">Umsatz Monat</Text>
        <Headline size="lg">{{ formattedRevenueMonth }}</Headline>
      </div>
      <div class="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <Text tone="muted">Offene Rechnungen</Text>
        <Headline size="lg">{{ dashboard.summary.openInvoices }}</Headline>
      </div>
      <div class="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <Text tone="muted">Zahlende Orgs</Text>
        <Headline size="lg">
          {{ dashboard.summary.payingOrganizations }}/{{ dashboard.summary.totalOrganizations }}
        </Headline>
      </div>
    </div>

    <div class="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div class="flex items-center justify-between">
        <Headline size="md">Umsatzentwicklung</Headline>
        <Button variant="ghost">Filter Jahr/Monat</Button>
      </div>
      <div class="mt-6 h-64 rounded-lg border border-slate-700 bg-slate-950/40 p-4">
        <canvas ref="chartCanvas" class="h-full w-full"></canvas>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import Chart from 'chart.js/auto';
import Headline from '../components/Headline.vue';
import Text from '../components/Text.vue';
import Button from '../components/Button.vue';

type DashboardResponse = {
  summary: {
    revenueMonthCents: number;
    openInvoices: number;
    payingOrganizations: number;
    totalOrganizations: number;
  };
  chart: {
    labels: string[];
    values: number[];
  };
};

const chartCanvas = ref<HTMLCanvasElement | null>(null);
const chartInstance = ref<Chart | null>(null);
const dashboard = ref<DashboardResponse>({
  summary: {
    revenueMonthCents: 0,
    openInvoices: 0,
    payingOrganizations: 0,
    totalOrganizations: 0
  },
  chart: {
    labels: [],
    values: []
  }
});

const formattedRevenueMonth = computed(() => {
  const amount = dashboard.value.summary.revenueMonthCents / 100;
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
});

const renderChart = () => {
  if (!chartCanvas.value) {
    return;
  }

  if (chartInstance.value) {
    chartInstance.value.destroy();
  }

  chartInstance.value = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: dashboard.value.chart.labels,
      datasets: [
        {
          label: 'Umsatz',
          data: dashboard.value.chart.values.map((value) => value / 100),
          borderColor: '#38bdf8',
          backgroundColor: 'rgba(56, 189, 248, 0.2)',
          tension: 0.35,
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: '#38bdf8'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: { color: '#94a3b8' },
          grid: { color: 'rgba(148, 163, 184, 0.2)' }
        },
        y: {
          ticks: {
            color: '#94a3b8',
            callback: (value) =>
              new Intl.NumberFormat('de-DE', {
                style: 'currency',
                currency: 'EUR',
                maximumFractionDigits: 0
              }).format(Number(value))
          },
          grid: { color: 'rgba(148, 163, 184, 0.2)' }
        }
      },
      plugins: {
        legend: { labels: { color: '#e2e8f0' } },
        tooltip: {
          callbacks: {
            label: (context) =>
              `${context.dataset.label}: ${new Intl.NumberFormat('de-DE', {
                style: 'currency',
                currency: 'EUR'
              }).format(context.parsed.y)}`
          }
        }
      }
    }
  });
};

const loadDashboard = async () => {
  const response = await fetch('/api/dashboard');
  if (!response.ok) {
    return;
  }
  dashboard.value = (await response.json()) as DashboardResponse;
  renderChart();
};

onMounted(() => {
  loadDashboard();
});

onBeforeUnmount(() => {
  chartInstance.value?.destroy();
});
</script>
