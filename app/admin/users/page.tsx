"use client";

import { useState } from "react";
import { useUsers } from "@/hooks/admin/useUsers";
import { UserRow } from "./UserRow";
import { InviteForm } from "./InviteForm";

export default function UsersPage() {
  const { users, loading, revoking, updating, updateRole, revoke } = useUsers();
  const [showInvite, setShowInvite] = useState(false);

  const fullAdmins = users.filter((u) => u.role === "full-admin");
  const guests = users.filter((u) => u.role === "guest-admin");

  return (
    <div className="max-w-[860px]">
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-warm-white text-[32px] font-medium">Users</h1>
          <p className="text-muted text-[14px] mt-1">All users with admin access, excluding you.</p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="h-9 px-4 flex items-center rounded-[8px] text-[13px] shrink-0 mt-1 cursor-pointer hover:opacity-90 transition-opacity"
          style={{ background: "#141417", border: "1px solid rgba(255,255,255,0.08)", color: "#61c1d8" }}
        >
          + Invite user
        </button>
      </div>

      {showInvite && <InviteForm onDismiss={() => setShowInvite(false)} />}

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
