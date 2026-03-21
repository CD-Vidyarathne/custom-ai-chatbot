import { GoogleGenerativeAI } from '@google/generative-ai';
import { getPersonaById } from './persona.service.js';
import { getMessagesBySessionId } from './chat.service.js';
import type { MessageRow } from './chat.service.js';

export interface GenerateChatResponseResult {
  content: string;
  tokensUsed: number | null;
}

const DEFAULT_SIMULATED_REPLY =
  "Thanks for your message! This is a simulated reply from the assistant. AI integration is currently disabled.";

async function getGeminiResponse(
  systemPrompt: string,
  history: MessageRow[],
  userMessage: string,
  modelName: string,
  temperature: number,
  maxTokens: number
): Promise<GenerateChatResponseResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName || 'gemini-1.5-flash',
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature: Math.min(1, Math.max(0, temperature ?? 0.7)),
      maxOutputTokens: maxTokens ?? 1024,
    }
  });

  const chatHistory = history.map(msg => ({
    role: msg.msg_source === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  const chat = model.startChat({
    history: chatHistory,
  });

  const result = await chat.sendMessage(userMessage);
  const response = result.response;
  
  return {
    content: response.text(),
    tokensUsed: response.usageMetadata?.totalTokenCount ?? null
  };
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

  const enableAi = process.env.ENABLE_AI?.toLowerCase() === 'true' || process.env.ENABLE_AI === '1';
  if (!enableAi) {
    const fallback = DEFAULT_SIMULATED_REPLY;
    return { content: fallback, tokensUsed: null };
  }

  try {
    const history = await getMessagesBySessionId(sessionId);
    return await getGeminiResponse(
      persona.system_prompt,
      history,
      userMessage,
      persona.model_name || 'gemini-1.5-flash',
      persona.temperature ?? 0.7,
      persona.max_tokens ?? 1024
    );
  } catch (err) {
    console.error('Gemini API error:', err);
    return { content: "Assistant is temporarily unavailable", tokensUsed: null };
  }
}
