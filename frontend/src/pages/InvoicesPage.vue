<template>
  <section class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <Headline size="lg">Rechnungen &amp; Gutschriften</Headline>
        <Text tone="muted">Übersicht aller Rechnungen und Gutschriften.</Text>
      </div>
      <div class="flex gap-3">
        <Button variant="secondary" @click="goToCreate('invoice')">Rechnung erstellen</Button>
        <Button @click="goToCreate('credit')">Gutschrift erstellen</Button>
      </div>
    </div>

    <div class="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div class="flex items-center justify-between mb-4">
        <Headline size="md">Rechnungsübersicht</Headline>
        <div class="flex flex-wrap items-center gap-3 text-sm text-slate-200">
          <label class="flex items-center gap-2">
            <span class="text-slate-400">Jahr</span>
            <select
              v-model.number="selectedYear"
              class="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-slate-200"
            >
              <option :value="0">Alle</option>
              <option v-for="year in yearOptions" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </label>
          <label class="flex items-center gap-2">
            <span class="text-slate-400">Monat</span>
            <select
              v-model.number="selectedMonth"
              :disabled="selectedYear === 0"
              class="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option :value="0">Alle</option>
              <option v-for="month in monthOptions" :key="month.value" :value="month.value">
                {{ month.label }}
              </option>
            </select>
          </label>
          <Button variant="ghost" @click="applyFilter">Filtern</Button>
        </div>
      </div>
      <Text v-if="isLoading" tone="muted" class="mb-4">Rechnungen werden geladen...</Text>
      <Text v-else-if="errorMessage" tone="muted" class="mb-4">{{ errorMessage }}</Text>
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
import DataTable from '../components/DataTable.vue';
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

type InvoiceApiResponse = {
  data: InvoiceItem[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
};

type InvoiceItem = {
  id: string;
  number: number;
  numberText?: string | null;
  type: 'INVOICE' | 'CREDIT_NOTE';
  status: 'OPEN' | 'PAID' | 'VOID';
  issuedAt: string;
  totalCents: number;
  customer: {
    name: string;
  };
};

const router = useRouter();
const rows = ref<string[][]>([]);
const isLoading = ref(false);
const errorMessage = ref('');
const selectedYear = ref(0);
const selectedMonth = ref(0);

const yearOptions = computed(() => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, index) => currentYear - index);
});

const monthOptions = [
  { value: 1, label: 'Januar' },
  { value: 2, label: 'Februar' },
  { value: 3, label: 'März' },
  { value: 4, label: 'April' },
  { value: 5, label: 'Mai' },
  { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' },
  { value: 11, label: 'November' },
  { value: 12, label: 'Dezember' }
];

const goToCreate = (type: 'invoice' | 'credit') => {
  router.push({ name: 'invoice-create', query: { type } });
};

const formatCurrency = (amountCents: number, isCredit: boolean) => {
  const value = isCredit ? -amountCents : amountCents;
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(value / 100);
};

const formatStatus = (status: InvoiceItem['status']) => {
  switch (status) {
    case 'PAID':
      return 'Bezahlt';
    case 'VOID':
      return 'Storniert';
    default:
      return 'Offen';
  }
};

const formatNumber = (invoice: InvoiceItem) => {
  const prefix = invoice.type === 'CREDIT_NOTE' ? 'GS' : 'RE';
  if (invoice.numberText) {
    return `${prefix}-${invoice.numberText}`;
  }
  const issuedYear = new Date(invoice.issuedAt).getFullYear();
  return `${prefix}-${issuedYear}-${invoice.number}`;
};

const loadInvoices = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
    const params = new URLSearchParams();
    params.set('page', '1');
    params.set('perPage', '50');
    if (selectedYear.value) {
      params.set('year', String(selectedYear.value));
    }
    if (selectedMonth.value) {
      params.set('month', String(selectedMonth.value));
    }
    const response = await fetch(`${baseUrl}/api/invoices?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Invoice load failed');
    }
    const payload = (await response.json()) as InvoiceApiResponse;
    rows.value = payload.data.map((invoice) => [
      formatNumber(invoice),
      invoice.customer.name,
      new Intl.DateTimeFormat('de-DE').format(new Date(invoice.issuedAt)),
      formatStatus(invoice.status),
      formatCurrency(invoice.totalCents, invoice.type === 'CREDIT_NOTE'),
      invoice.status === 'OPEN' ? 'Als bezahlt' : '—'
    ]);
  } catch (error) {
    console.error(error);
    errorMessage.value = 'Rechnungen konnten nicht geladen werden.';
  } finally {
    isLoading.value = false;
  }
};

const applyFilter = () => {
  loadInvoices();
};

watch(selectedYear, (value) => {
  if (value === 0 && selectedMonth.value !== 0) {
    selectedMonth.value = 0;
  }
});

onMounted(loadInvoices);
</script>
