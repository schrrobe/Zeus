<template>
  <section class="space-y-6">
    <header class="rounded-xl border border-slate-200 bg-gradient-to-br from-primary to-secondary p-6 text-white shadow-lg dark:border-slate-800">
      <h2 class="text-2xl font-semibold">Portfolio Synchronisierung</h2>
      <p class="mt-1 max-w-2xl text-sm text-primary-100">
        Verwalte deine angebundenen Wallets und Börsen. Free Nutzer können zwei Börsen verbinden, Premium Nutzer unbegrenzt.
      </p>
    </header>
    <ExchangeSyncManager />
  </section>
</template>

<script setup lang="ts">
import ExchangeSyncManager from '../components/settings/ExchangeSyncManager.vue';
</script>
