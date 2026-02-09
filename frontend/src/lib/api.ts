import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const api = axios.create({
  baseURL,
  responseType: 'json',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});
