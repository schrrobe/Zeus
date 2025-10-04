<template>
  <section class="space-y-6">
    <header class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 class="text-2xl font-semibold">Einstellungen</h2>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Passe Benachrichtigungen, Sicherheit und Zahlungsmethoden an.</p>
    </header>
    <div class="grid gap-6 lg:grid-cols-2">
      <NotificationPreferences />
      <SubscriptionCard />
    </div>
  </section>
</template>

<script setup lang="ts">
import NotificationPreferences from '../components/settings/NotificationPreferences.vue';
import SubscriptionCard from '../components/settings/SubscriptionCard.vue';
</script>
