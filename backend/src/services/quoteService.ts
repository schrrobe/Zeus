import { prisma } from '../lib/prisma';
import { QuoteStatus } from '@prisma/client';
import { calculateTotals } from './invoiceCalculator';

export type QuoteLineInput = {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRatePercent?: number;
  taxRateId?: string;
};

export const listQuotes = (orgId: string) =>
  prisma.quote.findMany({ where: { organizationId: orgId }, include: { customer: true, lines: true } });

export const getQuote = (orgId: string, quoteId: string) =>
  prisma.quote.findFirst({ where: { id: quoteId, organizationId: orgId }, include: { customer: true, lines: true } });

export const createQuote = async ({
  orgId,
  customerId,
  lines,
  validUntil
}: {
  orgId: string;
  customerId: string;
  lines: QuoteLineInput[];
  validUntil?: Date;
}) => {
  const totals = calculateTotals(
    lines.map((line) => ({
      description: line.description,
      quantity: line.quantity,
      unitPrice: line.unitPrice,
      taxRate: line.taxRatePercent
    }))
  );

  return prisma.quote.create({
    data: {
      organizationId: orgId,
      customerId,
      status: QuoteStatus.DRAFT,
      validUntil,
      totalCents: totals.totalCents,
      lines: {
        create: lines.map((line) => ({
          description: line.description,
          quantity: line.quantity,
          unitPrice: line.unitPrice,
          taxRateId: line.taxRateId ?? null
        }))
      }
    },
    include: { lines: true }
  });
};

export const updateQuoteStatus = (orgId: string, quoteId: string, status: QuoteStatus) =>
  prisma.quote.update({
    where: { id: quoteId },
    data: { status, issuedAt: status === QuoteStatus.SENT ? new Date() : undefined }
  });

export const deleteQuote = (orgId: string, quoteId: string) => prisma.quote.delete({ where: { id: quoteId } });
