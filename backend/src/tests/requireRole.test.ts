import { describe, it, expect } from 'vitest';
import { requireRole } from '../middlewares/requireRole';
import { Role } from '@prisma/client';

const runMiddleware = (role: Role, required: Role) =>
  new Promise((resolve, reject) => {
    const req: any = { user: { role } };
    const res: any = {};
    requireRole(required)(req, res, (err?: Error) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });

describe('requireRole', () => {
  it('allows higher roles', async () => {
    await expect(runMiddleware(Role.OWNER, Role.ADMIN)).resolves.toBe(true);
  });

  it('blocks lower roles', async () => {
    await expect(runMiddleware(Role.MEMBER, Role.ACCOUNTING)).rejects.toBeTruthy();
  });
});
