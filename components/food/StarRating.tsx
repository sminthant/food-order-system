import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

export function StarRating({ rating, count }: { rating: number; count?: number }) {
  const filled = Math.round(rating);

  return (
    <span className="inline-flex items-center gap-1.5" aria-label={`Rated ${rating} out of 5`}>
      <span className="inline-flex" aria-hidden>
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            className={cn(
              "h-3.5 w-3.5",
              index < filled ? "fill-amber-400 text-amber-400" : "text-stone-300",
            )}
          />
        ))}
      </span>
      <span className="text-sm font-medium text-ink">{rating.toFixed(1)}</span>
      {typeof count === "number" ? (
        <span className="text-sm text-muted">({count})</span>
      ) : null}
    </span>
  );
}
