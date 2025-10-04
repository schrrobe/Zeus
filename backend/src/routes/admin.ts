import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { requireAdmin } from '../middleware/requireAdmin';
import { AdminController } from '../controllers/adminController';

const router = Router();
const controller = new AdminController();

router.get('/notices', requireAuth, (req, res) => controller.listNotices(req, res));

router.use(requireAuth, requireAdmin);
router.get('/users', (req, res) => controller.listUsers(req, res));
router.post('/users/:id/subscription', (req, res) => controller.updateSubscription(req, res));
router.delete('/users/:id', (req, res) => controller.deleteUser(req, res));
router.get('/summary', (req, res) => controller.summary(req, res));
router.post('/notices', (req, res) => controller.createNotice(req, res));

export default router;
