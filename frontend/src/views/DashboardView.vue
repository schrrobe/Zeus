<template>
  <section class="space-y-6">
    <div class="grid gap-4 md:grid-cols-4">
      <StatCard
        v-for="stat in stats"
        :key="stat.label"
        v-bind="stat"
      />
    </div>
    <div class="grid gap-6 lg:grid-cols-3">
      <div class="lg:col-span-2">
        <PerformanceChart :points="portfolio?.performance ?? []" />
      </div>
      <DistributionChart :balances="portfolio?.balances ?? []" />
    </div>
    <AssetTable :balances="portfolio?.balances ?? []" />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import AssetTable from '../components/tables/AssetTable.vue';
import PerformanceChart from '../components/charts/PerformanceChart.vue';
import DistributionChart from '../components/charts/DistributionChart.vue';
import StatCard from '../components/stats/StatCard.vue';
import { apiClient } from '../services/api-client';

const { data: portfolio } = useQuery(['portfolio'], apiClient.getPortfolio, {
  staleTime: 1000 * 15
});

const stats = computed(() => [
  {
    label: 'Portfolio Wert',
    value: portfolio.value ? new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(portfolio.value.totalValue) : '–',
    sublabel: 'Aktueller Marktpreis'
  },
  {
    label: 'Investiert',
    value: portfolio.value ? new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(portfolio.value.totalInvested) : '–',
    sublabel: 'Eingezahltes Kapital'
  },
  {
    label: 'Gewinn',
    value: portfolio.value ? new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(portfolio.value.totalProfit) : '–',
    sublabel: portfolio.value ? `${portfolio.value.totalProfitPercentage.toFixed(2)}%` : ''
  },
  {
    label: 'Positionen',
    value: portfolio.value?.balances.length ?? 0,
    sublabel: 'Wallets & Börsen'
  }
]);
</script>
