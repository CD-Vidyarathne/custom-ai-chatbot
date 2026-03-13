import { Router, type Request, type Response } from 'express';
import {
  createConversation,
  getConversationById,
  getConversationsByConsumer,
  getMessagesBySessionId,
  closeConversation,
  saveUserAndSystemMessages,
  getLastActivityAt,
} from '../services/chat.service.js';

const router = Router();

/** Inactivity window after which a session is considered expired (minutes). */
const INACTIVITY_MINUTES = 5;

/** Simulated AI reply - replace with real AI integration later */
const SIMULATED_AI_REPLY =
  "Thanks for your message! This is a simulated reply from the assistant. Real AI integration will be added later.";

/**
 * POST /api/chat/send
 * Send a message and receive a simulated AI response.
 * - New user (no conversation_id): pass persona_id, org_id (and optional consumer). Session is created, user message and system reply are saved.
 * - Existing session (conversation_id): if session inactive > 5 min it is closed and 410 returned; otherwise user + system reply are saved.
 */
router.post('/send', async (req: Request, res: Response) => {
  const body = req.body as {
    message?: unknown;
    conversation_id?: string;
    persona_id?: unknown;
    org_id?: unknown;
    consumer?: {
      name?: string | null;
      email?: string | null;
      phone_number?: string | null;
      fingerprint?: string | null;
    };
  };

  if (body.message === undefined || body.message === null || typeof body.message !== 'string') {
    res.status(400).json({ error: 'Missing or invalid "message" in request body' });
    return;
  }

  const trimmed = (body.message as string).trim();
  if (!trimmed) {
    res.status(400).json({ error: 'Message cannot be empty' });
    return;
  }

  try {
    let sessionId: string | null = body.conversation_id ?? null;

    if (sessionId) {
      const session = await getConversationById(sessionId);
      if (!session) {
        res.status(404).json({ error: 'Conversation not found' });
        return;
      }
      if (session.status !== 'active') {
        res.status(410).json({
          error: 'Session is closed',
          conversation_id: sessionId,
        });
        return;
      }
      const lastActivity = await getLastActivityAt(sessionId);
      const inactiveMs = Date.now() - lastActivity.getTime();
      if (inactiveMs >= INACTIVITY_MINUTES * 60 * 1000) {
        await closeConversation(sessionId);
        res.status(410).json({
          error: 'Session expired due to inactivity. Start a new conversation.',
          conversation_id: sessionId,
        });
        return;
      }
    } else {
      const personaId = typeof body.persona_id === 'string' ? body.persona_id : undefined;
      const orgId = typeof body.org_id === 'string' ? body.org_id : undefined;
      if (!personaId || !orgId) {
        res.status(400).json({
          error: 'Missing "persona_id" or "org_id" when starting a new conversation',
        });
        return;
      }
      const { session_id } = await createConversation({
        persona_id: personaId,
        org_id: orgId,
        consumer: body.consumer,
      });
      sessionId = session_id;
    }

    await saveUserAndSystemMessages(sessionId, trimmed, SIMULATED_AI_REPLY);

    res.status(200).json({
      reply: SIMULATED_AI_REPLY,
      conversation_id: sessionId,
    });
  } catch (err) {
    console.error('Chat send error:', err);
    res.status(500).json({
      error: err instanceof Error ? err.message : 'Failed to process message',
    });
  }
});

/**
 * POST /api/chat/conversations
 * Create a new conversation (consumer + chat session).
 * Body: { persona_id, org_id, consumer?: { name?, email?, phone_number?, fingerprint? } }
 */
router.post('/conversations', async (req: Request, res: Response) => {
  const body = req.body as {
    persona_id?: unknown;
    org_id?: unknown;
    consumer?: {
      name?: string | null;
      email?: string | null;
      phone_number?: string | null;
      fingerprint?: string | null;
    };
  };

  const personaId = typeof body.persona_id === 'string' ? body.persona_id : undefined;
  const orgId = typeof body.org_id === 'string' ? body.org_id : undefined;

  if (!personaId || !orgId) {
    res.status(400).json({
      error: 'Missing or invalid "persona_id" or "org_id" in request body',
    });
    return;
  }

  try {
    const result = await createConversation({
      persona_id: personaId,
      org_id: orgId,
      consumer: body.consumer,
    });
    res.status(201).json({
      conversation_id: result.session_id,
      consumer_id: result.consumer_id,
    });
  } catch (err) {
    console.error('Create conversation error:', err);
    res.status(500).json({
      error: err instanceof Error ? err.message : 'Failed to create conversation',
    });
  }
});

/**
 * GET /api/chat/conversations?consumer_id=xxx
 * List conversations for a consumer.
 */
router.get('/conversations', async (req: Request, res: Response) => {
  const consumerId = req.query.consumer_id;
  if (typeof consumerId !== 'string' || !consumerId.trim()) {
    res.status(400).json({ error: 'Query "consumer_id" is required' });
    return;
  }

  try {
    const conversations = await getConversationsByConsumer(consumerId.trim());
    res.status(200).json({ conversations });
  } catch (err) {
    console.error('List conversations error:', err);
    res.status(500).json({
      error: err instanceof Error ? err.message : 'Failed to list conversations',
    });
  }
});

/**
 * GET /api/chat/conversations/:id
 * Get a single conversation by session_id.
 */
router.get('/conversations/:id', async (req: Request, res: Response) => {
  const sessionId = typeof req.params.id === 'string' ? req.params.id : '';
  if (!sessionId) {
    res.status(400).json({ error: 'Conversation id is required' });
    return;
  }

  try {
    const conversation = await getConversationById(sessionId);
    if (!conversation) {
      res.status(404).json({ error: 'Conversation not found' });
      return;
    }
    res.status(200).json(conversation);
  } catch (err) {
    console.error('Get conversation error:', err);
    res.status(500).json({
      error: err instanceof Error ? err.message : 'Failed to get conversation',
    });
  }
});

/**
 * GET /api/chat/conversations/:id/messages
 * Get messages for a conversation.
 */
router.get('/conversations/:id/messages', async (req: Request, res: Response) => {
  const sessionId = typeof req.params.id === 'string' ? req.params.id : '';
  if (!sessionId) {
    res.status(400).json({ error: 'Conversation id is required' });
    return;
  }

  try {
    const session = await getConversationById(sessionId);
    if (!session) {
      res.status(404).json({ error: 'Conversation not found' });
      return;
    }
    const messages = await getMessagesBySessionId(sessionId);
    res.status(200).json({ messages });
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({
      error: err instanceof Error ? err.message : 'Failed to get messages',
    });
  }
});

/**
 * PUT /api/chat/conversations/:id/close
 * Close a conversation.
 */
router.put('/conversations/:id/close', async (req: Request, res: Response) => {
  const sessionId = typeof req.params.id === 'string' ? req.params.id : '';
  if (!sessionId) {
    res.status(400).json({ error: 'Conversation id is required' });
    return;
  }

  try {
    const session = await getConversationById(sessionId);
    if (!session) {
      res.status(404).json({ error: 'Conversation not found' });
      return;
    }
    await closeConversation(sessionId);
    res.status(200).json({ status: 'closed', conversation_id: sessionId });
  } catch (err) {
    console.error('Close conversation error:', err);
    res.status(500).json({
      error: err instanceof Error ? err.message : 'Failed to close conversation',
    });
  }
});

export default router;
