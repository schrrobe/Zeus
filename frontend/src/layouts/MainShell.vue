<template>
  <div class="flex min-h-screen">
    <aside class="hidden w-72 border-r border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900 lg:block">
      <slot name="navigation" />
    </aside>
    <div class="flex w-full flex-1 flex-col">
      <header class="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-950">
        <div>
          <h1 class="text-2xl font-semibold">Zeus</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">Digital Asset Intelligence Dashboard</p>
        </div>
        <ThemeSwitcher />
      </header>
      <main class="flex-1 bg-slate-50 p-6 dark:bg-slate-950/60">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import ThemeSwitcher from '../components/ThemeSwitcher.vue';
</script>
