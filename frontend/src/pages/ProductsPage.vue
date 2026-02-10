<template>
  <section class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <Headline size="lg">Produkte &amp; Dienstleistungen</Headline>
        <Text tone="muted">Produkte für die Rechnungserstellung pflegen.</Text>
      </div>
      <Button>Neues Produkt</Button>
    </div>

    <div class="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
      <Headline size="md">Produkt anlegen</Headline>
      <form class="space-y-4" @submit.prevent="createProduct">
        <div class="grid gap-4 md:grid-cols-2">
          <InputField v-model="form.name" label="Name" placeholder="Dienstleistung" />
          <InputField v-model="form.price" label="Preis" placeholder="180,00" />
          <InputField v-model="form.unit" label="Einheit" placeholder="Stück, Stunde" />
          <InputField v-model="form.taxRate" label="Steuersatz" placeholder="19" />
        </div>
        <Text v-if="formError" tone="muted">{{ formError }}</Text>
        <Button type="submit" :disabled="isCreating">{{ isCreating ? 'Speichern...' : 'Speichern' }}</Button>
      </form>
    </div>

    <div class="space-y-3">
      <Text v-if="isLoading" tone="muted">Produkte werden geladen...</Text>
      <Text v-else-if="errorMessage" tone="muted">{{ errorMessage }}</Text>
      <DataTable
        :headers="['Name', 'Preis', 'Einheit', 'Steuersatz']"
        :rows="rows"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import Headline from '../components/Headline.vue';
import Text from '../components/Text.vue';
import Button from '../components/Button.vue';
import InputField from '../components/InputField.vue';
import DataTable from '../components/DataTable.vue';
import { api } from '../lib/api';

type TaxRate = {
  id: string;
  percentage: number;
};

type Product = {
  id: string;
  name: string;
  priceCents: number;
  unit: string;
  taxRate: TaxRate | null;
};

type ItemsResponse = {
  items: Product[];
};

type TaxesResponse = {
  taxes: TaxRate[];
};

const products = ref<Product[]>([]);
const taxRates = ref<TaxRate[]>([]);
const isLoading = ref(false);
const isCreating = ref(false);
const errorMessage = ref('');
const formError = ref('');

const form = ref({
  name: '',
  price: '',
  unit: '',
  taxRate: ''
});

const rows = computed(() =>
  products.value.map((product) => [
    product.name,
    new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(product.priceCents / 100),
    product.unit,
    product.taxRate ? `${product.taxRate.percentage}%` : '—'
  ])
);

const parsePriceToCents = (value: string) => {
  const normalized = value.replace(',', '.').trim();
  const numeric = Number.parseFloat(normalized);
  if (!Number.isFinite(numeric) || numeric < 0) {
    return null;
  }
  return Math.round(numeric * 100);
};

const resolveTaxRateId = (percentageInput: string) => {
  const trimmed = percentageInput.trim();
  if (!trimmed) {
    return undefined;
  }

  const percentage = Number.parseInt(trimmed, 10);
  if (!Number.isFinite(percentage)) {
    return null;
  }

  const matchingTaxRate = taxRates.value.find((tax) => tax.percentage === percentage);
  return matchingTaxRate?.id ?? null;
};

const loadProducts = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const [itemsResponse, taxesResponse] = await Promise.all([
      api.get<ItemsResponse>('/api/items'),
      api.get<TaxesResponse>('/api/taxes')
    ]);
    products.value = itemsResponse.data.items;
    taxRates.value = taxesResponse.data.taxes;
  } catch (error) {
    console.error(error);
    errorMessage.value = 'Produkte konnten nicht geladen werden.';
  } finally {
    isLoading.value = false;
  }
};

const createProduct = async () => {
  formError.value = '';

  const priceCents = parsePriceToCents(form.value.price);
  if (!form.value.name.trim() || !form.value.unit.trim() || priceCents === null) {
    formError.value = 'Bitte Name, Preis und Einheit korrekt ausfüllen.';
    return;
  }

  const taxRateId = resolveTaxRateId(form.value.taxRate);
  if (form.value.taxRate.trim() && taxRateId === null) {
    formError.value = 'Steuersatz nicht gefunden. Bitte einen vorhandenen Satz eingeben.';
    return;
  }

  isCreating.value = true;
  try {
    await api.post('/api/items', {
      name: form.value.name.trim(),
      priceCents,
      unit: form.value.unit.trim(),
      taxRateId
    });

    form.value = {
      name: '',
      price: '',
      unit: '',
      taxRate: ''
    };

    await loadProducts();
  } catch (error) {
    console.error(error);
    formError.value = 'Produkt konnte nicht angelegt werden.';
  } finally {
    isCreating.value = false;
  }
};

onMounted(loadProducts);
</script>
