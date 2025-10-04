<template>
  <div class="space-y-6">
    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <header class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold">Verbundenen Dienste</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400">Wallets und Börsen, die aktuell überwacht werden</p>
        </div>
        <Badge :label="tierLabel" :variant="isPremium ? 'success' : 'neutral'" />
      </header>
      <ul class="mt-6 grid gap-4 md:grid-cols-2">
        <ConnectedSourceCard
          v-for="source in connectedSources"
          :key="source.id"
          v-bind="source"
        />
      </ul>
    </div>
    <div class="rounded-xl border border-dashed border-primary/60 bg-primary/5 p-6 text-primary-900 dark:border-primary/40 dark:bg-primary/10 dark:text-primary-100">
      <h3 class="text-lg font-semibold">Weitere Quelle anbinden</h3>
      <p class="mt-1 text-sm">
        Unterstützt: Ethereum, Solana, Bitcoin Wallets sowie Bitvavo, Coinbase, Bitpanda, Binance (API) – Premium Nutzer erhalten schnellere Aktualisierungen.
      </p>
      <button
        type="button"
        class="mt-4 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark"
      >
        Quelle hinzufügen
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import Badge from '../ui/Badge.vue';
import ConnectedSourceCard from '../ui/ConnectedSourceCard.vue';
import { apiClient } from '../../services/api-client';

const { data: profile } = useQuery(['profile'], apiClient.getUserProfile);
const { data: portfolio } = useQuery(['portfolio'], apiClient.getPortfolio);

const isPremium = computed(() => profile.value?.tier === 'premium');
const tierLabel = computed(() => (isPremium.value ? 'Premium Nutzer' : 'Free Nutzer'));
const connectedSources = computed(() => portfolio.value?.balances ?? []);
</script>
