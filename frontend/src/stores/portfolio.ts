import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { PortfolioSnapshot, ExchangeConnectionPayload } from '../types';
import { apiClient } from '../services/apiClient';

export const usePortfolioStore = defineStore('portfolio', () => {
  const snapshots = ref<PortfolioSnapshot[]>([]);
  const isLoading = ref(false);

  const totalValue = computed(() => snapshots.value.reduce((sum, snap) => sum + snap.totalValueEUR, 0));
  const premiumConnections = computed(() => new Set(snapshots.value.flatMap((snap) => snap.exchanges.map((ex) => ex.exchangeName))));

  async function fetchSnapshots() {
    isLoading.value = true;
    try {
      const response = await apiClient.get('/portfolio');
      snapshots.value = response.data;
    } finally {
      isLoading.value = false;
    }
  }

  async function refreshSnapshot(id: string) {
    await apiClient.post(`/portfolio/${id}/refresh`);
    await fetchSnapshots();
  }

  async function connectExchange(payload: ExchangeConnectionPayload) {
    await apiClient.post('/integrations/exchange', payload);
    await fetchSnapshots();
  }

  async function connectWallet(address: string, network: string) {
    await apiClient.post('/integrations/wallet', { address, network });
    await fetchSnapshots();
  }

  return {
    snapshots,
    isLoading,
    totalValue,
    premiumConnections,
    fetchSnapshots,
    refreshSnapshot,
    connectExchange,
    connectWallet
  };
});
