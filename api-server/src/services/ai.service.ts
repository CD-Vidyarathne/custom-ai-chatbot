import OpenAI from 'openai';
import { getPersonaById } from './persona.service.js';
import { getMessagesBySessionId } from './chat.service.js';
import type { MessageRow } from './chat.service.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface GenerateChatResponseResult {
  content: string;
  tokensUsed: number | null;
}


function buildChatMessages(
  systemPrompt: string,
  history: MessageRow[],
  userMessage: string
): OpenAI.Chat.ChatCompletionMessageParam[] {
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
  ];


  for (const msg of history) {
    if (msg.msg_source === 'user') {
      messages.push({ role: 'user', content: msg.content });
    } else if (msg.msg_source === 'assistant') {
      messages.push({ role: 'assistant', content: msg.content });
    }
  }

  messages.push({ role: 'user', content: userMessage });

  return messages;
}


export async function generateChatResponse(
  sessionId: string,
  personaId: string,
  userMessage: string
): Promise<GenerateChatResponseResult> {
  const persona = await getPersonaById(personaId);
  if (!persona) {
    throw new Error('Persona not found');
  }

  if (persona.ai_provider?.toLowerCase() !== 'openai') {
    const fallback =
      persona.fallback_message ??
      "I'm sorry, this persona is not configured for OpenAI. Please contact support.";
    return { content: fallback, tokensUsed: null };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey?.trim()) {
    const fallback =
      persona.fallback_message ??
      "I'm sorry, the AI service is not configured. Please try again later.";
    return { content: fallback, tokensUsed: null };
  }

  try {
    const history = await getMessagesBySessionId(sessionId);
    const messages = buildChatMessages(persona.system_prompt, history, userMessage);

    const completion = await openai.chat.completions.create({
      model: persona.model_name || 'gpt-4o',
      messages,
      temperature: Math.min(1, Math.max(0, persona.temperature ?? 0.7)),
      max_tokens: persona.max_tokens ?? 1024,
    });

    const content = completion.choices[0]?.message?.content?.trim() ?? '';
    const tokensUsed =
      completion.usage?.total_tokens != null ? completion.usage.total_tokens : null;

    if (!content && persona.fallback_message) {
      return { content: persona.fallback_message, tokensUsed };
    }

    return {
      content: content || persona.fallback_message || "I'm sorry, I couldn't generate a response.",
      tokensUsed,
    };
  } catch (err) {
    console.error('OpenAI API error:', err);

    const fallback =
      persona.fallback_message ??
      "I'm sorry, I encountered an error processing your request. Please try again.";

    return { content: fallback, tokensUsed: null };
  }
}
