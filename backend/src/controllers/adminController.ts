import type { Request, Response } from 'express';
import { z } from 'zod';
import { userService } from '../services/userService';
import { noticeService } from '../services/noticeService';
import { billingService } from '../services/billingService';

const subscriptionSchema = z.object({
  tier: z.enum(['free', 'premium'])
});

const noticeSchema = z.object({
  title: z.string().min(3),
  message: z.string().min(5),
  type: z.enum(['banner', 'modal']),
  isActive: z.boolean()
});

export class AdminController {
  async listUsers(_req: Request, res: Response) {
    const users = await userService.all();
    res.json(users);
  }

  async updateSubscription(req: Request, res: Response) {
    const payload = subscriptionSchema.parse(req.body);
    const updated = await userService.updateTier(req.params.id, payload.tier);
    res.json({ user: updated });
  }

  async deleteUser(req: Request, res: Response) {
    await userService.delete(req.params.id);
    res.status(204).send();
  }

  async summary(_req: Request, res: Response) {
    const summary = await billingService.summary();
    res.json(summary);
  }

  async createNotice(req: Request, res: Response) {
    const payload = noticeSchema.parse(req.body);
    const notice = await noticeService.create(payload);
    res.status(201).json(notice);
  }

  async listNotices(_req: Request, res: Response) {
    const notices = await noticeService.list();
    res.json(notices);
  }
}
