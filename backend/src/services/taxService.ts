import { prisma } from '../lib/prisma';

export const listTaxes = (orgId: string) => prisma.taxRate.findMany({ where: { organizationId: orgId } });

export const getTax = (orgId: string, taxId: string) =>
  prisma.taxRate.findFirst({ where: { id: taxId, organizationId: orgId } });

export const createTax = (orgId: string, data: { name: string; percentage: number }) =>
  prisma.taxRate.create({
    data: {
      organizationId: orgId,
      ...data
    }
  });

export const updateTax = (orgId: string, taxId: string, data: Partial<{ name: string; percentage: number }>) =>
  prisma.taxRate.update({
    where: { id: taxId },
    data
  });

export const deleteTax = (orgId: string, taxId: string) => prisma.taxRate.delete({ where: { id: taxId } });
