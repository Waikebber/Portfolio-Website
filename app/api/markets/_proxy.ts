// Shared helpers for markets proxy routes.
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const BASE = process.env.MARKETS_API_URL;
const KEY = process.env.MARKETS_API_KEY;

export async function requireAnyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("admin_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();
  return data?.role ? user : null;
}

export async function requireFullAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("admin_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();
  return data?.role === "full-admin" ? user : null;
}

export async function proxyGet(path: string, revalidate?: number) {
  if (!BASE || !KEY) return NextResponse.json({ error: "Markets API not configured" }, { status: 503 });
  const res = await fetch(`${BASE}${path}`, {
    headers: { "X-API-Key": KEY },
    ...(revalidate !== undefined ? { next: { revalidate } } : { cache: "no-store" }),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function proxyMutate(
  path: string,
  method: string,
  body?: unknown
) {
  if (!BASE || !KEY) return NextResponse.json({ error: "Markets API not configured" }, { status: 503 });
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "X-API-Key": KEY, "Content-Type": "application/json" },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  if (res.status === 204) return new NextResponse(null, { status: 204 });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
