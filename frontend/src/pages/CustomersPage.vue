<template>
  <section class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <Headline size="lg">Kundenübersicht</Headline>
        <Text tone="muted">Alle Kunden im Tabellenformat.</Text>
      </div>
      <Button>Neuer Kunde</Button>
    </div>

    <DataTable
      :headers="['Kunde', 'Kontakt', 'Status', 'Umsatz']"
      :rows="rows"
    />
  </section>
</template>

<script setup lang="ts">
import Headline from '../components/Headline.vue';
import Text from '../components/Text.vue';
import Button from '../components/Button.vue';
import DataTable from '../components/DataTable.vue';

const rows = [
  ['Muster GmbH', 'muster@firma.de', 'Aktiv', '€ 12.400'],
  ['Nordwind AG', 'account@nordwind.de', 'Aktiv', '€ 7.800'],
  ['Kunde 3', 'kontakt@kunde3.de', 'Inaktiv', '€ 0']
];
</script>
