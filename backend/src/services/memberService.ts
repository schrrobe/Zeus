import { prisma } from '../lib/prisma';
import { Role } from '@prisma/client';
import { auditLog } from './auditService';

export const listMembers = (orgId: string) =>
  prisma.membership.findMany({
    where: { organizationId: orgId },
    include: { user: true, permissions: true }
  });

export const addMember = async ({
  orgId,
  userId,
  role
}: {
  orgId: string;
  userId: string;
  role: Role;
}) => {
  const membership = await prisma.membership.create({
    data: { organizationId: orgId, userId, role }
  });
  await auditLog({ orgId, userId, action: 'MEMBER_ADDED', entityType: 'membership', entityId: membership.id });
  return membership;
};

export const updateMemberRole = async ({
  orgId,
  membershipId,
  role
}: {
  orgId: string;
  membershipId: string;
  role: Role;
}) => {
  const membership = await prisma.membership.findFirst({
    where: { id: membershipId, organizationId: orgId }
  });
  if (!membership) {
    return null;
  }
  return prisma.membership.update({
    where: { id: membershipId },
    data: { role }
  });
};

export const setMemberPermissions = async ({
  membershipId,
  permissions
}: {
  membershipId: string;
  permissions: { featureKey: string; level: 'NONE' | 'READ' | 'WRITE' }[];
}) => {
  await prisma.permission.deleteMany({ where: { membershipId } });
  return prisma.permission.createMany({
    data: permissions.map((permission) => ({
      membershipId,
      featureKey: permission.featureKey,
      level: permission.level
    }))
  });
};

export const removeMember = async (orgId: string, membershipId: string) => {
  const membership = await prisma.membership.findFirst({
    where: { id: membershipId, organizationId: orgId }
  });
  if (!membership) {
    return null;
  }
  return prisma.membership.delete({ where: { id: membershipId } });
};

export const createInvite = async ({
  orgId,
  email,
  role,
  expiresAt,
  token
}: {
  orgId: string;
  email: string;
  role: Role;
  expiresAt: Date;
  token: string;
}) =>
  prisma.invite.create({
    data: {
      organizationId: orgId,
      email,
      role,
      expiresAt,
      token
    }
  });

export const acceptInvite = async ({
  token,
  userId
}: {
  token: string;
  userId: string;
}) => {
  const invite = await prisma.invite.findUnique({ where: { token } });
  if (!invite || invite.acceptedAt) {
    return null;
  }

  const membership = await prisma.membership.create({
    data: {
      organizationId: invite.organizationId,
      userId,
      role: invite.role
    }
  });

  await prisma.invite.update({
    where: { id: invite.id },
    data: { acceptedAt: new Date() }
  });

  await auditLog({
    orgId: invite.organizationId,
    userId,
    action: 'INVITE_ACCEPTED',
    entityType: 'invite',
    entityId: invite.id
  });

  return membership;
};
