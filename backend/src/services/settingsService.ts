import { prisma } from '../lib/prisma';

export const getInvoiceNumbering = (orgId: string) =>
  prisma.invoiceNumbering.findUnique({ where: { organizationId: orgId } });

export const getQuoteNumbering = (orgId: string) =>
  prisma.quoteNumbering.findUnique({ where: { organizationId: orgId } });

export const updateInvoiceNumbering = (
  orgId: string,
  data: Partial<{ prefix: string; nextNumber: number; resetYearly: boolean; startNumber: number; minDigits: number }>
) =>
  prisma.invoiceNumbering.upsert({
    where: { organizationId: orgId },
    update: {
      ...data,
      ...(data.startNumber !== undefined || data.nextNumber !== undefined
        ? { startNumber: data.startNumber ?? data.nextNumber }
        : {})
    },
    create: {
      organizationId: orgId,
      ...data,
      startNumber: data.startNumber ?? data.nextNumber
    }
  });

export const updateQuoteNumbering = (
  orgId: string,
  data: Partial<{ prefix: string; nextNumber: number; resetYearly: boolean; startNumber: number; minDigits: number }>
) =>
  prisma.quoteNumbering.upsert({
    where: { organizationId: orgId },
    update: {
      ...data,
      ...(data.startNumber !== undefined || data.nextNumber !== undefined
        ? { startNumber: data.startNumber ?? data.nextNumber }
        : {})
    },
    create: {
      organizationId: orgId,
      ...data,
      startNumber: data.startNumber ?? data.nextNumber
    }
  });
