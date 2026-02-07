<template>
  <section class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <Headline size="lg">Rechnungen &amp; Gutschriften</Headline>
        <Text tone="muted">Fortlaufende Rechnungsnummern und Statusverwaltung.</Text>
      </div>
      <div class="flex gap-3">
        <Button variant="secondary">Rechnung erstellen</Button>
        <Button>Gutschrift erstellen</Button>
      </div>
    </div>

    <div class="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
      <Headline size="md">Neue Rechnung</Headline>
      <div class="grid gap-4 md:grid-cols-2">
        <InputField label="Kunde" placeholder="Kunden auswählen" />
        <InputField label="Rechnungsdatum" type="date" />
        <InputField label="Steuersatz" placeholder="19%" />
        <InputField label="Rechnungsnummer" placeholder="Automatisch fortlaufend" />
      </div>
      <div class="grid gap-4 md:grid-cols-2">
        <InputField label="Produkt / Service" placeholder="Produkt wählen oder Freitext" />
        <InputField label="Betrag" placeholder="€" />
      </div>
      <div class="flex gap-3">
        <Button>Als PDF + E-Rechnung senden</Button>
        <Button variant="secondary">Als bezahlt markieren</Button>
      </div>
    </div>

    <div class="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div class="flex items-center justify-between mb-4">
        <Headline size="md">Rechnungsübersicht</Headline>
        <Button variant="ghost">Filter Jahr/Monat</Button>
      </div>
      <DataTable
        :headers="['Nummer', 'Kunde', 'Datum', 'Status', 'Betrag', 'Aktion']"
        :rows="rows"
      />
      <Text tone="muted" class="mt-3">Statusdialog bei "Als bezahlt" via Modal vorgesehen.</Text>
    </div>
  </section>
</template>

<script setup lang="ts">
import Headline from '../components/Headline.vue';
import Text from '../components/Text.vue';
import Button from '../components/Button.vue';
import InputField from '../components/InputField.vue';
import DataTable from '../components/DataTable.vue';

const rows = [
  ['RE-2024-120', 'Muster GmbH', '12.09.2024', 'Offen', '€ 1.250', 'Als bezahlt'],
  ['GS-2024-013', 'Nordwind AG', '01.09.2024', 'Bezahlt', '-€ 250', '—']
];
</script>
