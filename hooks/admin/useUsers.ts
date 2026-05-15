"use client";

import { useState, useEffect } from "react";

export interface OnboardingStatus {
  invite_clicked_at: string | null;
  password_set_at: string | null;
  totp_enabled_at: string | null;
}

export interface AdminUser {
  id: string;
  email: string;
  role: "full-admin" | "guest-admin";
  created_at: string;
  onboarding: OnboardingStatus | null;
}

export function useUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    if (res.ok) setUsers(await res.json());
    setLoading(false);
  }

  async function updateRole(userId: string, role: string) {
    setUpdating(userId);
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, role }),
    });
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: role as AdminUser["role"] } : u))
    );
    setUpdating(null);
  }

  async function revoke(userId: string) {
    setRevoking(userId);
    const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    if (res.ok) setUsers((prev) => prev.filter((u) => u.id !== userId));
    setRevoking(null);
  }

  return { users, loading, revoking, updating, updateRole, revoke, refetch: fetchUsers };
}
