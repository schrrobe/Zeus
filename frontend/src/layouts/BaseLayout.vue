<template>
  <div :class="theme">
    <div class="min-h-screen flex flex-col">
      <ZeusTopBar
        :user="user"
        :is-premium="isPremium"
        :admin-notices="bannerMessages"
        @toggle-theme="toggleTheme"
      />
      <main class="flex-1 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-950 dark:to-black">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useTheme } from '../composables/useTheme';
import ZeusTopBar from '../components/navigation/ZeusTopBar.vue';

const auth = useAuthStore();
const { theme, toggleTheme } = useTheme();

const user = computed(() => auth.currentUser);
const isPremium = computed(() => auth.currentUser?.tier === 'premium');
const bannerMessages = computed(() => auth.adminNotices);
</script>
