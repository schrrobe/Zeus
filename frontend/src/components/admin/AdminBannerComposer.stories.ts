import type { Meta, StoryObj } from '@storybook/vue3';
import AdminBannerComposer from './AdminBannerComposer.vue';

const meta: Meta<typeof AdminBannerComposer> = {
  title: 'Admin/BannerComposer',
  component: AdminBannerComposer
};

export default meta;

type Story = StoryObj<typeof AdminBannerComposer>;

export const Default: Story = {
  args: {
    onSubmit: (payload) => console.log(payload)
  }
};
