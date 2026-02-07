<template>
  <div class="mx-auto max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow">
    <Headline size="lg" class="mb-2">Willkommen zurück</Headline>
    <Text tone="muted" class="mb-6">Bitte melde dich an, um Rechnungen zu verwalten.</Text>
    <form class="space-y-4">
      <InputField label="E-Mail" type="email" placeholder="you@firma.de" />
      <InputField label="Passwort" type="password" placeholder="••••••••" />
      <Button type="submit" variant="primary" class="w-full">Anmelden</Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import Headline from '../components/Headline.vue';
import Text from '../components/Text.vue';
import InputField from '../components/InputField.vue';
import Button from '../components/Button.vue';
</script>
