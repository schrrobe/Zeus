import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api',
  timeout: 15000
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const persisted = window.localStorage.getItem('zeus-auth');
    if (persisted) {
      try {
        const state = JSON.parse(persisted) as { token?: string | null };
        if (state.token) {
          config.headers = config.headers ?? {};
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (error) {
        console.warn('Persisted auth konnte nicht gelesen werden', error);
      }
    }
  }
  return config;
});

export { apiClient };
