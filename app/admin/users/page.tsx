"use client";

import { useEffect, useState } from "react";

interface AdminUser {
  id: string;
  email: string;
  role: "full-admin" | "guest-admin";
  created_at: string;
}

const selectStyle = {
  background: "#19191d",
  border: "1px solid rgba(255,255,255,0.08)",
  outline: "none",
  cursor: "pointer",
};

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSent, setInviteSent] = useState(false);

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    if (res.ok) setUsers(await res.json());
    setLoading(false);
  }

  function openInvite() {
    setInviteEmail("");
    setInviteError(null);
    setInviteSent(false);
    setShowInvite(true);
  }

  async function sendInvite() {
    setInviteError(null);
    setSending(true);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inviteEmail }),
    });
    if (res.ok) {
      setInviteSent(true);
      setInviteEmail("");
      setTimeout(() => { setInviteSent(false); setShowInvite(false); }, 2000);
    } else {
      const { error } = await res.json();
      setInviteError(error ?? "Failed to send invite");
    }
    setSending(false);
  }

  async function updateRole(userId: string, role: string) {
    setUpdating(userId);
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, role }),
    });
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: role as AdminUser["role"] } : u));
    setUpdating(null);
  }

  async function revoke(userId: string) {
    setRevoking(userId);
    const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    if (res.ok) setUsers((prev) => prev.filter((u) => u.id !== userId));
    setRevoking(null);
  }

  const fullAdmins = users.filter((u) => u.role === "full-admin");
  const guests = users.filter((u) => u.role === "guest-admin");

  return (
    <div className="max-w-[860px]">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-warm-white text-[32px] font-medium">Users</h1>
          <p className="text-muted text-[14px] mt-1">All users with admin access, excluding you.</p>
        </div>
        <button
          onClick={openInvite}
          className="h-9 px-4 flex items-center rounded-[8px] text-[13px] shrink-0 mt-1 cursor-pointer hover:opacity-90 transition-opacity"
          style={{ background: "#141417", border: "1px solid rgba(255,255,255,0.08)", color: "#61c1d8" }}
        >
          + Invite user
        </button>
      </div>

      {/* Invite form */}
      {showInvite && (
        <div
          className="flex items-center gap-3 p-4 rounded-[10px] mb-8"
          style={{ background: "#141417", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && inviteEmail.trim()) sendInvite();
              if (e.key === "Escape") setShowInvite(false);
            }}
            placeholder="email@example.com"
            autoFocus
            className="flex-1 h-9 px-3 rounded-[6px] text-warm-white text-[14px] outline-none"
            style={{ background: "#19191d", border: "1px solid rgba(255,255,255,0.08)" }}
          />
          {inviteError && (
            <p className="text-[12px] shrink-0" style={{ color: "#e64d4d" }}>{inviteError}</p>
          )}
          <button
            onClick={sendInvite}
            disabled={!inviteEmail.trim() || sending}
            className="h-9 px-4 rounded-[6px] text-[13px] font-medium cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 shrink-0"
            style={{ background: "#61c1d8", color: "#0d0d0f" }}
          >
            {inviteSent ? "Sent!" : sending ? "Sending…" : "Send invite"}
          </button>
          <button
            onClick={() => setShowInvite(false)}
            className="text-muted hover:text-warm-white transition-colors cursor-pointer text-[14px] shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      {/* User list */}
      {loading ? (
        <p className="text-muted text-[13px]">Loading…</p>
      ) : users.length === 0 ? (
        <p className="text-muted text-[13px]">No other users yet.</p>
      ) : (
        <div className="flex flex-col gap-10">
          {[
            { label: "Full Admin", items: fullAdmins },
            { label: "Guest", items: guests },
          ].map(({ label, items }) =>
            items.length === 0 ? null : (
              <div key={label}>
                <p className="text-muted text-[11px] tracking-[1.1px] uppercase mb-4">{label}</p>
                <div className="flex flex-col gap-2">
                  {items.map((user) => (
                    <UserRow
                      key={user.id}
                      user={user}
                      updating={updating === user.id}
                      revoking={revoking === user.id}
                      onRoleChange={(role) => updateRole(user.id, role)}
                      onRevoke={() => revoke(user.id)}
                    />
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

function UserRow({
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

  return (
    <div
      className="flex items-center gap-4 px-5 rounded-[10px]"
      style={{ minHeight: "68px", background: "#141417", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-medium shrink-0"
        style={{ background: "rgba(97,193,216,0.12)", color: "#61c1d8" }}
      >
        {initial}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-warm-white text-[14px] font-medium truncate">{user.email}</p>
        <p className="text-muted text-[11px] mt-0.5">Joined {joined}</p>
      </div>

      <select
        value={user.role}
        disabled={updating}
        onChange={(e) => onRoleChange(e.target.value)}
        className="h-8 px-2 rounded-[6px] text-warm-white text-[12px] shrink-0 disabled:opacity-50"
        style={selectStyle}
      >
        <option value="guest-admin">Guest</option>
        <option value="full-admin">Full Admin</option>
      </select>

      <button
        onClick={onRevoke}
        disabled={revoking}
        className="h-8 px-3 rounded-[6px] text-[12px] shrink-0 cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-50"
        style={{ border: "1px solid #bf4d4d", color: "#bf4d4d", background: "transparent" }}
      >
        {revoking ? "Revoking…" : "Revoke"}
      </button>
    </div>
  );
}
