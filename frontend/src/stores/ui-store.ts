import { defineStore } from 'pinia';

type Theme = 'light' | 'dark';

interface UiState {
  theme: Theme;
}

const prefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;

export const useUiStore = defineStore('ui', {
  state: (): UiState => ({
    theme: prefersDark ? 'dark' : 'light'
  }),
  persist: true,
  actions: {
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
    }
  }
});
