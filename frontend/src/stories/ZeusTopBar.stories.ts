import type { Meta, StoryObj } from '@storybook/vue3';
import ZeusTopBar from '../components/navigation/ZeusTopBar.vue';

const meta: Meta<typeof ZeusTopBar> = {
  title: 'Zeus/Navigation/TopBar',
  component: ZeusTopBar,
  args: {
    user: {
      id: '123',
      email: 'zeus@olymp.zeus',
      fullName: 'Zeus Olymp',
      role: 'admin',
      tier: 'premium',
      refreshIntervalSeconds: 5,
      exchangesConnected: 5
    },
    isPremium: true,
    adminNotices: [
      {
        id: '1',
        title: 'Maintenance',
        message: 'Heute 18 Uhr: Kurze Wartung',
        type: 'banner',
        isActive: true
      }
    ]
  }
};

export default meta;

export const Default: StoryObj<typeof ZeusTopBar> = {
  render: (args) => ({
    components: { ZeusTopBar },
    setup() {
      return { args };
    },
    template: '<ZeusTopBar v-bind="args" />'
  })
};
