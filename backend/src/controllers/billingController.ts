import { Request, Response } from 'express';
import { createCheckoutSession, createPortalSession, handleStripeWebhook, getSubscription } from '../services/billingService';
import { HttpError } from '../utils/httpError';

export const checkoutSession = async (req: Request, res: Response) => {
  const url = await createCheckoutSession({ orgId: req.user!.orgId, customerEmail: req.body.email });
  res.json({ url });
};

export const portalSession = async (req: Request, res: Response) => {
  const { customerId } = req.body;
  const url = await createPortalSession(customerId);
  res.json({ url });
};

export const subscription = async (req: Request, res: Response) => {
  const record = await getSubscription(req.user!.orgId);
  if (!record) {
    throw new HttpError(404, 'No subscription');
  }
  res.json({ subscription: record });
};

export const webhook = async (req: Request, res: Response) => {
  await handleStripeWebhook(req.body, req.headers['stripe-signature'] as string | undefined);
  res.json({ received: true });
};
