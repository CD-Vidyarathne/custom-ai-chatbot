export interface ConversationMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
  pending?: boolean;
  error?: boolean;
}

export interface ConversationProps {
  messages: ConversationMessage[];
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  sending: boolean;
  error?: string | null;
}

export default function Conversation({
  messages,
  input,
  onInputChange,
  onSend,
  sending,
  error,
}: ConversationProps) {
  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!sending && input.trim()) {
        onSend();
      }
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex max-w-[85%] flex-col gap-1 rounded-lg p-3 text-sm shadow-sm ring-1 ${
                isUser
                  ? "ml-auto bg-(--color-primary) text-white ring-(--color-primary-dark)"
                  : "bg-white text-(--color-text-primary) ring-(--color-border)"
              }`}
            >
              <p>{msg.content}</p>
              <div className="flex items-center justify-between text-[10px] text-(--color-text-muted)">
                <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                {msg.pending ? (
                  <span>{isUser ? "Sending..." : "Thinking..."}</span>
                ) : msg.error ? (
                  <span className="text-red-500">Failed</span>
                ) : null}
              </div>
            </div>
          );
        })}
        {messages.length === 0 ? (
          <div className="rounded-lg bg-(--color-bg-glass) p-3 text-xs text-(--color-text-muted)">
            Say hi to start the conversation. Our assistant will reply in a moment.
          </div>
        ) : null}
      </div>
      <div className="mt-4 flex flex-col gap-2 border-t border-(--color-border) pt-3">
        {error ? (
          <p className="text-xs text-red-600" role="alert">
            {error}
          </p>
        ) : null}
        <div className="flex gap-2">
          <input
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-sm text-(--color-text-primary) focus:outline-none"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Chat message"
          />
          <button
            type="button"
            onClick={onSend}
            disabled={sending || !input.trim()}
            className="rounded-full bg-(--color-primary) p-2 text-white hover:bg-(--color-primary-dark) disabled:cursor-not-allowed disabled:opacity-70"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
            <span className="sr-only">Send message</span>
          </button>
        </div>
      </div>
    </div>
  );
}

