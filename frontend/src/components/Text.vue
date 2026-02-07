<template>
  <p :class="classes">
    <slot />
  </p>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    tone?: 'default' | 'muted' | 'brand';
    size?: 'sm' | 'md' | 'lg';
  }>(),
  {
    tone: 'default',
    size: 'md'
  }
);

const classes = computed(() => {
  const toneMap = {
    default: 'text-slate-200',
    muted: 'text-slate-400',
    brand: 'text-brand-500'
  };
  const sizeMap = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };
  return `${toneMap[props.tone]} ${sizeMap[props.size]} font-body`;
});
</script>
