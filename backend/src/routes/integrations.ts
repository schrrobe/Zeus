import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { IntegrationController } from '../controllers/integrationController';

const router = Router();
const controller = new IntegrationController();

router.use(requireAuth);
router.post('/wallet', (req, res) => controller.connectWallet(req, res));
router.post('/exchange', (req, res) => controller.connectExchange(req, res));

export default router;
