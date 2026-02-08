import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middlewares/asyncHandler';
import { validate } from '../middlewares/validate';
import { createOrg, getMyOrg, patchOrg, listOrgMembers, addOrgMember, updateOrgMember, deleteOrgMember, createOrgInvite } from '../controllers/orgController';
import { requireAuth } from '../middlewares/auth';
import { requireRole } from '../middlewares/requireRole';
import { requireOrgMatch } from '../middlewares/orgScope';
import { Role } from '@prisma/client';

const router = Router();

router.post(
  '/',
  validate(
    z.object({
      body: z.object({
        organizationName: z.string().min(2),
        ownerName: z.string().min(2),
        ownerEmail: z.string().email(),
        password: z.string().min(8)
      })
    })
  ),
  asyncHandler(createOrg)
);

router.get('/me', requireAuth, asyncHandler(getMyOrg));

router.patch('/:orgId', requireAuth, requireOrgMatch, requireRole(Role.ADMIN), asyncHandler(patchOrg));

router.get('/:orgId/members', requireAuth, requireOrgMatch, requireRole(Role.ADMIN), asyncHandler(listOrgMembers));

router.post(
  '/:orgId/members',
  requireAuth,
  requireOrgMatch,
  requireRole(Role.ADMIN),
  validate(
    z.object({
      body: z.object({
        userId: z.string().uuid(),
        role: z.nativeEnum(Role)
      })
    })
  ),
  asyncHandler(addOrgMember)
);

router.patch(
  '/:orgId/members/:memberId',
  requireAuth,
  requireOrgMatch,
  requireRole(Role.ADMIN),
  validate(
    z.object({
      body: z.object({
        role: z.nativeEnum(Role),
        permissions: z
          .array(
            z.object({
              featureKey: z.string().min(1),
              level: z.enum(['NONE', 'READ', 'WRITE'])
            })
          )
          .optional()
      })
    })
  ),
  asyncHandler(updateOrgMember)
);

router.delete('/:orgId/members/:memberId', requireAuth, requireOrgMatch, requireRole(Role.ADMIN), asyncHandler(deleteOrgMember));

router.post(
  '/:orgId/invites',
  requireAuth,
  requireOrgMatch,
  requireRole(Role.ADMIN),
  validate(
    z.object({
      body: z.object({
        email: z.string().email(),
        role: z.nativeEnum(Role)
      })
    })
  ),
  asyncHandler(createOrgInvite)
);

export default router;
