import { Router, type Request, type Response } from 'express';
import { query, param, body } from 'express-validator';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  getPersonaByOrgId,
  getPersonaById,
  updatePersona,
} from '../services/persona.service.js';

const router = Router();

/**
 * GET /api/persona
 * Get current persona configuration. Query: ?org_id=xxx or ?persona_id=xxx
 */
router.get(
  '/',
  validate([
    query('org_id').optional().isUUID(),
    query('persona_id').optional().isUUID(),
  ]),
  async (req: Request, res: Response) => {
    const orgId = typeof req.query.org_id === 'string' ? req.query.org_id : undefined;
    const personaId = typeof req.query.persona_id === 'string' ? req.query.persona_id : undefined;

    if (!orgId && !personaId) {
      res.status(400).json({ error: 'Query org_id or persona_id is required' });
      return;
    }

    try {
      const persona = personaId
        ? await getPersonaById(personaId)
        : await getPersonaByOrgId(orgId!);
      if (!persona) {
        res.status(404).json({ error: 'Persona not found' });
        return;
      }
      res.status(200).json(persona);
    } catch (err) {
      console.error('Get persona error:', err);
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Failed to fetch persona',
      });
    }
  }
);

/**
 * PUT /api/persona/:id
 * Update persona details (admin only). Validate persona updates.
 */
router.put(
  '/:id',
  requireAuth,
  validate([
    param('id').isUUID(),
    body('name').optional().trim().notEmpty().withMessage('Persona name cannot be empty'),
    body('system_prompt')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('System prompt cannot be empty'),
    body('greeting_message').optional().isString(),
    body('fallback_message').optional().isString(),
    body('ai_provider').optional().isString(),
    body('model_name').optional().isString(),
    body('temperature').optional().isFloat({ min: 0, max: 2 }),
    body('max_tokens').optional().isInt({ min: 1 }),
    body('is_active').optional().isBoolean(),
  ]),
  async (req: Request, res: Response) => {
    const personaId = typeof req.params.id === 'string' ? req.params.id : '';
    const body = req.body as {
      name?: string;
      system_prompt?: string;
      greeting_message?: string | null;
      fallback_message?: string | null;
      ai_provider?: string;
      model_name?: string;
      temperature?: number;
      max_tokens?: number;
      is_active?: boolean;
    };
    try {
      const persona = await updatePersona(personaId, body);
      if (!persona) {
        res.status(404).json({ error: 'Persona not found' });
        return;
      }
      res.status(200).json(persona);
    } catch (err) {
      console.error('Update persona error:', err);
      const message = err instanceof Error ? err.message : 'Failed to update persona';
      res.status(400).json({ error: message });
    }
  }
);

export default router;
