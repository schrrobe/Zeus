export const featureKeys = [
  'dashboard',
  'customers',
  'customer-detail',
  'invoices',
  'products',
  'settings',
  'users',
  'admin'
] as const;

export type FeatureKey = (typeof featureKeys)[number];
export type PermissionLevel = 'NONE' | 'READ' | 'WRITE';

export const defaultPermissions: Record<FeatureKey, PermissionLevel> = {
  dashboard: 'READ',
  customers: 'READ',
  'customer-detail': 'READ',
  invoices: 'READ',
  products: 'READ',
  settings: 'NONE',
  users: 'NONE',
  admin: 'NONE'
};

export const leaderPermissions: Record<FeatureKey, PermissionLevel> = {
  dashboard: 'WRITE',
  customers: 'WRITE',
  'customer-detail': 'WRITE',
  invoices: 'WRITE',
  products: 'WRITE',
  settings: 'WRITE',
  users: 'WRITE',
  admin: 'NONE'
};
