import { defineStore } from 'pinia';

export type ThemeConfig = {
  mode: 'light' | 'dark';
  spacingX: string;
  spacingY: string;
  fontHeading: string;
  fontBody: string;
  brand50: string;
  brand100: string;
  brand500: string;
  brand700: string;
};

const defaultTheme: ThemeConfig = {
  mode: 'dark',
  spacingX: '2.5rem',
  spacingY: '2rem',
  fontHeading: 'Inter',
  fontBody: 'Inter',
  brand50: '236 253 245',
  brand100: '209 250 229',
  brand500: '16 185 129',
  brand700: '4 120 87'
};

export const useThemeStore = defineStore('theme', {
  state: () => ({
    config: { ...defaultTheme }
  }),
  actions: {
    applyTheme(config?: Partial<ThemeConfig>) {
      this.config = { ...defaultTheme, ...config };
      const root = document.documentElement;
      root.dataset.theme = this.config.mode;
      root.style.setProperty('--spacing-page-x', this.config.spacingX);
      root.style.setProperty('--spacing-page-y', this.config.spacingY);
      root.style.setProperty('--font-heading', this.config.fontHeading);
      root.style.setProperty('--font-body', this.config.fontBody);
      root.style.setProperty('--color-brand-50', this.config.brand50);
      root.style.setProperty('--color-brand-100', this.config.brand100);
      root.style.setProperty('--color-brand-500', this.config.brand500);
      root.style.setProperty('--color-brand-700', this.config.brand700);
    }
  }
});
