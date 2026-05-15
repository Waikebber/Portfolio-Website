"use client";

import { useState } from "react";

export function InviteForm({ onDismiss, onSuccess }: { onDismiss: () => void; onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function send() {
    setError(null);
    setSending(true);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setSent(true);
      setTimeout(onSuccess, 1000);
    } else {
      const { error: msg } = await res.json();
      setError(msg ?? "Failed to send invite");
    }
    setSending(false);
  }

  return (
    <div
      className="flex items-center gap-3 p-4 rounded-[10px] mb-8"
      style={{ background: "#141417", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && email.trim()) send();
          if (e.key === "Escape") onDismiss();
        }}
        placeholder="email@example.com"
        autoFocus
        className="flex-1 h-9 px-3 rounded-[6px] text-warm-white text-[14px] outline-none"
        style={{ background: "#19191d", border: "1px solid rgba(255,255,255,0.08)" }}
      />
      {error && <p className="text-[12px] shrink-0" style={{ color: "#e64d4d" }}>{error}</p>}
      <button
        onClick={send}
        disabled={!email.trim() || sending}
        className="h-9 px-4 rounded-[6px] text-[13px] font-medium cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 shrink-0"
        style={{ background: "#61c1d8", color: "#0d0d0f" }}
      >
        {sent ? "Sent!" : sending ? "Sending…" : "Send invite"}
      </button>
      <button
        onClick={onDismiss}
        className="text-muted hover:text-warm-white transition-colors cursor-pointer text-[14px] shrink-0"
      >
        ✕
      </button>
    </div>
  );
}
