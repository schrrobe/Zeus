import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { ZeusUser, SubscriptionTier, AdminNotice } from '../types';
import { apiClient } from '../services/apiClient';

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<ZeusUser | null>(null);
  const token = ref<string | null>(null);
  const adminNotices = ref<AdminNotice[]>([]);

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => currentUser.value?.role === 'admin');

  async function signIn(email: string, password: string) {
    const response = await apiClient.post('/auth/login', { email, password });
    token.value = response.data.token;
    currentUser.value = response.data.user;
  }

  async function register(payload: { email: string; password: string; fullName: string }) {
    const response = await apiClient.post('/auth/register', payload);
    token.value = response.data.token;
    currentUser.value = response.data.user;
  }

  function signOut() {
    token.value = null;
    currentUser.value = null;
  }

  async function fetchAdminNotices() {
    if (!isAuthenticated.value) return;
    const response = await apiClient.get('/admin/notices');
    adminNotices.value = response.data;
  }

  async function updateSubscription(tier: SubscriptionTier) {
    const response = await apiClient.post('/billing/subscription', { tier });
    currentUser.value = response.data.user;
  }

  return {
    currentUser,
    token,
    isAuthenticated,
    isAdmin,
    adminNotices,
    signIn,
    register,
    signOut,
    fetchAdminNotices,
    updateSubscription
  };
}, {
  persist: {
    key: 'zeus-auth',
    paths: ['currentUser', 'token']
  }
});
