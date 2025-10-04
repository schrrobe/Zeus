<template>
  <BaseLayout>
    <RouterView />
  </BaseLayout>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import BaseLayout from './layouts/BaseLayout.vue';
</script>
