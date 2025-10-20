import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { BillingController } from '../controllers/billingController';

const router = Router();
const controller = new BillingController();

router.use(requireAuth);
router.post('/subscription', (req, res) => controller.updateSubscription(req, res));
router.post('/create-checkout-session', (req, res) => controller.createCheckoutSession(req, res));

export default router;
