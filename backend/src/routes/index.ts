import type { FastifyInstance } from 'fastify';
import { portfolioRoutes } from './portfolio';
import { adminRoutes } from './admin';

export function registerRoutes(app: FastifyInstance) {
  app.get('/health', async () => ({ status: 'ok' }));
  app.register(portfolioRoutes, { prefix: '/api' });
  app.register(adminRoutes, { prefix: '/api/admin' });
}
