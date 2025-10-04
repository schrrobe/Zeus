import { randomUUID } from 'crypto';
import type { ZeusUser, SubscriptionTier } from '../types';

const users = new Map<string, ZeusUser>();

const defaultAdmin: ZeusUser = {
  id: randomUUID(),
  email: 'admin@zeus.app',
  fullName: 'Zeus Admin',
  password: '$2a$10$gQtJEZVrDCTnhgypKekJyOYZBUxpoE5UhOYAJWCkJSnUVx/FuWR6i', // bcrypt hash for "ChangeMe123!"
  role: 'admin',
  tier: 'premium',
  refreshIntervalSeconds: 5,
  exchangesConnected: 6
};

users.set(defaultAdmin.id, defaultAdmin);

function getRefreshInterval(tier: SubscriptionTier) {
  return tier === 'premium' ? 5 : 60;
}

export const userService = {
  async create(payload: { email: string; fullName: string; password: string }) {
    const id = randomUUID();
    const user: ZeusUser = {
      id,
      email: payload.email,
      fullName: payload.fullName,
      password: payload.password,
      role: 'user',
      tier: 'free',
      refreshIntervalSeconds: getRefreshInterval('free'),
      exchangesConnected: 0
    };
    users.set(id, user);
    return this.sanitize(user);
  },

  async findByEmail(email: string) {
    return Array.from(users.values()).find((user) => user.email === email) ?? null;
  },

  async findById(id: string) {
    const user = users.get(id);
    if (!user) throw new Error('User not found');
    return user;
  },

  async updateTier(id: string, tier: SubscriptionTier) {
    const user = await this.findById(id);
    user.tier = tier;
    user.refreshIntervalSeconds = getRefreshInterval(tier);
    users.set(id, user);
    return this.sanitize(user);
  },

  async delete(id: string) {
    users.delete(id);
  },

  async all() {
    return Array.from(users.values()).map((user) => this.sanitize(user));
  },

  sanitize(user: ZeusUser) {
    const { password, ...rest } = user;
    return rest;
  }
};
