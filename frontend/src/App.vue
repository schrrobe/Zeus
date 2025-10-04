<template>
  <div :class="[{ dark: theme === 'dark' }]">
    <div class="min-h-screen bg-slate-100 text-slate-950 dark:bg-surface dark:text-foreground">
      <MainShell>
        <template #navigation>
          <MainNavigation />
        </template>
        <router-view />
      </MainShell>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import MainNavigation from './components/navigation/MainNavigation.vue';
import MainShell from './layouts/MainShell.vue';
import { useUiStore } from './stores/ui-store';

const ui = useUiStore();
const { theme } = storeToRefs(ui);
</script>
