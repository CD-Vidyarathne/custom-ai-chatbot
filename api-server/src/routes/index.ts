import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import adminRoutes from './admin.routes.js';
import chatRoutes from './chat.routes.js';
import leadsRoutes from './leads.routes.js';
import personaRoutes from './persona.routes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.get('/protected', requireAuth, (req, res) => {
  res.json({ message: 'You are authenticated', user: req.user?.id });
});

router.use('/chat', chatRoutes);
router.use('/leads', leadsRoutes);
router.use('/persona', personaRoutes);
router.use('/admin', adminRoutes);

export default router;
