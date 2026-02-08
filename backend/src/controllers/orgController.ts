import { Request, Response } from 'express';
import crypto from 'crypto';
import { Role } from '@prisma/client';
import { createOrganizationWithOwner, getOrganization, updateOrganization } from '../services/orgService';
import { hashPassword } from '../services/authService';
import { createInvite, acceptInvite, listMembers, addMember, updateMemberRole, removeMember, setMemberPermissions } from '../services/memberService';
import { HttpError } from '../utils/httpError';

export const createOrg = async (req: Request, res: Response) => {
  const { organizationName, ownerName, ownerEmail, password } = req.body;
  const passwordHash = await hashPassword(password);
  const { organization, owner } = await createOrganizationWithOwner({
    organizationName,
    ownerName,
    ownerEmail,
    passwordHash
  });

  res.status(201).json({ organization, owner });
};

export const getMyOrg = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new HttpError(401, 'Unauthorized');
  }
  const organization = await getOrganization(req.user.orgId);
  res.json({ organization });
};

export const patchOrg = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new HttpError(401, 'Unauthorized');
  }
  const organization = await updateOrganization(req.user.orgId, req.body);
  res.json({ organization });
};

export const listOrgMembers = async (req: Request, res: Response) => {
  const orgId = req.params.orgId;
  const members = await listMembers(orgId);
  res.json({ members });
};

export const addOrgMember = async (req: Request, res: Response) => {
  const orgId = req.params.orgId;
  const { userId, role } = req.body as { userId: string; role: Role };
  const membership = await addMember({ orgId, userId, role });
  res.status(201).json({ membership });
};

export const updateOrgMember = async (req: Request, res: Response) => {
  const orgId = req.params.orgId;
  const membershipId = req.params.memberId;
  const { role, permissions } = req.body as { role: Role; permissions?: { featureKey: string; level: 'NONE' | 'READ' | 'WRITE' }[] };
  const membership = await updateMemberRole({ orgId, membershipId, role });
  if (!membership) {
    throw new HttpError(404, 'Member not found');
  }
  if (permissions) {
    await setMemberPermissions({ membershipId, permissions });
  }
  res.json({ membership });
};

export const deleteOrgMember = async (req: Request, res: Response) => {
  const orgId = req.params.orgId;
  const membershipId = req.params.memberId;
  const membership = await removeMember(orgId, membershipId);
  if (!membership) {
    throw new HttpError(404, 'Member not found');
  }
  res.status(204).send();
};

export const createOrgInvite = async (req: Request, res: Response) => {
  const orgId = req.params.orgId;
  const { email, role } = req.body as { email: string; role: Role };
  const token = crypto.randomBytes(20).toString('hex');
  const invite = await createInvite({
    orgId,
    email,
    role,
    token,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24)
  });
  res.status(201).json({ invite });
};

export const acceptOrgInvite = async (req: Request, res: Response) => {
  const { token, userId } = req.body as { token: string; userId: string };
  const membership = await acceptInvite({ token, userId });
  if (!membership) {
    throw new HttpError(400, 'Invalid invite');
  }
  res.status(201).json({ membership });
};
