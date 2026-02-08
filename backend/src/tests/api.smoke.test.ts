import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import { prisma } from '../lib/prisma';

const describeIfDb = process.env.DATABASE_URL ? describe : describe.skip;

describeIfDb('API smoke', () => {
  let accessToken = '';
  let orgId = '';
  let customerId = '';

  beforeAll(async () => {
    await prisma.$connect();
  });

  it('onboards organization and logs in', async () => {
    const onboard = await request(app).post('/api/orgs').send({
      organizationName: 'Test Org',
      ownerName: 'Owner',
      ownerEmail: 'owner@example.com',
      password: 'Password123!'
    });
    expect(onboard.status).toBe(201);
    orgId = onboard.body.organization.id;

    const login = await request(app).post('/api/auth/login').send({
      email: 'owner@example.com',
      password: 'Password123!',
      orgId
    });

    expect(login.status).toBe(200);
    accessToken = login.body.accessToken;
  });

  it('creates customer, invoice, issue, and payment', async () => {
    const customer = await request(app)
      .post('/api/customers')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('x-org-id', orgId)
      .send({ name: 'Acme GmbH', email: 'info@acme.test' });

    expect(customer.status).toBe(201);
    customerId = customer.body.customer.id;

    const invoice = await request(app)
      .post('/api/invoices')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('x-org-id', orgId)
      .send({
        customerId,
        type: 'INVOICE',
        lines: [{ description: 'Service', quantity: 1, unitPrice: 10000 }]
      });

    expect(invoice.status).toBe(201);
    const invoiceId = invoice.body.invoice.id;

    const issue = await request(app)
      .post(`/api/invoices/${invoiceId}/issue`)
      .set('Authorization', `Bearer ${accessToken}`)
      .set('x-org-id', orgId);

    expect(issue.status).toBe(200);

    const payment = await request(app)
      .post(`/api/invoices/${invoiceId}/payments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .set('x-org-id', orgId)
      .send({ amountCents: 10000, method: 'bank' });

    expect(payment.status).toBe(201);
  });
});
