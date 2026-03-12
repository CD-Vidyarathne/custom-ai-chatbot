import type React from "react";

export interface InitialFormValues {
  name: string;
  email: string;
  mobile: string;
}

export interface InitialFormProps {
  onComplete: (values: InitialFormValues) => void;
  loading?: boolean;
  error?: string | null;
}

export default function InitialForm({ onComplete, loading, error }: InitialFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const mobile = String(formData.get("mobile") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();

    if (!name || !mobile || !email) {
      return;
    }

    onComplete({ name, mobile, email });
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
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full rounded-lg bg-(--color-primary) py-3 font-semibold text-white transition-colors hover:bg-(--color-primary-dark) disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Starting..." : "Start Conversation"}
      </button>
    </form>
  );
}