import type { Request, Response } from 'express';
import { z } from 'zod';
import Stripe from 'stripe';
import { userService } from '../services/userService';
import { billingService } from '../services/billingService';

const subscriptionSchema = z.object({
  tier: z.enum(['free', 'premium'])
});

export class BillingController {
  async updateSubscription(req: Request, res: Response) {
    const payload = subscriptionSchema.parse(req.body);
    const user = await userService.updateTier(req.user!.id, payload.tier);
    if (payload.tier === 'premium') {
      await billingService.recordSubscription(req.user!.id, 'monthly');
    }
    res.json({ user });
  }

  async createCheckoutSession(req: Request, res: Response) {
    const payload = subscriptionSchema.parse(req.body);
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) {
      return res.status(500).json({ message: 'Stripe nicht konfiguriert' });
    }
    const stripe = new Stripe(stripeSecret, { apiVersion: '2023-10-16' });
    const priceId = payload.tier === 'premium' ? process.env.STRIPE_PREMIUM_PRICE_ID : process.env.STRIPE_FREE_PRICE_ID;
    if (!priceId) {
      return res.status(500).json({ message: 'Preis nicht konfiguriert' });
    }
    const currentUser = await userService.findById(req.user!.id);
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: currentUser.email,
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: `${process.env.WEBAPP_URL ?? 'http://localhost:5173'}/subscription?status=success`,
      cancel_url: `${process.env.WEBAPP_URL ?? 'http://localhost:5173'}/subscription?status=cancel`
    });
    res.status(201).json({ sessionId: session.id });
  }
}
