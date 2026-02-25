export default function Conversation() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4">
        <div className="flex max-w-[85%] flex-col gap-1 rounded-lg bg-white p-3 text-sm text-(--color-text-primary) shadow-sm ring-1 ring-(--color-border)">
          Hello! How can we help you today?
          <span className="text-[10px] text-(--color-text-muted)">
            10:45 AM
          </span>
        </div>
      </div>
      <div className="mt-4 flex gap-2 border-t border-(--color-border) pt-4">
        <input
          placeholder="Type a message..."
          className="flex-1 bg-transparent text-sm text-(--color-text-primary) focus:outline-none"
        />
        <button className="rounded-full bg-(--color-primary) p-2 text-white hover:bg-(--color-primary-dark)">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
