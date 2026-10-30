"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { cn } from "@/shared/lib/cn.util";
import { leaveReviewAction } from "../api/leave-review.actions";

// interface
type ReviewFormProps = { appointmentId: string };

// component
export function ReviewForm({ appointmentId }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function submit() {
    setError("");
    startTransition(async () => {
      const result = await leaveReviewAction({ appointmentId, rating, comment });
      if (!result.ok) setError(result.error ?? "Помилка");
    });
  }

  // return
  return (
    <div className="space-y-3 rounded-xl border border-border p-3">
      <p className="text-sm font-medium">Оцініть візит</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button key={value} type="button" aria-label={`${value}`} onClick={() => setRating(value)}>
            <Star className={cn("size-6", value <= rating ? "fill-warn text-warn" : "text-muted")} />
          </button>
        ))}
      </div>
      <input
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={500}
        placeholder="Коментар (необов'язково)"
        className="input"
      />
      {error && <p className="text-sm text-danger">{error}</p>}
      <button className="btn-primary h-9" disabled={!rating || pending} onClick={submit}>
        Надіслати відгук
      </button>
    </div>
  );
}
