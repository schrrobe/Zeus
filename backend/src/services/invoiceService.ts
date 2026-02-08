import { prisma } from '../lib/prisma';
import { InvoiceStatus, InvoiceType } from '@prisma/client';
import { calculateTotals } from './invoiceCalculator';
import { auditLog } from './auditService';
import { HttpError } from '../utils/httpError';

export type LineInput = {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRateId?: string;
  taxRatePercent?: number;
};

export const listInvoices = (orgId: string) =>
  prisma.invoice.findMany({ where: { organizationId: orgId }, include: { customer: true, lines: true } });

export const getInvoice = (orgId: string, invoiceId: string) =>
  prisma.invoice.findFirst({ where: { id: invoiceId, organizationId: orgId }, include: { customer: true, lines: true } });

export const createInvoiceDraft = async ({
  orgId,
  customerId,
  type,
  lines,
  discountCents,
  dueAt
}: {
  orgId: string;
  customerId: string;
  type: InvoiceType;
  lines: LineInput[];
  discountCents?: number;
  dueAt?: Date;
}) => {
  const totals = calculateTotals(
    lines.map((line) => ({
      description: line.description,
      quantity: line.quantity,
      unitPrice: line.unitPrice,
      taxRate: line.taxRatePercent
    })),
    discountCents ?? 0
  );

  return prisma.$transaction(async (tx) => {
    const invoice = await tx.invoice.create({
      data: {
        organizationId: orgId,
        customerId,
        type,
        status: InvoiceStatus.DRAFT,
        dueAt,
        subtotalCents: totals.subtotalCents,
        taxCents: totals.taxCents,
        discountCents: totals.discountCents,
        totalCents: totals.totalCents,
        lines: {
          create: lines.map((line) => ({
            description: line.description,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            taxRateId: line.taxRateId ?? null,
            lineTotal: line.quantity * line.unitPrice
          }))
        }
      },
      include: { lines: true }
    });

    return invoice;
  });
};

export const issueInvoice = async (orgId: string, invoiceId: string, userId: string) =>
  prisma.$transaction(async (tx) => {
    const invoice = await tx.invoice.findFirst({
      where: { id: invoiceId, organizationId: orgId },
      include: { customer: true }
    });
    if (!invoice) {
      throw new HttpError(404, 'Invoice not found');
    }
    if (invoice.status !== InvoiceStatus.DRAFT) {
      throw new HttpError(400, 'Only draft invoices can be issued');
    }

    const numbering = await tx.invoiceNumbering.upsert({
      where: { organizationId: orgId },
      update: {},
      create: { organizationId: orgId }
    });

    const now = new Date();
    const year = now.getFullYear();
    const number = numbering.nextNumber;

    await tx.invoiceNumbering.update({
      where: { organizationId: orgId },
      data: { nextNumber: number + 1 }
    });

    const updated = await tx.invoice.update({
      where: { id: invoiceId },
      data: {
        status: InvoiceStatus.ISSUED,
        issuedAt: now,
        number,
        numberYear: year
      }
    });

    await auditLog({
      orgId,
      userId,
      action: 'INVOICE_ISSUED',
      entityType: 'invoice',
      entityId: invoiceId
    });

    return updated;
  });

export const recordPayment = async ({
  orgId,
  invoiceId,
  amountCents,
  method,
  reference,
  userId
}: {
  orgId: string;
  invoiceId: string;
  amountCents: number;
  method: string;
  reference?: string;
  userId: string;
}) =>
  prisma.$transaction(async (tx) => {
    const invoice = await tx.invoice.findFirst({ where: { id: invoiceId, organizationId: orgId } });
    if (!invoice) {
      throw new HttpError(404, 'Invoice not found');
    }

    await tx.payment.create({
      data: {
        invoiceId,
        amountCents,
        method,
        reference
      }
    });

    const payments = await tx.payment.aggregate({
      where: { invoiceId },
      _sum: { amountCents: true }
    });

    const paidTotal = payments._sum.amountCents ?? 0;
    if (paidTotal >= invoice.totalCents) {
      await tx.invoice.update({
        where: { id: invoiceId },
        data: { status: InvoiceStatus.PAID }
      });
    }

    await auditLog({
      orgId,
      userId,
      action: 'PAYMENT_RECORDED',
      entityType: 'invoice',
      entityId: invoiceId
    });
  });

export const deleteInvoice = (orgId: string, invoiceId: string) =>
  prisma.invoice.delete({ where: { id: invoiceId } });

export const createInvoiceFromQuote = async ({
  orgId,
  quoteId
}: {
  orgId: string;
  quoteId: string;
}) =>
  prisma.$transaction(async (tx) => {
    const quote = await tx.quote.findFirst({
      where: { id: quoteId, organizationId: orgId },
      include: { lines: true }
    });
    if (!quote) {
      throw new HttpError(404, 'Quote not found');
    }

    const invoice = await tx.invoice.create({
      data: {
        organizationId: orgId,
        customerId: quote.customerId,
        type: InvoiceType.INVOICE,
        status: InvoiceStatus.DRAFT,
        totalCents: quote.totalCents,
        lines: {
          create: quote.lines.map((line) => ({
            description: line.description,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            taxRateId: line.taxRateId,
            lineTotal: line.quantity * line.unitPrice
          }))
        }
      },
      include: { lines: true }
    });

    return invoice;
  });
