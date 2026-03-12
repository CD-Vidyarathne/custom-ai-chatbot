import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import chatRoutes from './chat.routes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.get('/protected', requireAuth, (req, res) => {
  res.json({ message: 'You are authenticated', user: req.user?.id });
});

router.use('/chat', chatRoutes);

export default router;
