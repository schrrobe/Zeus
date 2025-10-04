<template>
  <div class="rounded-3xl bg-white shadow-lg ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
    <div class="flex items-center justify-between px-6 py-5">
      <div>
        <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Nutzerverwaltung</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400">Verwalte Zugänge, Premiumstatus und Löschungen.</p>
      </div>
      <slot name="actions" />
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
        <thead class="bg-slate-50/60 dark:bg-slate-800/60">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Name</th>
            <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">E-Mail</th>
            <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Status</th>
            <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Exchanges</th>
            <th class="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Aktionen</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
          <tr v-for="user in users" :key="user.id" class="bg-white/50 hover:bg-primary/5 dark:bg-slate-900/60">
            <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">{{ user.fullName }}</td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{{ user.email }}</td>
            <td class="whitespace-nowrap px-6 py-4 text-sm">
              <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold" :class="user.tier === 'premium' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'">
                {{ user.tier === 'premium' ? 'Premium' : 'Free' }}
              </span>
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{{ user.exchangesConnected }}</td>
            <td class="whitespace-nowrap px-6 py-4 text-right text-sm">
              <div class="flex justify-end gap-2">
                <button class="rounded-xl bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-300" @click="$emit('toggle-premium', user)">
                  {{ user.tier === 'premium' ? 'Premium entziehen' : 'Zu Premium machen' }}
                </button>
                <button class="rounded-xl bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-500/20 dark:text-rose-300" @click="$emit('delete-user', user)">
                  Löschen
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ZeusUser } from '../../types';

defineProps<{ users: ZeusUser[] }>();

defineEmits<{
  (e: 'toggle-premium', user: ZeusUser): void;
  (e: 'delete-user', user: ZeusUser): void;
}>();
</script>
