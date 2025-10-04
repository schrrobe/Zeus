import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import {
  mockAdminSummary,
  mockBanner,
  mockBanners,
  toggleUserTier,
  deleteUser as deleteUserMock
} from '../services/mock-data';

const bannerSchema = z.object({
  title: z.string().min(1),
  message: z.string().min(1),
  type: z.enum(['info', 'warning', 'success']),
  visible: z.boolean().optional().default(true)
});

export async function adminRoutes(app: FastifyInstance) {
  app.get('/summary', async () => mockAdminSummary());

  app.get('/banners', async () => mockBanners());

  app.post('/banners', async (request, reply) => {
    const payload = bannerSchema.parse(request.body);
    const banner = mockBanner(payload);
    return reply.code(201).send(banner);
  });

  app.patch('/users/:userId/tier', async (request, reply) => {
    const params = z.object({ userId: z.string() }).parse(request.params);
    const body = z.object({ tier: z.enum(['free', 'premium']) }).parse(request.body);
    const result = toggleUserTier(params.userId, body.tier);
    return reply.send(result);
  });

  app.delete('/users/:userId', async (request, reply) => {
    const params = z.object({ userId: z.string() }).parse(request.params);
    deleteUserMock(params.userId);
    return reply.status(204).send();
  });
}
