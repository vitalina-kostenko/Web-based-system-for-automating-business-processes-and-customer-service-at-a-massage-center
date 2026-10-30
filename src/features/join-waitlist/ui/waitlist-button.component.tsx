"use client";

import { useState, useTransition } from "react";
import { BellRing } from "lucide-react";
import { joinWaitlistAction } from "../api/join-waitlist.actions";

// interface
type WaitlistButtonProps = { serviceId: string; masterId: string; date: string };

// component
export function WaitlistButton({ serviceId, masterId, date }: WaitlistButtonProps) {
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  // return
  return (
    <div className="space-y-2">
      <button
        type="button"
        className="btn-outline"
        disabled={pending}
        onClick={() => startTransition(async () => setMessage((await joinWaitlistAction({ serviceId, masterId, date })).message))}
      >
        <BellRing className="size-4" /> Повідомити, якщо час звільниться
      </button>
      {message && <p className="text-sm text-muted">{message}</p>}
    </div>
  );
}
