<template>
  <div class="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <header class="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
      <div>
        <h3 class="text-lg font-semibold">Nutzerverwaltung</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400">Aktive Accounts inklusive Status</p>
      </div>
    </header>
    <table class="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
      <thead class="bg-slate-50 dark:bg-slate-900/60">
        <tr>
          <th class="px-6 py-3 text-left font-semibold">E-Mail</th>
          <th class="px-6 py-3 text-left font-semibold">Status</th>
          <th class="px-6 py-3 text-left font-semibold">Aktionen</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-900">
        <tr v-for="user in userArray" :key="user.id" class="hover:bg-primary/5">
          <td class="px-6 py-4">{{ user.email }}</td>
          <td class="px-6 py-4">
            <Badge :label="user.tier" :variant="user.tier === 'premium' ? 'success' : 'neutral'" />
          </td>
          <td class="px-6 py-4">
            <div class="flex items-center gap-2">
              <button
                type="button"
                class="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-600 hover:border-primary hover:text-primary"
                @click="$emit('toggle-tier', user.id)"
              >
                {{ user.tier === 'premium' ? 'Zu Free wechseln' : 'Premium aktivieren' }}
              </button>
              <button
                type="button"
                class="rounded-lg border border-red-300 px-3 py-1 text-xs font-semibold text-red-600 hover:border-red-500 hover:text-red-700"
                @click="$emit('delete-user', user.id)"
              >
                Löschen
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Badge from '../ui/Badge.vue';

defineEmits<{ 'delete-user': [userId: string]; 'toggle-tier': [userId: string] }>();

const props = defineProps<{ users: Map<string, { id: string; email: string; tier: 'free' | 'premium' }> }>();

const userArray = computed(() => Array.from(props.users.values()));
</script>
