"use client";
import { useEffect, useMemo, useState } from "react";
import InitialForm from "./InitialForm";
import type { InitialFormValues } from "./InitialForm";
import Conversation, { type ConversationMessage } from "./Conversation";
import {
  CHAT_STORAGE_KEYS,
  createConversationApi,
  getMessagesApi,
  getPersonaByOrgOrId,
  sendMessageApi,
  type ChatMessage,
} from "@/lib/api";

type Step = "form" | "chat";

const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID as string | undefined;
const PERSONA_ID = process.env.NEXT_PUBLIC_PERSONA_ID as string | undefined;

function mapApiMessages(messages: ChatMessage[]): ConversationMessage[] {
  return messages.map((m) => ({
    id: m.msg_id,
    role: m.msg_source === "system" ? "assistant" : m.msg_source,
    content: m.content,
    createdAt: m.created_at,
  }));
}

export default function ChatWindow({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>("form");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [consumerId, setConsumerId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [input, setInput] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const hasBackendConfig = useMemo(() => Boolean(ORG_ID), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedConversationId = window.localStorage.getItem(
      CHAT_STORAGE_KEYS.conversationId,
    );
    const storedConsumerId = window.localStorage.getItem(
      CHAT_STORAGE_KEYS.consumerId,
    );

    if (storedConversationId) {
      setConversationId(storedConversationId);
    }
    if (storedConsumerId) {
      setConsumerId(storedConsumerId);
    }
  }, []);

  useEffect(() => {
    if (!conversationId || !hasBackendConfig) return;

    let cancelled = false;

    const load = async () => {
      try {
        const { messages: apiMessages } = await getMessagesApi(conversationId);
        if (cancelled) return;
        setMessages(mapApiMessages(apiMessages));
        setStep("chat");
      } catch {
      }
    };

    load();

    const interval = window.setInterval(load, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [conversationId, hasBackendConfig]);

  const handleFormComplete = async (values: InitialFormValues) => {
    if (!hasBackendConfig) {
      setFormError(
        "Chat backend is not configured. Please set NEXT_PUBLIC_ORG_ID in the environment.",
      );
      return;
    }

    setFormLoading(true);
    setFormError(null);
    try {
      const persona =
        PERSONA_ID || !ORG_ID
          ? await getPersonaByOrgOrId({
              personaId: PERSONA_ID,
              orgId: ORG_ID,
            })
          : await getPersonaByOrgOrId({ orgId: ORG_ID });

      const result = await createConversationApi({
        personaId: persona.persona_id,
        orgId: persona.org_id,
        consumer: {
          name: values.name,
          email: values.email,
          phone_number: values.mobile,
        },
      });

      setConversationId(result.conversation_id);
      setConsumerId(result.consumer_id);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          CHAT_STORAGE_KEYS.conversationId,
          result.conversation_id,
        );
        window.localStorage.setItem(
          CHAT_STORAGE_KEYS.consumerId,
          result.consumer_id,
        );
      }

      setStep("chat");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to start conversation";
      setFormError(message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || sending) return;
    setSendError(null);

    const now = new Date().toISOString();
    const tempUserId = `local-user-${now}`;
    const tempAssistantId = `local-assistant-${now}`;

    const nextMessages: ConversationMessage[] = [
      ...messages,
      {
        id: tempUserId,
        role: "user",
        content: trimmed,
        createdAt: now,
        pending: true,
      },
      {
        id: tempAssistantId,
        role: "assistant",
        content: "Thinking...",
        createdAt: now,
        pending: true,
      },
    ];

    setMessages(nextMessages);
    setInput("");
    setSending(true);

    try {
      const result = await sendMessageApi({
        message: trimmed,
        conversationId: conversationId ?? undefined,
        personaId: undefined,
        orgId: undefined,
        consumer: conversationId
          ? undefined
          : consumerId
            ? { fingerprint: consumerId }
            : undefined,
      });

      const updated = nextMessages.map((m) => {
        if (m.id === tempUserId) {
          return { ...m, pending: false };
        }
        if (m.id === tempAssistantId) {
          return {
            ...m,
            pending: false,
            content: result.reply,
            createdAt: new Date().toISOString(),
          };
        }
        return m;
      });

      setMessages(updated);

      if (!conversationId && result.conversation_id) {
        setConversationId(result.conversation_id);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(
            CHAT_STORAGE_KEYS.conversationId,
            result.conversation_id,
          );
        }
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to send message";
      setSendError(message);
      setMessages((current) =>
        current.map((m) =>
          m.id === tempUserId || m.id === tempAssistantId
            ? { ...m, pending: false, error: true }
            : m,
        ),
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-[550px] w-[380px] flex-col overflow-hidden rounded-2xl bg-(--color-bg-primary) shadow-2xl ring-1 ring-(--color-border) animate-in slide-in-from-bottom-5 duration-300">
      <header className="flex items-center justify-between bg-(--color-primary) p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 overflow-hidden rounded-full bg-(--color-bg-secondary) ring-1 ring-white/20">
            <img
              src="/sinofetch-assistant.svg"
              alt="Sinofetch Assistant"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="leading-tight">
            <h3 className="text-sm font-semibold">Sinofetch Assistant</h3>
            <p className="text-xs text-white/80">Logistics support</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1 hover:bg-white/10"
          aria-label="Close chat"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        {step === "form" ? (
          <InitialForm
            onComplete={handleFormComplete}
            loading={formLoading}
            error={formError}
          />
        ) : (
          <Conversation
            messages={messages}
            input={input}
            onInputChange={setInput}
            onSend={handleSend}
            sending={sending}
            error={sendError}
          />
        )}
      </div>
    </div>
  );
}

