<template>
  <section class="space-y-8">
    <div>
      <Headline size="lg">Organisationseinstellungen</Headline>
      <Text tone="muted">Nur Organisationsleiter können diese Einstellungen anpassen.</Text>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <div class="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
        <Headline size="md">Rechnungskopf &amp; Fußzeile</Headline>
        <InputField label="Kopfbereich" placeholder="Firmenname, Logo, Adresse" />
        <InputField label="Fußzeile" placeholder="Bankdaten, Steuer-ID" />
      </div>
      <div class="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
        <Headline size="md">Steuersätze</Headline>
        <InputField label="Neuer Steuersatz" placeholder="z.B. 19%" />
        <Button>Steuersatz hinzufügen</Button>
        <Text tone="muted">Aktuell: 7%, 19%</Text>
      </div>
    </div>

    <div class="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
      <Headline size="md">Designvariablen</Headline>
      <div class="grid gap-4 md:grid-cols-3">
        <InputField label="Abstand X" placeholder="2.5rem" />
        <InputField label="Abstand Y" placeholder="2rem" />
        <InputField label="Primärfarbe" placeholder="16 185 129" />
        <InputField label="Überschriftenschrift" placeholder="Inter" />
        <InputField label="Textschrift" placeholder="Inter" />
      </div>
      <Button>Design anwenden</Button>
      <Text tone="muted">Wenn leer, werden Standardwerte genutzt.</Text>
    </div>
  </section>
</template>

<script setup lang="ts">
import Headline from '../components/Headline.vue';
import Text from '../components/Text.vue';
import InputField from '../components/InputField.vue';
import Button from '../components/Button.vue';
</script>
