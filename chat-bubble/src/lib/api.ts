const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL as string | undefined) ?? "http://localhost:8080";

export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  msg_id: string;
  session_id: string;
  sequence_no: number;
  msg_source: MessageRole;
  content: string;
  created_at: string;
}

export interface Persona {
  persona_id: string;
  org_id: string;
  name: string;
  system_prompt: string;
  greeting_message: string | null;
  fallback_message: string | null;
}

interface ConsumerInput {
  name?: string;
  email?: string;
  phone_number?: string;
  fingerprint?: string;
}

export interface CreateConversationResult {
  conversation_id: string;
  consumer_id: string;
}

export interface SendMessageResult {
  reply: string;
  conversation_id: string;
}

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

async function request<T>(
  path: string,
  options: RequestInit & { params?: Record<string, string> } = {},
): Promise<T> {
  const { params, ...init } = options;
  const url = new URL(path.startsWith("http") ? path : `${API_BASE_URL}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body != null) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url.toString(), { ...init, headers });
  const body = (await res.json().catch(() => ({}))) as unknown;

  if (!res.ok) {
    const message =
      (body as { error?: string }).error ??
      (body as { message?: string }).message ??
      res.statusText;
    throw new ApiError(
      message || `Request failed with status ${res.status}`,
      res.status,
      body,
    );
  }

  return body as T;
}

export async function getPersonaByOrgOrId(params: {
  orgId?: string;
  personaId?: string;
}): Promise<Persona> {
  if (!params.orgId && !params.personaId) {
    throw new Error("orgId or personaId is required");
  }

  const searchParams: Record<string, string> = {};
  if (params.orgId) searchParams.org_id = params.orgId;
  if (params.personaId) searchParams.persona_id = params.personaId;

  return request<Persona>("/api/persona", { params: searchParams });
}

export async function createConversationApi(input: {
  personaId: string;
  orgId: string;
  consumer: ConsumerInput;
}): Promise<CreateConversationResult> {
  return request<CreateConversationResult>("/api/chat/conversations", {
    method: "POST",
    body: JSON.stringify({
      persona_id: input.personaId,
      org_id: input.orgId,
      consumer: input.consumer,
    }),
  });
}

export async function sendMessageApi(input: {
  message: string;
  conversationId?: string;
  personaId?: string;
  orgId?: string;
  consumer?: ConsumerInput;
}): Promise<SendMessageResult> {
  return request<SendMessageResult>("/api/chat/send", {
    method: "POST",
    body: JSON.stringify({
      message: input.message,
      conversation_id: input.conversationId,
      persona_id: input.personaId,
      org_id: input.orgId,
      consumer: input.consumer,
    }),
  });
}

export async function getMessagesApi(
  conversationId: string,
): Promise<{ messages: ChatMessage[] }> {
  return request<{ messages: ChatMessage[] }>(
    `/api/chat/conversations/${conversationId}/messages`,
  );
}

export const CHAT_STORAGE_KEYS = {
  conversationId: "cb_conversation_id",
  consumerId: "cb_consumer_id",
  leadInfo: "cb_lead_info",
} as const;

