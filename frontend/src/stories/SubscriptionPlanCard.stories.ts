import type { Meta, StoryObj } from '@storybook/vue3';
import SubscriptionPlanCard from '../components/subscription/SubscriptionPlanCard.vue';

const meta: Meta<typeof SubscriptionPlanCard> = {
  title: 'Zeus/SubscriptionPlanCard',
  component: SubscriptionPlanCard,
  args: {
    title: 'Premium',
    description: 'Echtzeit-Updates und unbegrenzte Verbindungen',
    price: '5 €',
    billingHint: 'monatlich',
    features: [
      'Unbegrenzte Börsen inklusive Binance',
      'Sekundengenaue Aktualisierung',
      'Premium Support'
    ],
    ctaLabel: 'Upgrade starten'
  }
};

export default meta;

export const Default: StoryObj<typeof SubscriptionPlanCard> = {
  render: (args) => ({
    components: { SubscriptionPlanCard },
    setup() {
      return { args };
    },
    template: '<SubscriptionPlanCard v-bind="args" />'
  })
};
