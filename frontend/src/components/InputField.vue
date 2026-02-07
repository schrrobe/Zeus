<template>
  <label class="block text-sm text-slate-300">
    <span class="mb-1 block">{{ label }}</span>
    <input
      :type="type"
      :placeholder="placeholder"
      class="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"
    />
  </label>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string;
    type?: string;
    placeholder?: string;
  }>(),
  {
    type: 'text',
    placeholder: ''
  }
);
</script>
