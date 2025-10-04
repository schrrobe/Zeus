<template>
  <nav class="space-y-6">
    <div>
      <p class="text-xs font-semibold uppercase text-slate-400">Bereiche</p>
      <ul class="mt-3 space-y-2">
        <NavigationLink to="/" icon="HomeIcon" label="Übersicht" />
        <NavigationLink to="/portfolio" icon="ChartBarIcon" label="Portfolio" />
        <NavigationLink to="/settings" icon="Cog6ToothIcon" label="Einstellungen" />
      </ul>
    </div>
    <div>
      <p class="text-xs font-semibold uppercase text-slate-400">Admin</p>
      <ul class="mt-3 space-y-2">
        <NavigationLink to="/admin" icon="ShieldCheckIcon" label="Admin Dashboard" />
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import NavigationLink from './NavigationLink.vue';
</script>
