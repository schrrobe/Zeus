<template>
  <section class="mx-auto w-full max-w-7xl space-y-8 px-6 py-10">
    <PortfolioHeader>
      <template #actions>
        <button class="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark" @click="handleConnectWallet">
          Wallet verbinden
        </button>
        <button class="rounded-xl border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10" @click="handleConnectExchange">
          Börse verbinden
        </button>
        <button class="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800" @click="handleRefresh">
          Aktualisieren
        </button>
      </template>
    </PortfolioHeader>

    <div class="grid gap-8 lg:grid-cols-3">
      <div class="space-y-8 lg:col-span-2">
        <PerformanceChart :snapshots="portfolio.snapshots" />
        <AllocationChart :snapshot="portfolio.snapshots[0] ?? null" />
      </div>
      <div class="space-y-6">
        <div class="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
          <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Aktueller Wert</h3>
          <p class="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{{ formatCurrency(portfolio.totalValue) }}</p>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Letztes Update: {{ lastUpdated }}</p>
        </div>
        <div class="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
          <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Verbindungen</h3>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">{{ connectionSummary }}</p>
          <RouterLink to="/subscription" class="mt-4 inline-flex items-center text-sm font-semibold text-primary hover:underline">
            Mehr Verbindungen freischalten
          </RouterLink>
        </div>
      </div>
    </div>

    <PortfolioSnapshotTable :positions="positions" />
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import PortfolioHeader from '../../components/dashboard/PortfolioHeader.vue';
import PerformanceChart from '../../components/portfolio/PerformanceChart.vue';
import AllocationChart from '../../components/portfolio/AllocationChart.vue';
import PortfolioSnapshotTable from '../../components/portfolio/PortfolioSnapshotTable.vue';
import { usePortfolioStore } from '../../stores/portfolio';
import { useAuthStore } from '../../stores/auth';
import { formatCurrency } from '../../utils/numberFormat';

const portfolio = usePortfolioStore();
const auth = useAuthStore();
const router = useRouter();

const positions = computed(() => {
  if (!portfolio.snapshots.length) return [];
  return [
    ...portfolio.snapshots[0].wallets.flatMap((wallet) => wallet.assets),
    ...portfolio.snapshots[0].exchanges.flatMap((exchange) => exchange.assets)
  ];
});

const lastUpdated = computed(() => portfolio.snapshots[0]?.timestamp ? new Date(portfolio.snapshots[0].timestamp).toLocaleString('de-DE') : '—');
const connectionSummary = computed(() => `${auth.currentUser?.exchangesConnected ?? 0} / ${auth.currentUser?.tier === 'premium' ? '∞' : '2'} Börsen verbunden`);

async function handleRefresh() {
  if (!portfolio.snapshots.length) return;
  await portfolio.refreshSnapshot(portfolio.snapshots[0].id);
}

function handleConnectWallet() {
  router.push('/portfolio/connect-wallet');
}

function handleConnectExchange() {
  router.push('/portfolio/connect-exchange');
}

onMounted(async () => {
  await portfolio.fetchSnapshots();
});
</script>
