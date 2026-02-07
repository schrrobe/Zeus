<template>
  <section class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <Headline size="lg">Kunde: Muster GmbH</Headline>
        <Text tone="muted">Adresse, Ansprechpartner und Notizen verwalten.</Text>
      </div>
      <Button variant="secondary">Speichern</Button>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <div class="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
        <Headline size="md">Kerndaten</Headline>
        <InputField label="Adresse" placeholder="Hauptstraße 1, 10115 Berlin" />
        <InputField label="Ansprechpartner" placeholder="Erika Mustermann" />
        <InputField label="Telefon" placeholder="+49 30 123456" />
      </div>
      <div class="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
        <Headline size="md">Notizen</Headline>
        <Text tone="muted">Letzter Eintrag von: Max Müller</Text>
        <textarea
          class="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
          rows="6"
          placeholder="Notiz über den Kunden"
        ></textarea>
        <Button variant="primary">Notiz speichern</Button>
      </div>
    </div>

    <div class="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div class="flex items-center justify-between">
        <Headline size="md">Umsatz pro Kunde</Headline>
        <Button variant="ghost">Filter Jahr/Monat</Button>
      </div>
      <div class="mt-6 h-56 rounded-lg border border-dashed border-slate-700 flex items-center justify-center">
        <Text tone="muted">Diagramm-Platzhalter</Text>
      </div>
    </div>

    <div class="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <Headline size="md" class="mb-4">Rechnungen &amp; Gutschriften</Headline>
      <DataTable
        :headers="['Nummer', 'Datum', 'Status', 'Betrag']"
        :rows="invoiceRows"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import Headline from '../components/Headline.vue';
import Text from '../components/Text.vue';
import Button from '../components/Button.vue';
import InputField from '../components/InputField.vue';
import DataTable from '../components/DataTable.vue';

const invoiceRows = [
  ['RE-2024-120', '12.09.2024', 'Bezahlt', '€ 1.250'],
  ['GS-2024-013', '01.09.2024', 'Offen', '-€ 250']
];
</script>
