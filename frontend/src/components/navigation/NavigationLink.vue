<template>
  <li>
    <RouterLink
      :to="to"
      class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-primary/10 hover:text-primary dark:text-slate-300 dark:hover:bg-primary/20"
      active-class="bg-primary/10 text-primary dark:bg-primary/20"
    >
      <component :is="iconComponent" class="h-5 w-5" aria-hidden="true" />
      <span>{{ label }}</span>
    </RouterLink>
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { ChartBarIcon, Cog6ToothIcon, HomeIcon, ShieldCheckIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  to: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  }
});

const iconComponent = computed(() => ({
  HomeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ShieldCheckIcon
})[props.icon as keyof typeof import('@heroicons/vue/24/outline')] ?? HomeIcon);
</script>
