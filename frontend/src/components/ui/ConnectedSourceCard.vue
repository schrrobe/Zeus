<template>
  <li class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <header class="flex items-center justify-between">
      <div>
        <p class="text-sm font-semibold">{{ name }}</p>
        <p class="text-xs text-slate-500">{{ provider.toUpperCase() }} · {{ platformLabel }}</p>
      </div>
      <Badge :label="syncLabel" :variant="syncVariant" />
    </header>
    <dl class="mt-4 space-y-1 text-sm">
      <div class="flex items-center justify-between text-slate-500">
        <dt>Balance</dt>
        <dd>{{ balance }} {{ currency }}</dd>
      </div>
      <div class="flex items-center justify-between text-slate-500">
        <dt>Wert</dt>
        <dd>{{ formatCurrency(fiatValue) }}</dd>
      </div>
      <div class="flex items-center justify-between text-slate-500">
        <dt>Synchronisiert</dt>
        <dd>{{ formatDate(lastSyncedAt) }}</dd>
      </div>
    </dl>
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Badge from './Badge.vue';

const props = defineProps({
  name: String,
  provider: String,
  platform: String,
  balance: Number,
  currency: String,
  fiatValue: Number,
  lastSyncedAt: String
});

const platformLabel = computed(() => (props.platform === 'wallet' ? 'Wallet' : 'Börse'));
const syncLabel = computed(() => `Zuletzt ${new Intl.RelativeTimeFormat('de', { numeric: 'auto' }).format(-1, 'hours')}`);
const syncVariant = computed(() => 'neutral');

function formatCurrency(value?: number) {
  if (value == null) return '–';
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
}

function formatDate(value?: string) {
  if (!value) return '–';
  return new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}
</script>
