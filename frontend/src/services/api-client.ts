import type { AdminBanner, AdminDashboardSummary, PortfolioSnapshot, UserProfile } from '../types/portfolio';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    ...options
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'API request failed');
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  getPortfolio(): Promise<PortfolioSnapshot> {
    return request('/portfolio');
  },
  getUserProfile(): Promise<UserProfile> {
    return request('/me');
  },
  getAdminSummary(): Promise<AdminDashboardSummary> {
    return request('/admin/summary');
  },
  getAdminBanners(): Promise<AdminBanner[]> {
    return request('/admin/banners');
  },
  upsertBanner(payload: Partial<AdminBanner>): Promise<AdminBanner> {
    return request('/admin/banners', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  deleteUser(userId: string) {
    return request(`/admin/users/${userId}`, { method: 'DELETE' });
  },
  updateUserTier(userId: string, tier: 'free' | 'premium') {
    return request(`/admin/users/${userId}/tier`, {
      method: 'PATCH',
      body: JSON.stringify({ tier })
    });
  }
};
