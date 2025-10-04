<template>
  <form class="flex items-center gap-2" @submit.prevent="submit">
    <input
      v-model="title"
      type="text"
      required
      placeholder="Banner Titel"
      class="w-48 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-900"
    />
    <input
      v-model="message"
      type="text"
      required
      placeholder="Nachricht"
      class="w-64 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-900"
    />
    <select
      v-model="type"
      class="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-900"
    >
      <option value="info">Info</option>
      <option value="success">Erfolg</option>
      <option value="warning">Warnung</option>
    </select>
    <button
      type="submit"
      class="inline-flex items-center rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark"
    >
      Banner senden
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'submit', payload: { title: string; message: string; type: 'info' | 'warning' | 'success' }): void;
}>();

const title = ref('');
const message = ref('');
const type = ref<'info' | 'warning' | 'success'>('info');

function submit() {
  emit('submit', { title: title.value, message: message.value, type: type.value });
  title.value = '';
  message.value = '';
  type.value = 'info';
}
</script>
