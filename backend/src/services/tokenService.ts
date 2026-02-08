import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { HttpError } from '../utils/httpError';

const accessSecret = process.env.JWT_ACCESS_SECRET || 'dev_access_secret';
const refreshSecret = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';

export type AccessTokenPayload = {
  sub: string;
  orgId: string;
  role: Role;
};

export const signAccessToken = (payload: AccessTokenPayload) =>
  jwt.sign(payload, accessSecret, { expiresIn: '15m' });

export const signRefreshToken = (payload: { sub: string }) =>
  jwt.sign(payload, refreshSecret, { expiresIn: '30d' });

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, accessSecret) as AccessTokenPayload;
  } catch {
    throw new HttpError(401, 'Invalid access token');
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, refreshSecret) as { sub: string };
  } catch {
    throw new HttpError(401, 'Invalid refresh token');
  }
};
