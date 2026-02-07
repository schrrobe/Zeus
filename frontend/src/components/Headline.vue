<template>
  <component :is="tag" :class="classes">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg' | 'xl';
    tag?: keyof HTMLElementTagNameMap;
  }>(),
  {
    size: 'md',
    tag: 'h2'
  }
);

const classes = computed(() => {
  const sizeMap = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };
  return `font-heading font-semibold ${sizeMap[props.size]}`;
});
</script>
