<template>
  <section class="mx-auto w-full max-w-5xl space-y-10 px-6 py-12">
    <div class="text-center">
      <h2 class="text-4xl font-semibold text-slate-900 dark:text-white">Premium wird göttlich</h2>
      <p class="mt-3 text-lg text-slate-500 dark:text-slate-400">Unlimitierte Börsen, Echtzeit-Updates und Prioritätssupport für nur 5 € monatlich oder 36 € jährlich.</p>
    </div>

    <div class="grid gap-8 md:grid-cols-2">
      <SubscriptionPlanCard
        title="Free"
        description="Ideal für einen schnellen Überblick"
        price="0 €"
        billingHint="für immer"
        :features="[
          '2 Börsen-Verbindungen',
          'Aktualisierung alle 60 Sekunden',
          'Wallet Tracking für BTC, ETH, SOL'
        ]"
        cta-label="Free nutzen"
        @select="selectFree"
      />
      <SubscriptionPlanCard
        title="Premium"
        description="Für Power-Trader:innen mit Echtzeitbedarf"
        price="5 €"
        billingHint="monatlich oder 36 € / Jahr"
        :features="[
          'Unbegrenzte Börsen inklusive Binance',
          'Schnellstmögliche Aktualisierung',
          'Prioritätssupport und Roadmap-Mitgestaltung'
        ]"
        cta-label="Premium abonnieren"
        @select="selectPremium"
      />
    </div>

    <div v-if="error" class="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-200">
      {{ error }}
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SubscriptionPlanCard from '../../components/subscription/SubscriptionPlanCard.vue';
import { useAuthStore } from '../../stores/auth';
import { getStripeClient } from '../../services/stripeClient';

const auth = useAuthStore();
const error = ref('');

async function selectFree() {
  try {
    await auth.updateSubscription('free');
  } catch (err) {
    error.value = (err as Error).message;
  }
}

async function selectPremium() {
  try {
    const stripe = await getStripeClient(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
    if (!stripe) throw new Error('Stripe konnte nicht geladen werden.');
    const response = await fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api'}/billing/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier: 'premium' })
    });
    const { sessionId } = await response.json();
    await stripe.redirectToCheckout({ sessionId });
  } catch (err) {
    error.value = (err as Error).message;
  }
}
</script>
