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
  ApiError,
  captureLeadApi,
} from "@/lib/api";

type Step = "form" | "chat";

const ORG_ID_ENV = process.env.NEXT_PUBLIC_ORG_ID as string | undefined;

function mapApiMessages(messages: ChatMessage[]): ConversationMessage[] {
  return messages.map((m) => ({
    id: m.msg_id,
    role: m.msg_source === "system" ? "assistant" : m.msg_source,
    content: m.content,
    createdAt: m.created_at,
  }));
}

export default function ChatWindow({ onClose }: { onClose: () => void }) {
  const effectiveOrgId =
    typeof window !== "undefined"
      ? (() => {
          try {
            const url = new URL(window.location.href);
            const fromQuery =
              url.searchParams.get("org_id") ?? url.searchParams.get("chatId");
            if (fromQuery) return fromQuery;
            const parts = url.pathname.split("/").filter(Boolean);
            const embedIndex = parts.indexOf("embed");
            if (embedIndex !== -1 && parts[embedIndex + 1]) {
              return parts[embedIndex + 1];
            }
          } catch {
            // ignore parsing errors and fall back to env
          }
          return ORG_ID_ENV ?? null;
        })()
      : ORG_ID_ENV ?? null;
  const [step, setStep] = useState<Step>("form");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [consumerId, setConsumerId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [input, setInput] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [storedLead, setStoredLead] = useState<InitialFormValues | null>(null);
  const [autoStartingFromLead, setAutoStartingFromLead] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);

  const hasBackendConfig = useMemo(
    () => Boolean(effectiveOrgId),
    [effectiveOrgId],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedConversationId = window.localStorage.getItem(
      CHAT_STORAGE_KEYS.conversationId,
    );
    const storedConsumerId = window.localStorage.getItem(
      CHAT_STORAGE_KEYS.consumerId,
    );
    const storedLeadInfo = window.localStorage.getItem(
      CHAT_STORAGE_KEYS.leadInfo,
    );
    const storedLeadCaptured = window.localStorage.getItem(
      CHAT_STORAGE_KEYS.leadCaptured,
    );

    if (storedConversationId) {
      setConversationId(storedConversationId);
    }
    if (storedConsumerId) {
      setConsumerId(storedConsumerId);
    }
    if (storedLeadInfo) {
      try {
        const parsed = JSON.parse(storedLeadInfo) as InitialFormValues;
        setStoredLead(parsed);
      } catch {
        // ignore parse errors
      }
    }
    if (storedLeadCaptured === "true") {
      setLeadCaptured(true);
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

    void load();

    const interval = window.setInterval(load, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [conversationId, hasBackendConfig]);

  // If user has already submitted lead info before (stored in localStorage),
  // automatically start a new conversation for them when there is no active one.
  useEffect(() => {
    if (
      !hasBackendConfig ||
      conversationId ||
      !storedLead ||
      autoStartingFromLead ||
      !effectiveOrgId
    ) {
      return;
    }

    setAutoStartingFromLead(true);
    setFormError(null);

    const startFromStoredLead = async () => {
      try {
        const persona = await getPersonaByOrgOrId({ orgId: effectiveOrgId });
        const result = await createConversationApi({
          personaId: persona.persona_id,
          orgId: persona.org_id,
          consumer: {
            name: storedLead.name,
            email: storedLead.email,
            phone_number: storedLead.mobile,
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
        try {
          const { messages: apiMessages } = await getMessagesApi(
            result.conversation_id,
          );
          setMessages(mapApiMessages(apiMessages));
        } catch {
          // ignore initial load failure, poller will retry
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to start conversation";
        setFormError(message);
        setStep("form");
      } finally {
        setAutoStartingFromLead(false);
      }
    };

    void startFromStoredLead();
  }, [
    hasBackendConfig,
    conversationId,
    storedLead,
    autoStartingFromLead,
    effectiveOrgId,
  ]);

  const handleFormComplete = async (values: InitialFormValues) => {
    if (!hasBackendConfig || !effectiveOrgId) {
      setFormError(
        "Chat backend is not configured. Please set NEXT_PUBLIC_ORG_ID in the environment.",
      );
      return;
    }

    setFormLoading(true);
    setFormError(null);
    try {
      const persona = await getPersonaByOrgOrId({ orgId: effectiveOrgId });
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
        window.localStorage.setItem(
          CHAT_STORAGE_KEYS.leadInfo,
          JSON.stringify(values),
        );
      }

      setStoredLead(values);

      setStep("chat");
      // Immediately load initial messages (including greeting) instead of waiting for the poller.
      try {
        const { messages: apiMessages } = await getMessagesApi(
          result.conversation_id,
        );
        setMessages(mapApiMessages(apiMessages));
      } catch {
        // ignore initial load failure, poller will retry
      }
      // Capture lead (once) so it appears in qualified_lead and marks session as lead_captured.
      if (!leadCaptured) {
        try {
          await captureLeadApi({ sessionId: result.conversation_id });
          setLeadCaptured(true);
          if (typeof window !== "undefined") {
            window.localStorage.setItem(
              CHAT_STORAGE_KEYS.leadCaptured,
              "true",
            );
          }
        } catch {
          // Ignore capture failures in the widget; admin can still create leads from the dashboard.
        }
      }
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
      // If the session has expired or been closed (HTTP 410), automatically
      // start a new conversation (when we have stored lead info) and retry once.
      if (err instanceof ApiError && err.status === 410) {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(CHAT_STORAGE_KEYS.conversationId);
        }
        setConversationId(null);

        if (hasBackendConfig && effectiveOrgId && storedLead) {
          try {
            const persona = await getPersonaByOrgOrId({
              orgId: effectiveOrgId,
            });
            const conv = await createConversationApi({
              personaId: persona.persona_id,
              orgId: persona.org_id,
              consumer: {
                name: storedLead.name,
                email: storedLead.email,
                phone_number: storedLead.mobile,
              },
            });

            setConversationId(conv.conversation_id);
            setConsumerId(conv.consumer_id);
            if (typeof window !== "undefined") {
              window.localStorage.setItem(
                CHAT_STORAGE_KEYS.conversationId,
                conv.conversation_id,
              );
              window.localStorage.setItem(
                CHAT_STORAGE_KEYS.consumerId,
                conv.consumer_id,
              );
            }

            const resendResult = await sendMessageApi({
              message: trimmed,
              conversationId: conv.conversation_id,
            });

            const updatedAfterRestart = nextMessages.map((m) => {
              if (m.id === tempUserId) {
                return { ...m, pending: false };
              }
              if (m.id === tempAssistantId) {
                return {
                  ...m,
                  pending: false,
                  content: resendResult.reply,
                  createdAt: new Date().toISOString(),
                };
              }
              return m;
            });

            setMessages(updatedAfterRestart);
            setSendError(null);
            return;
          } catch (retryErr) {
            const message =
              retryErr instanceof Error
                ? retryErr.message
                : "Session expired and failed to restart conversation.";
            setSendError(message);
            setMessages((current) =>
              current.map((m) =>
                m.id === tempUserId || m.id === tempAssistantId
                  ? { ...m, pending: false, error: true }
                  : m,
              ),
            );
            return;
          }
        }
      }

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

