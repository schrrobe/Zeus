import { prisma } from '../lib/prisma';

export const getInvoiceNumbering = (orgId: string) =>
  prisma.invoiceNumbering.findUnique({ where: { organizationId: orgId } });

export const updateInvoiceNumbering = (
  orgId: string,
  data: Partial<{ prefix: string; nextNumber: number; resetYearly: boolean }>
) =>
  prisma.invoiceNumbering.upsert({
    where: { organizationId: orgId },
    update: data,
    create: { organizationId: orgId, ...data }
  });
