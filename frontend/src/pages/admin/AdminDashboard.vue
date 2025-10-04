<template>
  <section class="mx-auto w-full max-w-7xl space-y-10 px-6 py-10">
    <div class="rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 p-8 text-white shadow-xl">
      <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 class="text-3xl font-semibold">Admin Cockpit</h2>
          <p class="text-sm text-indigo-100">Behalte Umsätze, Transaktionen und Nutzer im Blick.</p>
        </div>
        <div class="grid grid-cols-3 gap-6">
          <div v-for="metric in summaryMetrics" :key="metric.label" class="rounded-2xl bg-white/15 p-4 text-left">
            <p class="text-xs uppercase tracking-wide text-indigo-100">{{ metric.label }}</p>
            <p class="mt-1 text-xl font-semibold">{{ metric.value }}</p>
          </div>
        </div>
      </div>
    </div>

    <AdminRevenueChart :revenue="summary?.revenueHistory ?? []" />

    <div class="grid gap-8 lg:grid-cols-2">
      <AdminUserTable :users="users" @toggle-premium="togglePremium" @delete-user="deleteUser" />
      <AdminNoticeComposer @save="saveNotice" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import AdminUserTable from '../../components/admin/AdminUserTable.vue';
import AdminNoticeComposer from '../../components/admin/AdminNoticeComposer.vue';
import AdminRevenueChart from '../../components/admin/AdminRevenueChart.vue';
import type { AdminDashboardSummary, ZeusUser } from '../../types';
import { apiClient } from '../../services/apiClient';

const users = ref<ZeusUser[]>([]);
const summary = ref<AdminDashboardSummary | null>(null);

const summaryMetrics = computed(() => [
  { label: 'Nutzer insgesamt', value: summary.value?.totalUsers ?? 0 },
  { label: 'Premium Nutzer', value: summary.value?.premiumUsers ?? 0 },
  { label: 'MRR (EUR)', value: summary.value?.monthlyRecurringRevenueEUR?.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) ?? '€0,00' }
]);

async function fetchUsers() {
  const response = await apiClient.get('/admin/users');
  users.value = response.data;
}

async function fetchSummary() {
  const response = await apiClient.get('/admin/summary');
  summary.value = response.data;
}

async function togglePremium(user: ZeusUser) {
  await apiClient.post(`/admin/users/${user.id}/subscription`, { tier: user.tier === 'premium' ? 'free' : 'premium' });
  await fetchUsers();
  await fetchSummary();
}

async function deleteUser(user: ZeusUser) {
  await apiClient.delete(`/admin/users/${user.id}`);
  await fetchUsers();
  await fetchSummary();
}

async function saveNotice(payload: { title: string; message: string; type: 'banner' | 'modal'; isActive: boolean }) {
  await apiClient.post('/admin/notices', payload);
}

onMounted(async () => {
  await Promise.all([fetchUsers(), fetchSummary()]);
});
</script>
