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
          Welcome to Sinofetch Assistant
        </h2>
        <p className="text-sm text-(--color-text-muted)">
          Enter your name, mobile number, and email to begin.
        </p>
      </div>
      <input
        required
        type="text"
        placeholder="Your Name"
        name="name"
        autoComplete="name"
        className="w-full rounded-lg border border-(--color-border) bg-white p-3 text-sm text-(--color-text-primary) focus:border-(--color-primary) focus:outline-none"
      />
      <input
        required
        type="tel"
        placeholder="Mobile Number"
        name="mobile"
        autoComplete="tel"
        className="w-full rounded-lg border border-(--color-border) bg-white p-3 text-sm text-(--color-text-primary) focus:border-(--color-primary) focus:outline-none"
      />
      <input
        required
        type="email"
        placeholder="Email Address"
        name="email"
        autoComplete="email"
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