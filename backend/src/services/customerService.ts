import { prisma } from '../lib/prisma';

export const listCustomers = (orgId: string) =>
  prisma.customer.findMany({
    where: { organizationId: orgId },
    include: { notes: { include: { author: true } } }
  });

export const getCustomer = (orgId: string, customerId: string) =>
  prisma.customer.findFirst({
    where: { id: customerId, organizationId: orgId },
    include: { notes: { include: { author: true } }, invoices: true }
  });

export const createCustomer = (orgId: string, data: { name: string; email?: string; address?: string; contactPerson?: string; phone?: string }) =>
  prisma.customer.create({
    data: {
      organizationId: orgId,
      ...data
    }
  });

export const updateCustomer = (orgId: string, customerId: string, data: Partial<{ name: string; email: string; address: string; contactPerson: string; phone: string }>) =>
  prisma.customer.update({
    where: { id: customerId },
    data,
    select: { id: true, name: true, email: true, address: true, contactPerson: true, phone: true }
  });

export const deleteCustomer = (orgId: string, customerId: string) =>
  prisma.customer.delete({ where: { id: customerId } });

export const addCustomerNote = (orgId: string, customerId: string, authorId: string, content: string) =>
  prisma.customerNote.create({
    data: {
      content,
      customerId,
      authorId
    },
    include: { author: true }
  });
