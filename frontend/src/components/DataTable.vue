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
          v-for="(row, index) in paginatedRows"
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
    <div class="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-300">
      <div class="flex items-center gap-3">
        <span>Einträge pro Seite</span>
        <select
          v-model.number="pageSize"
          class="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-slate-200"
        >
          <option v-for="option in resolvedPageSizeOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>
      <div class="flex items-center gap-4">
        <span>{{ rangeLabel }}</span>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="rounded-lg border border-slate-700 px-2 py-1 text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            Zurück
          </button>
          <button
            type="button"
            class="rounded-lg border border-slate-700 px-2 py-1 text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
            :disabled="currentPage >= totalPages"
            @click="currentPage++"
          >
            Weiter
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  headers: string[];
  rows: string[][];
  pageSizeOptions?: number[];
  initialPageSize?: number;
}>();

const defaultOptions = [10, 25, 50];
const resolvedPageSizeOptions = computed(() =>
  props.pageSizeOptions && props.pageSizeOptions.length > 0
    ? props.pageSizeOptions
    : defaultOptions
);
const pageSize = ref(props.initialPageSize ?? resolvedPageSizeOptions.value[0]);
const currentPage = ref(1);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.rows.length / pageSize.value))
);
const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return props.rows.slice(start, start + pageSize.value);
});
const rangeLabel = computed(() => {
  if (props.rows.length === 0) {
    return '0 von 0';
  }
  const start = (currentPage.value - 1) * pageSize.value + 1;
  const end = Math.min(currentPage.value * pageSize.value, props.rows.length);
  return `${start}-${end} von ${props.rows.length}`;
});

watch(pageSize, () => {
  currentPage.value = 1;
});

watch(
  () => props.rows.length,
  () => {
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value;
    }
  }
);
</script>
