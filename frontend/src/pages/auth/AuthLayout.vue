<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-950">
    <div class="w-full max-w-md bg-white/10 backdrop-blur rounded-3xl shadow-2xl p-10 text-white">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-semibold tracking-tight">Zeus</h1>
        <p class="mt-2 text-slate-200">Verwalte deine Krypto-Werte an einem Ort.</p>
      </div>
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>
