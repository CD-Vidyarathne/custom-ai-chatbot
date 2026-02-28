export default function ChatBubble({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative h-16 w-16 animate-bounce cursor-pointer rounded-full border-4 border-white bg-(--color-primary) shadow-xl transition-transform hover:scale-110 active:scale-95"
      style={{ animationDuration: "3s" }}
    >
      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full">
        <img
          src="/api/placeholder/64/64"
          alt="Avatar"
          className="h-full w-full object-cover"
        />
      </div>
      <span className="absolute right-0 top-0 flex h-4 w-4">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--color-success) opacity-75" />
        <span className="relative inline-flex h-4 w-4 rounded-full bg-(--color-success)" />
      </span>
    </button>
  );
}
