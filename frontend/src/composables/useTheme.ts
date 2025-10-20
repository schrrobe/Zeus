import { ref, watchEffect } from 'vue';

type ThemeMode = 'light' | 'dark';

const storedTheme = typeof window !== 'undefined' ? (localStorage.getItem('zeus-theme') as ThemeMode | null) : null;
const theme = ref<ThemeMode>(storedTheme ?? 'light');

watchEffect(() => {
  if (typeof window === 'undefined') return;
  const root = window.document.documentElement;
  if (theme.value === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  localStorage.setItem('zeus-theme', theme.value);
});

export function useTheme() {
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
  }

  return {
    theme,
    toggleTheme
  };
}
