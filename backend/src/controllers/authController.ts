import { Request, Response } from 'express';
import crypto from 'crypto';
import { prisma } from '../lib/prisma';
import { Role } from '@prisma/client';
import { hashPassword, verifyPassword } from '../services/authService';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../services/tokenService';
import { HttpError } from '../utils/httpError';

export const register = async (req: Request, res: Response) => {
  const { email, password, displayName, organizationId } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new HttpError(409, 'Email already in use');
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      displayName,
      passwordHash,
      memberships: organizationId
        ? {
            create: {
              organizationId,
              role: Role.MEMBER
            }
          }
        : undefined
    }
  });

  const token = signAccessToken({ sub: user.id, orgId: organizationId ?? '', role: Role.MEMBER });

  res.status(201).json({ user: { id: user.id, email: user.email, displayName: user.displayName }, accessToken: token });
};

export const login = async (req: Request, res: Response) => {
  const { email, password, orgId } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new HttpError(401, 'Invalid credentials');
  }

  const valid = await verifyPassword(user.passwordHash, password);
  if (!valid) {
    throw new HttpError(401, 'Invalid credentials');
  }

  const membership = await prisma.membership.findFirst({
    where: { userId: user.id, organizationId: orgId }
  });
  if (!membership) {
    throw new HttpError(403, 'No membership for organization');
  }

  const accessToken = signAccessToken({ sub: user.id, orgId, role: membership.role });
  const refreshToken = signRefreshToken({ sub: user.id });

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    }
  });

  res.json({ accessToken, refreshToken });
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken, orgId } = req.body;
  const payload = verifyRefreshToken(refreshToken);

  const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
  if (!stored || stored.expiresAt < new Date()) {
    throw new HttpError(401, 'Refresh token expired');
  }

  const membership = await prisma.membership.findFirst({
    where: { userId: payload.sub, organizationId: orgId }
  });
  if (!membership) {
    throw new HttpError(403, 'No membership for organization');
  }

  const accessToken = signAccessToken({ sub: payload.sub, orgId, role: membership.role });
  res.json({ accessToken });
};

export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  }
  res.status(204).send();
};

export const me = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new HttpError(401, 'Unauthorized');
  }
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  res.json({ user });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(204).send();
    return;
  }

  const token = crypto.randomBytes(24).toString('hex');
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 30)
    }
  });

  res.json({ resetToken: token });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;
  const record = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!record || record.expiresAt < new Date()) {
    throw new HttpError(400, 'Invalid reset token');
  }

  const passwordHash = await hashPassword(password);
  await prisma.user.update({ where: { id: record.userId }, data: { passwordHash } });
  await prisma.passwordResetToken.delete({ where: { id: record.id } });

  res.status(204).send();
};
