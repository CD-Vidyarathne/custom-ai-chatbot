import { Router, type Request, type Response } from 'express';
import { param, body } from 'express-validator';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  getAllLeads,
  getLeadById,
  captureLead,
  updateLead,
  extractLeadFromSession,
} from '../services/leads.service.js';

const router = Router();

/**
 * GET /api/leads
 * Get all captured leads (admin only). Optional query: ?org_id=xxx
 */
router.get('/', requireAuth, async (req: Request, res: Response) => {
  const orgId = typeof req.query.org_id === 'string' ? req.query.org_id : undefined;
  try {
    const leads = await getAllLeads(orgId);
    res.status(200).json({ leads });
  } catch (err) {
    console.error('Get leads error:', err);
    res.status(500).json({
      error: err instanceof Error ? err.message : 'Failed to fetch leads',
    });
  }
});

/**
 * GET /api/leads/:id
 * Get lead details.
 */
router.get(
  '/:id',
  requireAuth,
  validate([param('id').isUUID()]),
  async (req: Request, res: Response) => {
    const leadId = typeof req.params.id === 'string' ? req.params.id : '';
    try {
      const lead = await getLeadById(leadId);
      if (!lead) {
        res.status(404).json({ error: 'Lead not found' });
        return;
      }
      res.status(200).json(lead);
    } catch (err) {
      console.error('Get lead error:', err);
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Failed to fetch lead',
      });
    }
  }
);

/**
 * POST /api/leads
 * Capture lead. Body: consumer_id, org_id, session_id?, name?, email?, phone_number?, notes?
 * Or body: session_id only - then lead is extracted from conversation (consumer + session).
 */
router.post(
  '/',
  validate([
    body('consumer_id').optional().isUUID(),
    body('org_id').optional().isUUID(),
    body('session_id').optional().isUUID(),
    body('name').optional().isString(),
    body('email').optional().isEmail(),
    body('phone_number').optional().isString(),
    body('notes').optional().isString(),
  ]),
  async (req: Request, res: Response) => {
    try {
      const body = req.body as {
        session_id?: string;
        consumer_id?: string;
        org_id?: string;
        name?: string | null;
        email?: string | null;
        phone_number?: string | null;
        notes?: string | null;
      };

      if (body.session_id && !body.consumer_id) {
        const extracted = await extractLeadFromSession(body.session_id);
        if (!extracted) {
          res.status(404).json({ error: 'Session not found or has no consumer' });
          return;
        }
        const lead = await captureLead({
          ...extracted,
          name: body.name ?? extracted.name,
          email: body.email ?? extracted.email,
          phone_number: body.phone_number ?? extracted.phone_number,
          notes: body.notes ?? extracted.notes,
        });
        res.status(201).json(lead);
        return;
      }

      if (!body.consumer_id || !body.org_id) {
        res.status(400).json({
          error: 'Either session_id (for extraction) or both consumer_id and org_id are required',
        });
        return;
      }

      const lead = await captureLead({
        consumer_id: body.consumer_id,
        org_id: body.org_id,
        session_id: body.session_id ?? null,
        name: body.name ?? null,
        email: body.email ?? null,
        phone_number: body.phone_number ?? null,
        notes: body.notes ?? null,
      });
      res.status(201).json(lead);
    } catch (err) {
      console.error('Capture lead error:', err);
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Failed to capture lead',
      });
    }
  }
);

/**
 * PUT /api/leads/:id
 * Update lead information (admin only).
 */
router.put(
  '/:id',
  requireAuth,
  validate([
    param('id').isUUID(),
    body('name').optional().isString(),
    body('email').optional().isEmail(),
    body('phone_number').optional().isString(),
    body('notes').optional().isString(),
    body('status').optional().isIn(['new', 'contacted', 'qualified', 'closed']),
  ]),
  async (req: Request, res: Response) => {
    const leadId = typeof req.params.id === 'string' ? req.params.id : '';
    const body = req.body as {
      name?: string | null;
      email?: string | null;
      phone_number?: string | null;
      notes?: string | null;
      status?: 'new' | 'contacted' | 'qualified' | 'closed';
    };
    try {
      const lead = await updateLead(leadId, body);
      if (!lead) {
        res.status(404).json({ error: 'Lead not found' });
        return;
      }
      res.status(200).json(lead);
    } catch (err) {
      console.error('Update lead error:', err);
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Failed to update lead',
      });
    }
  }
);

export default router;
