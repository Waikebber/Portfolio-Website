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

const TIMEOUT_MS = 30_000;

function withTimeout(signal?: AbortSignal): { signal: AbortSignal; clear: () => void } {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  signal?.addEventListener("abort", () => { clearTimeout(timer); controller.abort(); });
  return { signal: controller.signal, clear: () => clearTimeout(timer) };
}

export async function proxyGet(path: string, revalidate?: number) {
  if (!BASE || !KEY) return NextResponse.json({ error: "Markets API not configured" }, { status: 503 });
  const { signal, clear } = withTimeout();
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { "X-API-Key": KEY },
      signal,
      ...(revalidate !== undefined ? { next: { revalidate } } : { cache: "no-store" }),
    });
    clear();
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: unknown) {
    clear();
    const isTimeout = err instanceof Error && err.name === "AbortError";
    return NextResponse.json(
      { error: isTimeout ? "Markets API timed out" : "Markets API unreachable" },
      { status: 503 }
    );
  }
}

export async function proxyMutate(path: string, method: string, body?: unknown) {
  if (!BASE || !KEY) return NextResponse.json({ error: "Markets API not configured" }, { status: 503 });
  const { signal, clear } = withTimeout();
  try {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers: { "X-API-Key": KEY, "Content-Type": "application/json" },
      signal,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    clear();
    if (res.status === 204) return new NextResponse(null, { status: 204 });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: unknown) {
    clear();
    const isTimeout = err instanceof Error && err.name === "AbortError";
    return NextResponse.json(
      { error: isTimeout ? "Markets API timed out" : "Markets API unreachable" },
      { status: 503 }
    );
  }
}
