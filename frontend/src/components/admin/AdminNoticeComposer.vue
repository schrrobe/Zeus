<template>
  <div class="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
    <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Banner & Pop-ups</h3>
    <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Teile wichtige Updates mit allen Nutzer:innen.</p>
    <form class="mt-6 space-y-5" @submit.prevent="emitNotice">
      <div class="grid gap-4 md:grid-cols-2">
        <label class="space-y-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Titel</span>
          <input v-model="title" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" required />
        </label>
        <label class="space-y-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Typ</span>
          <select v-model="type" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
            <option value="banner">Banner</option>
            <option value="modal">Pop-up</option>
          </select>
        </label>
      </div>
      <label class="space-y-2">
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Nachricht</span>
        <textarea v-model="message" rows="3" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" required />
      </label>
      <div class="flex items-center justify-between">
        <label class="inline-flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
          <input v-model="isActive" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" />
          Aktivieren
        </label>
        <button type="submit" class="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark">Mitteilung speichern</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'save', payload: { title: string; message: string; type: 'banner' | 'modal'; isActive: boolean }): void;
}>();

const title = ref('');
const message = ref('');
const type = ref<'banner' | 'modal'>('banner');
const isActive = ref(true);

function emitNotice() {
  emit('save', { title: title.value, message: message.value, type: type.value, isActive: isActive.value });
  title.value = '';
  message.value = '';
  type.value = 'banner';
  isActive.value = true;
}
</script>
