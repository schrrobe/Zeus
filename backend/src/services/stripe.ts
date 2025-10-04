import Stripe from 'stripe';
import { loadConfig } from '../config/env';

const config = loadConfig();
export const stripe = new Stripe(config.stripeSecretKey, {
  apiVersion: '2023-10-16'
});

export async function createCheckoutSession(params: { priceId: string; customerEmail: string }) {
  return stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: params.priceId, quantity: 1 }],
    customer_email: params.customerEmail,
    success_url: `${config.frontendUrl}/settings?checkout=success`,
    cancel_url: `${config.frontendUrl}/settings?checkout=cancel`
  });
}

export async function listInvoices(customerId: string) {
  return stripe.invoices.list({ customer: customerId, limit: 20 });
}
