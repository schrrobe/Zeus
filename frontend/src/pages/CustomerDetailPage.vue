<template>
  <section class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <Headline size="lg">Kunde: {{ customer?.name ?? 'Lädt...' }}</Headline>
        <Text tone="muted">Adresse, Ansprechpartner und Notizen verwalten.</Text>
        <Text v-if="isLoading" tone="muted">Kundendaten werden geladen…</Text>
      </div>
      <Button variant="secondary">Speichern</Button>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <div class="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
        <Headline size="md">Kerndaten</Headline>
        <InputField
          v-model="customerForm.address"
          label="Adresse"
          :placeholder="customer?.address ?? 'Keine Adresse hinterlegt'"
        />
        <InputField
          v-model="customerForm.contactPerson"
          label="Ansprechpartner"
          :placeholder="customer?.contactPerson ?? 'Kein Ansprechpartner hinterlegt'"
        />
        <InputField
          v-model="customerForm.phone"
          label="Telefon"
          :placeholder="customer?.phone ?? 'Keine Telefonnummer hinterlegt'"
        />
      </div>
      <div class="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
        <Headline size="md">Notizen</Headline>
        <Text tone="muted">
          Letzter Eintrag von: {{ latestNote?.author.displayName ?? '—' }}
        </Text>
        <textarea
          class="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
          rows="6"
          :placeholder="latestNote?.content ?? 'Notiz über den Kunden'"
        >{{ latestNote?.content ?? '' }}</textarea>
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
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import Headline from '../components/Headline.vue';
import Text from '../components/Text.vue';
import Button from '../components/Button.vue';
import InputField from '../components/InputField.vue';
import DataTable from '../components/DataTable.vue';

type CustomerNote = {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    displayName: string;
  };
};

type CustomerInvoice = {
  id: string;
  number: number;
  numberText?: string | null;
  type: 'INVOICE' | 'CREDIT_NOTE';
  status: 'OPEN' | 'PAID' | 'VOID';
  issuedAt: string;
  totalCents: number;
};

type CustomerDetail = {
  id: string;
  name: string;
  address: string | null;
  contactPerson: string | null;
  phone: string | null;
  notes: CustomerNote[];
  invoices: CustomerInvoice[];
};

const route = useRoute();
const customer = ref<CustomerDetail | null>(null);
const customerForm = ref({
  address: '',
  contactPerson: '',
  phone: ''
});
const isLoading = ref(false);

const latestNote = computed(() => customer.value?.notes?.[0] ?? null);

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(value / 100);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('de-DE').format(new Date(value));

const formatStatus = (status: CustomerInvoice['status']) => {
  switch (status) {
    case 'PAID':
      return 'Bezahlt';
    case 'VOID':
      return 'Storniert';
    default:
      return 'Offen';
  }
};

const formatNumber = (invoice: CustomerInvoice) => {
  const prefix = invoice.type === 'CREDIT_NOTE' ? 'GS' : 'RE';
  return invoice.numberText ? `${prefix}-${invoice.numberText}` : `${prefix}-${invoice.number}`;
};

const invoiceRows = computed(() =>
  customer.value
    ? customer.value.invoices.map((invoice) => [
        formatNumber(invoice),
        formatDate(invoice.issuedAt),
        formatStatus(invoice.status),
        formatCurrency(invoice.totalCents)
      ])
    : []
);

const loadCustomer = async () => {
  const id = route.params.id;
  if (typeof id !== 'string') {
    return;
  }
  isLoading.value = true;
  try {
    const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/customers/${id}`);
    if (!response.ok) {
      throw new Error('Customer load failed');
    }
    const data: CustomerDetail = await response.json();
    customer.value = data;
    customerForm.value = {
      address: data.address ?? '',
      contactPerson: data.contactPerson ?? '',
      phone: data.phone ?? ''
    };
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadCustomer);
</script>
