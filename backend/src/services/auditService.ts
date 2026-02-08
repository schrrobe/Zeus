import { prisma } from '../lib/prisma';

export const auditLog = async ({
  orgId,
  userId,
  action,
  entityType,
  entityId,
  metadata
}: {
  orgId: string;
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}) => {
  await prisma.auditLog.create({
    data: {
      organizationId: orgId,
      userId,
      action,
      entityType,
      entityId: entityId ?? null,
      metadata: metadata ?? undefined
    }
  });
};
