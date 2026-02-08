import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middlewares/asyncHandler';
import { validate } from '../middlewares/validate';
import { acceptOrgInvite } from '../controllers/orgController';

const router = Router();

router.post(
  '/accept',
  validate(
    z.object({
      body: z.object({
        token: z.string().min(10),
        userId: z.string().uuid()
      })
    })
  ),
  asyncHandler(acceptOrgInvite)
);

export default router;
