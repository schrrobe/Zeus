import type { FastifyInstance } from 'fastify';
import { mockPortfolioSnapshot, mockUserProfile } from '../services/mock-data';

export async function portfolioRoutes(app: FastifyInstance) {
  app.get('/portfolio', async () => mockPortfolioSnapshot());
  app.get('/me', async () => mockUserProfile());
}
