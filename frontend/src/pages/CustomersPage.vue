<template>
  <section class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <Headline size="lg">Kundenübersicht</Headline>
        <Text tone="muted">Alle Kunden im Tabellenformat.</Text>
        <Text v-if="isLoading" tone="muted">Kunden werden geladen…</Text>
        <Text v-else-if="errorMessage" tone="muted">{{ errorMessage }}</Text>
      </div>
      <Button @click="goToCreate">Neuer Kunde</Button>
    </div>

    <DataTable
      :headers="['Kunde', 'Kontakt', 'Status', 'Umsatz']"
      :rows="rows"
      :clickable-rows="true"
      :page-size-options="[meta.perPage]"
      :initial-page-size="meta.perPage"
      @row-click="goToDetail"
    />

    <div class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-300">
      <span>Seite {{ meta.page }} von {{ meta.totalPages }} · Gesamt {{ meta.total }} Kunden</span>
      <div class="flex items-center gap-2">
        <Button variant="ghost" :disabled="meta.page <= 1 || isLoading" @click="changePage(meta.page - 1)">
          Zurück
        </Button>
        <Button
          variant="ghost"
          :disabled="meta.page >= meta.totalPages || isLoading"
          @click="changePage(meta.page + 1)"
        >
          Weiter
        </Button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Headline from '../components/Headline.vue';
import Text from '../components/Text.vue';
import Button from '../components/Button.vue';
import DataTable from '../components/DataTable.vue';
import { listCustomers, type Customer } from '../lib/customers';

const router = useRouter();
const customers = ref<Customer[]>([]);
const isLoading = ref(false);
const errorMessage = ref('');
const meta = ref({
  total: 0,
  page: 1,
  perPage: 10,
  totalPages: 1
});

const rows = computed(() =>
  customers.value.map((customer) => [
    customer.name,
    customer.email ?? customer.contactPerson ?? '—',
    'Aktiv',
    '—'
  ])
);

const loadCustomers = async (page = meta.value.page) => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const payload = await listCustomers(page, meta.value.perPage);
    customers.value = payload.customers;
    meta.value = payload.meta;
  } catch (error) {
    console.error(error);
    errorMessage.value = 'Kunden konnten nicht geladen werden.';
  } finally {
    isLoading.value = false;
  }
};

const goToDetail = ({ index }: { index: number }) => {
  const customer = customers.value[index];
  if (!customer) {
    return;
  }
  router.push({ name: 'customer-detail', params: { id: customer.id } });
};

const goToCreate = () => {
  router.push({ name: 'customer-create' });
};

const changePage = (page: number) => {
  if (page < 1 || page > meta.value.totalPages || page === meta.value.page) {
    return;
  }
  loadCustomers(page);
};

onMounted(() => loadCustomers(1));
</script>
