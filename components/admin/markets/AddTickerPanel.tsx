"use client";

import { useState } from "react";

interface LookupResult {
  ticker: string;
  company_name: string;
  sector: string | null;
  industry: string | null;
  market_cap_b: number | null;
  price_close: number | null;
  in_universe: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const inputStyle = {
  background: "#19191d",
  border: "1px solid rgba(255,255,255,0.08)",
};

function MidCapWarning({ cap }: { cap: number | null }) {
  if (cap == null || (cap >= 2 && cap <= 10)) return null;
  return (
    <p style={{ color: "#f59e0b", fontSize: "0.6875rem" }}>
      ⚠ Market cap ${cap}B is outside the mid-cap range ($2B–$10B)
    </p>
  );
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-muted mb-0.5" style={{ fontSize: "0.625rem", letterSpacing: "0.1em" }}>{label}</p>
      <p className="text-warm-white" style={{ fontSize: "0.875rem" }}>{value ?? "—"}</p>
    </div>
  );
}

export default function AddTickerPanel({ isOpen, onClose, onSaved }: Props) {
  const [tickerInput, setTickerInput] = useState("");
  const [looking, setLooking] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [preview, setPreview] = useState<LookupResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  function reset() {
    setTickerInput("");
    setLooking(false);
    setLookupError(null);
    setPreview(null);
    setSaving(false);
    setSaveError(null);
  }

  function close() { reset(); onClose(); }

  async function lookup() {
    const sym = tickerInput.trim().toUpperCase();
    if (!sym) return;
    setLooking(true);
    setLookupError(null);
    try {
      const res = await fetch(`/api/markets/tickers/${sym}/lookup`);
      const data = await res.json();
      if (!res.ok) {
        setLookupError(typeof data.detail === "string" ? data.detail : `Ticker '${sym}' not found`);
      } else {
        setPreview(data);
      }
    } catch {
      setLookupError("Network error — is the API running?");
    } finally {
      setLooking(false);
    }
  }

  async function add() {
    if (!preview) return;
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch("/api/markets/tickers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticker: preview.ticker,
          company_name: preview.company_name,
          sector: preview.sector,
          industry: preview.industry,
          market_cap_b: preview.market_cap_b,
        }),
      });
      if (!res.ok) {
        const { detail } = await res.json();
        setSaveError(typeof detail === "string" ? detail : "Failed to add ticker");
      } else {
        close();
        onSaved();
      }
    } catch {
      setSaveError("Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-30" style={{ background: "rgba(0,0,0,0.4)" }} onClick={close} />}
      <div
        className="fixed top-0 right-0 h-screen w-[320px] z-40 flex flex-col transition-transform duration-300"
        style={{
          background: "#141417",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 h-16 shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-center gap-2">
            {preview && (
              <button
                onClick={() => { setPreview(null); setSaveError(null); }}
                className="text-muted hover:text-warm-white transition-colors cursor-pointer"
                style={{ fontSize: "0.875rem" }}
              >
                ←
              </button>
            )}
            <p className="text-warm-white font-medium" style={{ fontSize: "0.9375rem" }}>
              {preview ? preview.ticker : "Add Ticker"}
            </p>
          </div>
          <button onClick={close} className="text-muted hover:text-warm-white transition-colors cursor-pointer">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
          {!preview ? (
            /* Step 1 — lookup */
            <>
              <div>
                <p className="text-muted mb-1" style={{ fontSize: "0.625rem", letterSpacing: "0.1em" }}>TICKER SYMBOL</p>
                <input
                  type="text"
                  value={tickerInput}
                  onChange={(e) => {
                    setTickerInput(e.target.value.toUpperCase());
                    setLookupError(null);
                  }}
                  onKeyDown={(e) => { if (e.key === "Enter") lookup(); }}
                  placeholder="e.g. MNDY"
                  maxLength={10}
                  className="w-full h-10 px-3 rounded-[6px] text-warm-white text-[14px] outline-none"
                  style={inputStyle}
                />
              </div>

              {lookupError && (
                <p style={{ color: "#e64d4d", fontSize: "0.6875rem" }}>{lookupError}</p>
              )}

              <div className="mt-auto flex flex-col gap-2">
                <button
                  onClick={lookup}
                  disabled={looking || !tickerInput.trim()}
                  className="w-full h-10 rounded-[6px] text-[13px] font-medium transition-opacity disabled:opacity-50 cursor-pointer"
                  style={{ background: "#61c1d8", color: "#0d0d0f" }}
                >
                  {looking ? "Looking up…" : "Look up"}
                </button>
                <p className="text-center" style={{ fontSize: "0.6875rem", color: "#555" }}>
                  Fetches company info from Yahoo Finance.
                </p>
              </div>
            </>
          ) : (
            /* Step 2 — preview & confirm */
            <>
              {preview.in_universe && (
                <div
                  className="rounded-[6px] px-3 py-2"
                  style={{ background: "rgba(97,193,216,0.08)", border: "1px solid rgba(97,193,216,0.2)" }}
                >
                  <p style={{ color: "#61c1d8", fontSize: "0.6875rem" }}>Already in your universe</p>
                </div>
              )}

              <div className="flex flex-col gap-4">
                <InfoRow label="COMPANY" value={preview.company_name} />
                <InfoRow label="SECTOR" value={preview.sector} />
                <InfoRow label="INDUSTRY" value={preview.industry} />
                <div>
                  <p className="text-muted mb-0.5" style={{ fontSize: "0.625rem", letterSpacing: "0.1em" }}>MARKET CAP</p>
                  <p className="text-warm-white" style={{ fontSize: "0.875rem" }}>
                    {preview.market_cap_b != null ? `$${preview.market_cap_b}B` : "—"}
                  </p>
                  <MidCapWarning cap={preview.market_cap_b} />
                </div>
                {preview.price_close != null && (
                  <InfoRow label="LATEST CLOSE" value={`$${preview.price_close.toFixed(2)}`} />
                )}
              </div>

              {saveError && (
                <p style={{ color: "#e64d4d", fontSize: "0.6875rem" }}>{saveError}</p>
              )}

              <div className="mt-auto flex flex-col gap-2">
                {!preview.in_universe && (
                  <button
                    onClick={add}
                    disabled={saving}
                    className="w-full h-10 rounded-[6px] text-[13px] font-medium transition-opacity disabled:opacity-50 cursor-pointer"
                    style={{ background: "#61c1d8", color: "#0d0d0f" }}
                  >
                    {saving ? "Adding…" : "Add to Universe"}
                  </button>
                )}
                <button
                  onClick={close}
                  className="w-full h-10 rounded-[6px] text-[13px] transition-colors cursor-pointer"
                  style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.08)", color: "#888" }}
                >
                  Cancel
                </button>
                {!preview.in_universe && (
                  <p className="text-center" style={{ fontSize: "0.6875rem", color: "#555" }}>
                    Triggers immediate data fetch for this ticker.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
