import Stripe from 'stripe';
import { prisma } from '../lib/prisma';
import { SubscriptionStatus } from '@prisma/client';

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: '2024-06-20' }) : null;

export const createCheckoutSession = async ({
  orgId,
  customerEmail
}: {
  orgId: string;
  customerEmail: string;
}) => {
  if (!stripe) {
    throw new Error('Stripe not configured');
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: customerEmail,
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1
      }
    ],
    success_url: process.env.STRIPE_SUCCESS_URL || 'http://localhost:5173/billing/success',
    cancel_url: process.env.STRIPE_CANCEL_URL || 'http://localhost:5173/billing/cancel',
    metadata: {
      orgId
    }
  });

  return session.url;
};

export const createPortalSession = async (customerId: string) => {
  if (!stripe) {
    throw new Error('Stripe not configured');
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: process.env.STRIPE_PORTAL_RETURN_URL || 'http://localhost:5173/settings/billing'
  });

  return session.url;
};

export const upsertSubscription = async ({
  orgId,
  providerCustomerId,
  providerSubscriptionId,
  status,
  plan,
  currentPeriodEnd
}: {
  orgId: string;
  providerCustomerId: string;
  providerSubscriptionId: string;
  status: SubscriptionStatus;
  plan: string;
  currentPeriodEnd?: Date;
}) =>
  prisma.subscription.upsert({
    where: { providerSubscriptionId },
    update: {
      status: status as SubscriptionStatus,
      plan,
      currentPeriodEnd
    },
    create: {
      organizationId: orgId,
      provider: 'stripe',
      providerCustomerId,
      providerSubscriptionId,
      status: status as SubscriptionStatus,
      plan,
      currentPeriodEnd
    }
  });

export const getSubscription = (orgId: string) =>
  prisma.subscription.findFirst({ where: { organizationId: orgId }, orderBy: { createdAt: 'desc' } });

export const handleStripeWebhook = async (payload: Buffer, signature: string | undefined) => {
  if (!stripe) {
    throw new Error('Stripe not configured');
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  const event = stripe.webhooks.constructEvent(payload, signature || '', webhookSecret);

  const mapStatus = (input: string): SubscriptionStatus => {
    switch (input) {
      case 'active':
        return SubscriptionStatus.ACTIVE;
      case 'past_due':
        return SubscriptionStatus.PAST_DUE;
      case 'canceled':
        return SubscriptionStatus.CANCELED;
      default:
        return SubscriptionStatus.INCOMPLETE;
    }
  };

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orgId = session.metadata?.orgId;
    if (orgId && session.customer && session.subscription) {
      await upsertSubscription({
        orgId,
        providerCustomerId: session.customer.toString(),
        providerSubscriptionId: session.subscription.toString(),
        status: SubscriptionStatus.ACTIVE,
        plan: 'paid'
      });
    }
  }

  if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as Stripe.Subscription;
    const orgId = subscription.metadata?.orgId;
    if (orgId) {
      await upsertSubscription({
        orgId,
        providerCustomerId: subscription.customer.toString(),
        providerSubscriptionId: subscription.id,
        status: mapStatus(subscription.status),
        plan: 'paid',
        currentPeriodEnd: new Date(subscription.current_period_end * 1000)
      });
    }
  }

  return event;
};
