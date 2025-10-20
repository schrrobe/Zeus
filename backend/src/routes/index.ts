import type { Express } from 'express';
import authRoutes from './auth';
import portfolioRoutes from './portfolio';
import adminRoutes from './admin';
import billingRoutes from './billing';
import integrationsRoutes from './integrations';

export function registerRoutes(app: Express) {
  app.use('/api/auth', authRoutes);
  app.use('/api/portfolio', portfolioRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/billing', billingRoutes);
  app.use('/api/integrations', integrationsRoutes);
}
