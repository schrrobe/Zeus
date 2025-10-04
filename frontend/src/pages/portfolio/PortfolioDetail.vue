<template>
  <section class="mx-auto w-full max-w-6xl space-y-8 px-6 py-10">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-semibold text-slate-900 dark:text-white">Portfolio-Detail</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">Individuelle Ansicht für Wallet oder Börse.</p>
      </div>
      <button class="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800" @click="goBack">
        Zurück
      </button>
    </div>
    <PortfolioSnapshotTable :positions="positions" />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PortfolioSnapshotTable from '../../components/portfolio/PortfolioSnapshotTable.vue';
import { usePortfolioStore } from '../../stores/portfolio';

const route = useRoute();
const router = useRouter();
const portfolio = usePortfolioStore();

const positions = computed(() => {
  const id = route.params.id as string;
  const snapshot = portfolio.snapshots.find((entry) => entry.id === id);
  if (!snapshot) return [];
  return [
    ...snapshot.wallets.flatMap((wallet) => wallet.assets),
    ...snapshot.exchanges.flatMap((exchange) => exchange.assets)
  ];
});

function goBack() {
  router.back();
}
</script>
