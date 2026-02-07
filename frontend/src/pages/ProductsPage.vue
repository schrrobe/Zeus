<template>
  <section class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <Headline size="lg">Produkte &amp; Dienstleistungen</Headline>
        <Text tone="muted">Produkte für die Rechnungserstellung pflegen.</Text>
      </div>
      <Button>Neues Produkt</Button>
    </div>

    <div class="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
      <Headline size="md">Produkt anlegen</Headline>
      <div class="grid gap-4 md:grid-cols-2">
        <InputField label="Name" placeholder="Dienstleistung" />
        <InputField label="Preis" placeholder="€" />
        <InputField label="Einheit" placeholder="Stück, Stunde" />
        <InputField label="Steuersatz" placeholder="19%" />
      </div>
      <Button>Speichern</Button>
    </div>

    <DataTable
      :headers="['Name', 'Preis', 'Einheit', 'Steuersatz']"
      :rows="rows"
    />
  </section>
</template>

<script setup lang="ts">
import Headline from '../components/Headline.vue';
import Text from '../components/Text.vue';
import Button from '../components/Button.vue';
import InputField from '../components/InputField.vue';
import DataTable from '../components/DataTable.vue';

const rows = [
  ['Beratung', '€ 180', 'Stunde', '19%'],
  ['Design-Paket', '€ 950', 'Paket', '7%']
];
</script>
