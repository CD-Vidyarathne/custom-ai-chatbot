import { Router, type Request, type Response } from 'express';
import { query } from 'express-validator';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  getConversationsWithFilters,
  getAdminStats,
  getAdminMonitoring,
} from '../services/admin.service.js';

const router = Router();

/** All admin routes require authentication. */
router.use(requireAuth);

/**
 * GET /api/admin/conversations
 * Get all conversations with filters. Query: ?org_id= &status= &consumer_id= &limit= &offset=
 */
router.get(
  '/conversations',
  validate([
    query('org_id').optional().isUUID(),
    query('status').optional().isIn(['active', 'closed', 'abandoned']),
    query('consumer_id').optional().isUUID(),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('offset').optional().isInt({ min: 0 }),
  ]),
  async (req: Request, res: Response) => {
    const orgId = typeof req.query.org_id === 'string' ? req.query.org_id : undefined;
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const consumerId = typeof req.query.consumer_id === 'string' ? req.query.consumer_id : undefined;
    const limit = req.query.limit != null ? Number(req.query.limit) : undefined;
    const offset = req.query.offset != null ? Number(req.query.offset) : undefined;

    try {
      const conversations = await getConversationsWithFilters({
        org_id: orgId,
        status: status as 'active' | 'closed' | 'abandoned' | undefined,
        consumer_id: consumerId,
        limit,
        offset,
      });
      res.status(200).json({ conversations });
    } catch (err) {
      console.error('Admin conversations error:', err);
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Failed to fetch conversations',
      });
    }
  }
);

/**
 * GET /api/admin/stats
 * Dashboard statistics: total conversations, active, total leads, recent activity.
 * Query: ?org_id= (optional filter by org)
 */
router.get(
  '/stats',
  validate([query('org_id').optional().isUUID()]),
  async (req: Request, res: Response) => {
    const orgId = typeof req.query.org_id === 'string' ? req.query.org_id : undefined;
    try {
      const stats = await getAdminStats(orgId);
      res.status(200).json(stats);
    } catch (err) {
      console.error('Admin stats error:', err);
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Failed to fetch stats',
      });
    }
  }
);

/**
 * GET /api/admin/monitoring
 * Monitoring data: response times, message counts, user activity.
 * Query: ?org_id= (optional)
 */
router.get(
  '/monitoring',
  validate([query('org_id').optional().isUUID()]),
  async (req: Request, res: Response) => {
    const orgId = typeof req.query.org_id === 'string' ? req.query.org_id : undefined;
    try {
      const monitoring = await getAdminMonitoring(orgId);
      res.status(200).json(monitoring);
    } catch (err) {
      console.error('Admin monitoring error:', err);
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Failed to fetch monitoring data',
      });
    }
  }
);

export default router;
