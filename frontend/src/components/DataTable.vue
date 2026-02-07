<template>
  <div class="overflow-hidden rounded-xl border border-slate-800">
    <table class="min-w-full divide-y divide-slate-800">
      <thead class="bg-slate-900">
        <tr>
          <th
            v-for="header in headers"
            :key="header"
            class="px-4 py-3 text-left text-xs uppercase tracking-wide text-slate-400"
          >
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-800 bg-slate-950">
        <tr
          v-for="(row, index) in rows"
          :key="index"
          class="hover:bg-slate-900/60"
        >
          <td
            v-for="cell in row"
            :key="cell"
            class="px-4 py-3 text-sm text-slate-200"
          >
            {{ cell }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  headers: string[];
  rows: string[][];
}>();
</script>
