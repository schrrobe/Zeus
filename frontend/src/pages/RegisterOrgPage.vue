<template>
  <div class="mx-auto max-w-2xl space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow">
    <div>
      <Headline size="lg">Organisation registrieren</Headline>
      <Text tone="muted">
        Lege eine neue Organisation an und erstelle direkt den ersten Organisationsleiter.
      </Text>
    </div>

    <form class="space-y-6">
      <div class="grid gap-4 md:grid-cols-2">
        <InputField label="Organisationsname" placeholder="Beispiel GmbH" />
        <InputField label="Branche" placeholder="IT, Beratung, Handel" />
      </div>

      <div class="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
        <Headline size="md">Organisationsleiter</Headline>
        <div class="mt-4 grid gap-4 md:grid-cols-2">
          <InputField label="Name" placeholder="Max Mustermann" />
          <InputField label="E-Mail" type="email" placeholder="leiter@firma.de" />
          <InputField label="Passwort" type="password" placeholder="••••••••" />
          <InputField label="Telefon" placeholder="+49 30 123456" />
        </div>
      </div>

      <div class="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
        <Headline size="md">Erste Nutzer anlegen</Headline>
        <Text tone="muted" class="mb-4">
          Optional kannst du direkt weitere Nutzer für deine Organisation anlegen.
        </Text>
        <div class="grid gap-4 md:grid-cols-3">
          <InputField label="Name" placeholder="Anna Stein" />
          <InputField label="E-Mail" type="email" placeholder="anna@firma.de" />
          <InputField label="Rolle" placeholder="Mitarbeiter" />
        </div>
        <Button variant="ghost" class="mt-4">Weiteren Nutzer hinzufügen</Button>
      </div>

      <div class="flex flex-wrap gap-3">
        <Button type="submit">Organisation registrieren</Button>
        <RouterLink class="text-sm text-brand-500" to="/">Zurück zum Login</RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import Headline from '../components/Headline.vue';
import Text from '../components/Text.vue';
import InputField from '../components/InputField.vue';
import Button from '../components/Button.vue';
</script>
