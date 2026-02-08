import { prisma } from '../lib/prisma';

export const listItems = (orgId: string) =>
  prisma.item.findMany({ where: { organizationId: orgId }, include: { taxRate: true } });

export const getItem = (orgId: string, itemId: string) =>
  prisma.item.findFirst({ where: { id: itemId, organizationId: orgId }, include: { taxRate: true } });

export const createItem = (
  orgId: string,
  data: { name: string; description?: string; priceCents: number; unit: string; taxRateId?: string }
) =>
  prisma.item.create({
    data: {
      organizationId: orgId,
      ...data
    }
  });

export const updateItem = (
  orgId: string,
  itemId: string,
  data: Partial<{ name: string; description: string; priceCents: number; unit: string; taxRateId: string }>
) =>
  prisma.item.update({
    where: { id: itemId },
    data
  });

export const deleteItem = (orgId: string, itemId: string) => prisma.item.delete({ where: { id: itemId } });
