<template>
  <div class="mx-auto max-w-2xl space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow">
    <div>
      <Headline size="lg">Organisation registrieren</Headline>
      <Text tone="muted">
        Lege eine neue Organisation an und erstelle direkt den ersten Organisationsleiter.
      </Text>
    </div>

    <form class="space-y-6" @submit.prevent="handleSubmit">
      <div class="grid gap-4 md:grid-cols-2">
        <InputField
          v-model="form.organizationName"
          label="Organisationsname"
          placeholder="Beispiel GmbH"
        />
        <InputField v-model="form.industry" label="Branche" placeholder="IT, Beratung, Handel" />
      </div>

      <div class="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
        <Headline size="md">Organisationsleiter</Headline>
        <div class="mt-4 grid gap-4 md:grid-cols-2">
          <InputField v-model="form.leaderName" label="Name" placeholder="Max Mustermann" />
          <InputField
            v-model="form.leaderEmail"
            label="E-Mail"
            type="email"
            placeholder="leiter@firma.de"
          />
          <InputField
            v-model="form.leaderPassword"
            label="Passwort"
            type="password"
            placeholder="••••••••"
          />
          <InputField
            v-model="form.leaderPhone"
            label="Telefon"
            placeholder="+49 30 123456"
          />
        </div>
      </div>

      <div class="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
        <Headline size="md">Erste Nutzer anlegen</Headline>
        <Text tone="muted" class="mb-4">
          Optional kannst du direkt weitere Nutzer für deine Organisation anlegen.
        </Text>
        <div class="grid gap-4 md:grid-cols-3">
          <InputField v-model="form.inviteName" label="Name" placeholder="Anna Stein" />
          <InputField
            v-model="form.inviteEmail"
            label="E-Mail"
            type="email"
            placeholder="anna@firma.de"
          />
          <InputField v-model="form.inviteRole" label="Rolle" placeholder="Mitarbeiter" />
        </div>
        <Button variant="ghost" class="mt-4">Weiteren Nutzer hinzufügen</Button>
      </div>

      <p v-if="statusMessage" :class="statusClasses">
        {{ statusMessage }}
      </p>

      <div class="flex flex-wrap gap-3">
        <Button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Registriere...' : 'Organisation registrieren' }}
        </Button>
        <RouterLink class="text-sm text-brand-500" to="/">Zurück zum Login</RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { RouterLink } from 'vue-router';
import Headline from '../components/Headline.vue';
import Text from '../components/Text.vue';
import InputField from '../components/InputField.vue';
import Button from '../components/Button.vue';

type RegisterStatus = 'idle' | 'success' | 'error';

const form = reactive({
  organizationName: '',
  industry: '',
  leaderName: '',
  leaderEmail: '',
  leaderPassword: '',
  leaderPhone: '',
  inviteName: '',
  inviteEmail: '',
  inviteRole: ''
});

const statusMessage = ref('');
const status = ref<RegisterStatus>('idle');
const isSubmitting = ref(false);

const statusClasses = computed(() => {
  if (status.value === 'success') {
    return 'rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200';
  }
  if (status.value === 'error') {
    return 'rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200';
  }
  return '';
});

const handleSubmit = async () => {
  statusMessage.value = '';
  status.value = 'idle';

  if (!form.organizationName || !form.leaderName || !form.leaderEmail) {
    status.value = 'error';
    statusMessage.value = 'Bitte fülle Organisationsname, Name und E-Mail aus.';
    return;
  }

  isSubmitting.value = true;
  try {
    const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/organizations/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        organizationName: form.organizationName,
        industry: form.industry,
        leaderName: form.leaderName,
        leaderEmail: form.leaderEmail,
        leaderPassword: form.leaderPassword,
        leaderPhone: form.leaderPhone
      })
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { message?: string } | null;
      throw new Error(payload?.message ?? 'Registrierung fehlgeschlagen.');
    }

    status.value = 'success';
    statusMessage.value = 'Organisation erfolgreich registriert.';
    form.organizationName = '';
    form.industry = '';
    form.leaderName = '';
    form.leaderEmail = '';
    form.leaderPassword = '';
    form.leaderPhone = '';
  } catch (error) {
    console.error(error);
    status.value = 'error';
    statusMessage.value =
      error instanceof Error ? error.message : 'Registrierung fehlgeschlagen.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>
