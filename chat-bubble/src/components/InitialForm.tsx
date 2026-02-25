export default function InitialForm({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-(--color-primary)">
          Welcome! 👋
        </h2>
        <p className="text-sm text-(--color-text-muted)">
          Fill out the form to start chatting.
        </p>
      </div>
      <input
        required
        type="text"
        placeholder="Your Name"
        className="w-full rounded-lg border border-(--color-border) bg-white p-3 text-sm text-(--color-text-primary) focus:border-(--color-primary) focus:outline-none"
      />
      <input
        required
        type="email"
        placeholder="Email Address"
        className="w-full rounded-lg border border-(--color-border) bg-white p-3 text-sm text-(--color-text-primary) focus:border-(--color-primary) focus:outline-none"
      />
      <button
        type="submit"
        className="mt-2 w-full rounded-lg bg-(--color-primary) py-3 font-semibold text-white transition-colors hover:bg-(--color-primary-dark)"
      >
        Start Conversation
      </button>
    </form>
  );
}
