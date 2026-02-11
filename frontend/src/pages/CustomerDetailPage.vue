<template>
  <section class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <Headline size="lg">{{ pageTitle }}</Headline>
        <Text tone="muted">Stammdaten des Kunden erfassen und pflegen.</Text>
        <Text v-if="isLoading" tone="muted">Kundendaten werden geladen…</Text>
      </div>
      <Button :disabled="isSaving" @click="saveCustomer">
        {{ isSaving ? 'Speichert…' : 'Speichern' }}
      </Button>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <div class="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
        <Headline size="md">Kerndaten</Headline>
        <InputField v-model="customerForm.name" label="Name" placeholder="Firmenname" />
        <InputField v-model="customerForm.email" label="E-Mail" placeholder="kontakt@firma.de" />
        <InputField v-model="customerForm.address" label="Adresse" placeholder="Straße, PLZ Ort" />
        <InputField v-model="customerForm.contactPerson" label="Ansprechpartner" placeholder="Max Mustermann" />
        <InputField v-model="customerForm.phone" label="Telefon" placeholder="+49 ..." />
      </div>
      <div class="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
        <Headline size="md">Notizen</Headline>
        <Text tone="muted">
          Letzter Eintrag von: {{ latestNote?.author.displayName ?? '—' }}
        </Text>
        <textarea
          class="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
          rows="8"
          :value="latestNote?.content ?? 'Keine Notizen vorhanden.'"
          readonly
        />
      </div>
    </div>

    <Text v-if="successMessage" tone="muted">{{ successMessage }}</Text>
    <Text v-if="errorMessage" tone="muted">{{ errorMessage }}</Text>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Headline from '../components/Headline.vue';
import Text from '../components/Text.vue';
import Button from '../components/Button.vue';
import InputField from '../components/InputField.vue';
import {
  createCustomer,
  getCustomer,
  updateCustomer,
  type CustomerDetail,
  type CustomerPayload
} from '../lib/customers';

const route = useRoute();
const router = useRouter();
const customer = ref<CustomerDetail | null>(null);
const isLoading = ref(false);
const isSaving = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const customerForm = ref({
  name: '',
  email: '',
  address: '',
  contactPerson: '',
  phone: ''
});

const customerId = computed(() => {
  const id = route.params.id;
  return typeof id === 'string' ? id : null;
});

const isCreateMode = computed(() => !customerId.value);

const pageTitle = computed(() =>
  isCreateMode.value ? 'Neuen Kunden erstellen' : `Kunde: ${customer.value?.name ?? 'Lädt...'}`
);

const latestNote = computed(() => customer.value?.notes?.[0] ?? null);

const toPayload = (): CustomerPayload => ({
  name: customerForm.value.name.trim(),
  email: customerForm.value.email.trim() || undefined,
  address: customerForm.value.address.trim() || undefined,
  contactPerson: customerForm.value.contactPerson.trim() || undefined,
  phone: customerForm.value.phone.trim() || undefined
});

const hydrateForm = (value: CustomerDetail | null) => {
  customerForm.value = {
    name: value?.name ?? '',
    email: value?.email ?? '',
    address: value?.address ?? '',
    contactPerson: value?.contactPerson ?? '',
    phone: value?.phone ?? ''
  };
};

const loadCustomer = async () => {
  if (isCreateMode.value) {
    customer.value = null;
    hydrateForm(null);
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';
  try {
    customer.value = await getCustomer(customerId.value!);
    hydrateForm(customer.value);
  } catch (error) {
    console.error(error);
    errorMessage.value = 'Kundendaten konnten nicht geladen werden.';
  } finally {
    isLoading.value = false;
  }
};

const saveCustomer = async () => {
  successMessage.value = '';
  errorMessage.value = '';

  if (!customerForm.value.name.trim()) {
    errorMessage.value = 'Bitte einen Kundennamen eingeben.';
    return;
  }

  isSaving.value = true;
  try {
    if (isCreateMode.value) {
      const created = await createCustomer(toPayload());
      successMessage.value = 'Kunde wurde erstellt.';
      router.push({ name: 'customer-detail', params: { id: created.id } });
      return;
    }

    await updateCustomer(customerId.value!, toPayload());
    await loadCustomer();
    successMessage.value = 'Kunde wurde aktualisiert.';
  } catch (error) {
    console.error(error);
    errorMessage.value = isCreateMode.value
      ? 'Kunde konnte nicht erstellt werden.'
      : 'Kunde konnte nicht aktualisiert werden.';
  } finally {
    isSaving.value = false;
  }
};

watch(() => route.fullPath, loadCustomer);
onMounted(loadCustomer);
</script>
