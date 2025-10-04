<template>
  <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
      <div class="flex items-center gap-3">
        <span class="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">Ζ</span>
        <div>
          <h1 class="text-lg font-semibold text-slate-800 dark:text-slate-100">Zeus</h1>
          <p class="text-xs text-slate-500 dark:text-slate-400">Ganzheitliches Krypto-Portfolio</p>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <button class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800" @click="$emit('toggle-theme')">
          Theme wechseln
        </button>
        <div v-if="user" class="flex items-center gap-3">
          <div class="text-right">
            <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ user.fullName }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              {{ isPremium ? 'Premium Nutzer' : 'Free Nutzer' }}
            </p>
          </div>
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-semibold">
            {{ initials }}
          </div>
        </div>
      </div>
    </div>
    <TransitionGroup name="slide-fade">
      <div v-for="notice in activeNotices" :key="notice.id" class="bg-gradient-to-r from-primary to-purple-600 px-6 py-3 text-center text-sm font-medium text-white">
        {{ notice.title }} — {{ notice.message }}
      </div>
    </TransitionGroup>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ZeusUser, AdminNotice } from '../../types';

const props = defineProps<{ user: ZeusUser | null; isPremium: boolean; adminNotices: AdminNotice[] }>();

const initials = computed(() => props.user?.fullName.split(' ').map((part) => part[0]).join('') ?? 'Z');
const activeNotices = computed(() => props.adminNotices.filter((notice) => notice.isActive));
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
