<template>
  <section class="space-y-6">
    <header class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-semibold">Admin Dashboard</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">Verwalte Nutzer, Banner und Umsatzentwicklung.</p>
      </div>
      <AdminBannerComposer @submit="handleBannerSubmit" />
    </header>
    <AdminSummaryGrid :summary="summary" />
    <div class="grid gap-6 lg:grid-cols-3">
      <div class="lg:col-span-2">
        <RevenueChart :history="summary?.revenueHistory ?? []" />
      </div>
      <TransactionList :transactions="summary?.transactions ?? []" />
    </div>
    <UserManagementTable
      :users="summaryUsers"
      @delete-user="deleteUser"
      @toggle-tier="toggleTier"
    />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import AdminBannerComposer from '../components/admin/AdminBannerComposer.vue';
import AdminSummaryGrid from '../components/admin/AdminSummaryGrid.vue';
import RevenueChart from '../components/admin/RevenueChart.vue';
import TransactionList from '../components/admin/TransactionList.vue';
import UserManagementTable from '../components/admin/UserManagementTable.vue';
import { apiClient } from '../services/api-client';

const queryClient = useQueryClient();
const { data: summary } = useQuery(['admin-summary'], apiClient.getAdminSummary);

const summaryUsers = computed(() => summary.value?.transactions.reduce((acc, transaction) => {
  const user = acc.get(transaction.userId) ?? {
    id: transaction.userId,
    email: transaction.userEmail,
    tier: summary.value?.premiumUsers && summary.value?.premiumUsers > 0 ? 'premium' : 'free'
  };
  acc.set(transaction.userId, user);
  return acc;
}, new Map<string, { id: string; email: string; tier: 'free' | 'premium' }>()) ?? new Map();

async function handleBannerSubmit(payload: { title: string; message: string; type: 'info' | 'warning' | 'success' }) {
  await apiClient.upsertBanner({ ...payload, visible: true });
  await queryClient.invalidateQueries({ queryKey: ['admin-summary'] });
}

async function deleteUser(userId: string) {
  await apiClient.deleteUser(userId);
  await queryClient.invalidateQueries({ queryKey: ['admin-summary'] });
}

async function toggleTier(userId: string) {
  const user = summaryUsers.value.get(userId);
  if (!user) return;
  const newTier = user.tier === 'premium' ? 'free' : 'premium';
  await apiClient.updateUserTier(userId, newTier);
  await queryClient.invalidateQueries({ queryKey: ['admin-summary'] });
}
</script>
