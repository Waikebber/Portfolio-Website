"use client";

import type { AdminUser, OnboardingStatus } from "@/hooks/admin/useUsers";

const selectStyle = {
  background: "#19191d",
  border: "1px solid rgba(255,255,255,0.08)",
  outline: "none",
  cursor: "pointer",
};

function onboardingStep(o: OnboardingStatus | null): { label: string; color: string; complete: boolean } {
  if (!o || !o.invite_clicked_at) return { label: "Invite sent", color: "#888", complete: false };
  if (!o.password_set_at) return { label: "Setting password", color: "#e6a028", complete: false };
  if (!o.totp_enabled_at) return { label: "2FA setup pending", color: "#e6a028", complete: false };
  return { label: "Active", color: "#4caf82", complete: true };
}

export function UserRow({
  user,
  updating,
  revoking,
  onRoleChange,
  onRevoke,
}: {
  user: AdminUser;
  updating: boolean;
  revoking: boolean;
  onRoleChange: (role: string) => void;
  onRevoke: () => void;
}) {
  const initial = user.email[0].toUpperCase();
  const joined = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const step = onboardingStep(user.onboarding);

  return (
    <div
      className="flex flex-col gap-3 px-5 py-4 rounded-[10px] sm:flex-row sm:items-center"
      style={{ background: "#141417", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className="rounded-full flex items-center justify-center font-medium shrink-0"
          style={{
            width: "2.375rem",
            height: "2.375rem",
            fontSize: "0.75rem",
            background: "rgba(97,193,216,0.12)",
            color: "#61c1d8",
          }}
        >
          {initial}
        </div>
        <div className="min-w-0">
          <p className="text-warm-white font-medium truncate" style={{ fontSize: "0.8125rem" }}>{user.email}</p>
          <p className="text-muted" style={{ fontSize: "0.6875rem", marginTop: "0.125rem" }}>
            Joined {joined}
            <span style={{ color: step.color }}> · {step.label}</span>
            {step.complete && <span style={{ color: "#4caf82" }}> ✓</span>}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <select
          value={user.role}
          disabled={updating}
          onChange={(e) => onRoleChange(e.target.value)}
          className="flex-1 sm:flex-none h-8 px-2 rounded-[6px] text-warm-white text-[12px] disabled:opacity-50"
          style={selectStyle}
        >
          <option value="guest-admin">Guest</option>
          <option value="full-admin">Full Admin</option>
        </select>
        <button
          onClick={onRevoke}
          disabled={revoking}
          className="h-8 px-3 rounded-[6px] text-[12px] cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-50 whitespace-nowrap"
          style={{ border: "1px solid #bf4d4d", color: "#bf4d4d", background: "transparent" }}
        >
          {revoking ? "Revoking…" : "Revoke"}
        </button>
      </div>
    </div>
  );
}
