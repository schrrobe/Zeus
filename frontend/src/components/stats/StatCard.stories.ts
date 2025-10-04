import type { Meta, StoryObj } from '@storybook/vue3';
import StatCard from './StatCard.vue';

const meta: Meta<typeof StatCard> = {
  title: 'Stats/StatCard',
  component: StatCard,
  args: {
    label: 'Portfolio Wert',
    value: '€ 42.000',
    sublabel: '+12% gegenüber Vormonat'
  }
};

export default meta;

type Story = StoryObj<typeof StatCard>;

export const Default: Story = {};
