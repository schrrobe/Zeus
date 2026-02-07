<template>
  <section class="space-y-6">
    <div>
      <Headline size="lg">Admin: Organisationen</Headline>
      <Text tone="muted">Registrierte Organisationen und Detaildaten einsehen.</Text>
    </div>

    <DataTable
      :headers="['Organisation', 'Leiter', 'Plan', 'Rechnungen', 'Aktion']"
      :rows="rows"
    />

    <div class="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <Headline size="md">Organisation Detailansicht</Headline>
      <Text tone="muted">Produkte, Rechnungen, Kunden und Zahlungsstatus anzeigen.</Text>
    </div>
  </section>
</template>

<script setup lang="ts">
import Headline from '../components/Headline.vue';
import Text from '../components/Text.vue';
import DataTable from '../components/DataTable.vue';

const rows = [
  ['Muster GmbH', 'Lisa Weber', 'Free', '8', 'Details'],
  ['Nordwind AG', 'Sven Koch', 'Paid', '32', 'Details']
];
</script>
