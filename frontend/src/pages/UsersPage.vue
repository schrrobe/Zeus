<template>
  <section class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <Headline size="lg">Organisationsnutzer</Headline>
        <Text tone="muted">Permissions pro Feature steuern.</Text>
      </div>
      <Button>Neuen Nutzer anlegen</Button>
    </div>

    <DataTable
      :headers="['Name', 'Rolle', 'Rechnungen', 'Kunden', 'Produkte', 'Aktion']"
      :rows="rows"
    />

    <div class="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <Headline size="md">Permissions Editor</Headline>
      <Text tone="muted">Lesen / Bearbeiten pro Seite festlegen.</Text>
    </div>
  </section>
</template>

<script setup lang="ts">
import Headline from '../components/Headline.vue';
import Text from '../components/Text.vue';
import Button from '../components/Button.vue';
import DataTable from '../components/DataTable.vue';

const rows = [
  ['Max Müller', 'Organisationsleiter', 'Vollzugriff', 'Vollzugriff', 'Vollzugriff', '—'],
  ['Anna Stein', 'Mitarbeiter', 'Lesen', 'Bearbeiten', 'Lesen', 'Bearbeiten']
];
</script>
