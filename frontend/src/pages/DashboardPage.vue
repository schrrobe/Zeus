<template>
  <section class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <Headline size="xl">Organisationsübersicht</Headline>
        <Text tone="muted">Gesamtumsatz und Status deiner Organisation.</Text>
      </div>
      <Button variant="secondary">Zeitraum filtern</Button>
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
      <div class="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <Text tone="muted">Umsatz Monat</Text>
        <Headline size="lg">€ 42.980</Headline>
      </div>
      <div class="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <Text tone="muted">Offene Rechnungen</Text>
        <Headline size="lg">18</Headline>
      </div>
      <div class="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <Text tone="muted">Zahlende Orgs</Text>
        <Headline size="lg">7/10</Headline>
      </div>
    </div>

    <div class="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div class="flex items-center justify-between">
        <Headline size="md">Umsatzentwicklung</Headline>
        <Button variant="ghost">Filter Jahr/Monat</Button>
      </div>
      <div class="mt-6 h-64 rounded-lg border border-dashed border-slate-700 bg-slate-950/40 flex items-center justify-center">
        <Text tone="muted">Diagramm-Platzhalter (Chart.js)</Text>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Headline from '../components/Headline.vue';
import Text from '../components/Text.vue';
import Button from '../components/Button.vue';
</script>
