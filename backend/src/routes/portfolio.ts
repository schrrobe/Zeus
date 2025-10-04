import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { PortfolioController } from '../controllers/portfolioController';

const router = Router();
const controller = new PortfolioController();

router.use(requireAuth);
router.get('/', (req, res) => controller.listSnapshots(req, res));
router.post('/:id/refresh', (req, res) => controller.refreshSnapshot(req, res));

export default router;
