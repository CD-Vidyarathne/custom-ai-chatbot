type Props = { className?: string };

export function LoadingSkeleton({ className = '' }: Props) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-(--color-bg-secondary) ${className}`}
      aria-hidden
    />
  );
}

export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3 border-b border-(--color-border)">
          <LoadingSkeleton className="h-4 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}
