import { prisma } from '../lib/prisma';
import { Role } from '@prisma/client';
import { auditLog } from './auditService';

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

export const createOrganizationWithOwner = async ({
  organizationName,
  ownerName,
  ownerEmail,
  passwordHash
}: {
  organizationName: string;
  ownerName: string;
  ownerEmail: string;
  passwordHash: string;
}) => {
  const slugBase = slugify(organizationName);
  const slug = `${slugBase}-${Math.random().toString(36).slice(2, 8)}`;

  const organization = await prisma.organization.create({
    data: {
      name: organizationName,
      slug,
      users: {
        create: {
          role: Role.OWNER,
          user: {
            create: {
              email: ownerEmail,
              displayName: ownerName,
              passwordHash
            }
          }
        }
      },
      invoiceNumbering: {
        create: {}
      },
      invoiceCounter: {
        create: {}
      }
    },
    include: { users: { include: { user: true } } }
  });

  const owner = organization.users[0]?.user;
  if (owner) {
    await auditLog({
      orgId: organization.id,
      userId: owner.id,
      action: 'ORG_CREATED',
      entityType: 'organization',
      entityId: organization.id
    });
  }

  return { organization, owner };
};

export const updateOrganization = async (orgId: string, data: { name?: string }) => {
  return prisma.organization.update({
    where: { id: orgId },
    data
  });
};

export const getOrganization = async (orgId: string) =>
  prisma.organization.findUnique({
    where: { id: orgId },
    include: { theme: true, invoiceMeta: true, invoiceNumbering: true }
  });
