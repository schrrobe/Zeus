<template>
  <div class="min-h-screen bg-slate-950 text-slate-100" :data-theme="theme.config.mode">
    <div class="flex min-h-screen">
      <aside class="w-64 border-r border-slate-800 bg-slate-900 px-6 py-8">
        <div class="mb-8">
          <Headline size="lg">Zeus Invoicing</Headline>
          <Text tone="muted">Mehrmandanten SaaS</Text>
        </div>
        <nav class="space-y-2 text-sm">
          <RouterLink class="nav-link" to="/dashboard">Übersicht</RouterLink>
          <RouterLink class="nav-link" to="/customers">Kunden</RouterLink>
          <RouterLink class="nav-link" to="/invoices">Rechnungen</RouterLink>
          <RouterLink class="nav-link" to="/products">Produkte &amp; Services</RouterLink>
          <RouterLink class="nav-link" to="/settings">Einstellungen</RouterLink>
          <RouterLink class="nav-link" to="/users">Nutzer &amp; Rechte</RouterLink>
          <RouterLink class="nav-link" to="/admin">Admin</RouterLink>
        </nav>
        <div class="mt-8">
          <Button variant="secondary" @click="toggleTheme">Theme umschalten</Button>
        </div>
      </aside>
      <main class="flex-1 px-page-x py-page-y">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { useThemeStore } from './stores/theme';
import Headline from './components/Headline.vue';
import Text from './components/Text.vue';
import Button from './components/Button.vue';

const theme = useThemeStore();

onMounted(() => {
  theme.applyTheme();
});

const toggleTheme = () => {
  theme.applyTheme({
    mode: theme.config.mode === 'dark' ? 'light' : 'dark'
  });
};
</script>

<style scoped>
.nav-link {
  display: block;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  color: #e2e8f0;
}

.nav-link.router-link-active {
  background-color: rgba(15, 118, 110, 0.4);
  color: #ecfeff;
}
</style>
