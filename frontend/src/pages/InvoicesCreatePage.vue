<template>
  <section class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <Headline size="lg">{{ pageTitle }}</Headline>
        <Text tone="muted">Neue {{ itemLabel }} erstellen und später versenden.</Text>
      </div>
      <Button variant="ghost" @click="goBack">Zur Übersicht</Button>
    </div>

    <div class="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
      <Headline size="md">{{ formTitle }}</Headline>
      <div class="grid gap-4 md:grid-cols-2">
        <InputField label="Kunde" placeholder="Kunden auswählen" />
        <InputField label="Rechnungsdatum" type="date" />
        <InputField label="Steuersatz" placeholder="19%" />
        <InputField label="Rechnungsnummer" placeholder="Automatisch fortlaufend" />
      </div>
      <div class="grid gap-4 md:grid-cols-2">
        <InputField
          :label="productLabel"
          placeholder="Produkt wählen oder Freitext"
        />
        <InputField label="Betrag" placeholder="€" />
      </div>
      <div class="flex gap-3">
        <Button>{{ primaryAction }}</Button>
        <Button variant="secondary">Als bezahlt markieren</Button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Headline from '../components/Headline.vue';
import Text from '../components/Text.vue';
import Button from '../components/Button.vue';
import InputField from '../components/InputField.vue';

const route = useRoute();
const router = useRouter();

const isCreditNote = computed(() => route.query.type === 'credit');

const pageTitle = computed(() =>
  isCreditNote.value ? 'Gutschrift erstellen' : 'Rechnung erstellen'
);
const itemLabel = computed(() => (isCreditNote.value ? 'Gutschrift' : 'Rechnung'));
const formTitle = computed(() =>
  isCreditNote.value ? 'Neue Gutschrift' : 'Neue Rechnung'
);
const productLabel = computed(() =>
  isCreditNote.value ? 'Produkt / Service (Gutschrift)' : 'Produkt / Service'
);
const primaryAction = computed(() =>
  isCreditNote.value ? 'Gutschrift als PDF senden' : 'Als PDF + E-Rechnung senden'
);

const goBack = () => {
  router.push({ name: 'invoices' });
};
</script>
