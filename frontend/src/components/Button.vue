<template>
  <button :class="classes" :type="type">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost';
    type?: 'button' | 'submit' | 'reset';
  }>(),
  {
    variant: 'primary',
    type: 'button'
  }
);

const classes = computed(() => {
  const base = 'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition';
  const variants = {
    primary: 'bg-brand-500 text-white hover:bg-brand-700',
    secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700',
    ghost: 'border border-slate-700 text-slate-200 hover:bg-slate-800'
  };
  return `${base} ${variants[props.variant]}`;
});
</script>
