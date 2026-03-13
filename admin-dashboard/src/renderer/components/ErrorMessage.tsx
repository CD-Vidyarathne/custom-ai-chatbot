type Props = {
  message: string;
  onRetry?: () => void;
  className?: string;
};

export function ErrorMessage({ message, onRetry, className = '' }: Props) {
  return (
    <div
      className={`rounded-xl border border-(--color-danger) bg-red-50/50 p-4 text-(--color-text-primary) ${className}`}
      role="alert"
    >
      <p className="text-(--color-danger) font-medium">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 text-sm text-(--color-primary) hover:underline"
        >
          Retry
        </button>
      )}
    </div>
  );
}
