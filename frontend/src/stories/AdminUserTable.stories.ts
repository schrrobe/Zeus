import type { Meta, StoryObj } from '@storybook/vue3';
import AdminUserTable from '../components/admin/AdminUserTable.vue';

const meta: Meta<typeof AdminUserTable> = {
  title: 'Zeus/AdminUserTable',
  component: AdminUserTable,
  args: {
    users: [
      {
        id: '1',
        email: 'hera@olymp.zeus',
        fullName: 'Hera Zeus',
        role: 'admin',
        tier: 'premium',
        refreshIntervalSeconds: 5,
        exchangesConnected: 6
      },
      {
        id: '2',
        email: 'apollo@olymp.zeus',
        fullName: 'Apollo Helios',
        role: 'user',
        tier: 'free',
        refreshIntervalSeconds: 60,
        exchangesConnected: 2
      }
    ]
  }
};

export default meta;

export const Default: StoryObj<typeof AdminUserTable> = {
  render: (args) => ({
    components: { AdminUserTable },
    setup() {
      return { args };
    },
    template: '<AdminUserTable v-bind="args" @toggle-premium="() => {}" @delete-user="() => {}" />'
  })
};
