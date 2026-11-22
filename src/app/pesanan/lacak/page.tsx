"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { inter } from "@/lib/fonts";
import { useHydrated } from "@/lib/use-hydrated";
import SiteHeader from "@/components/shop/SiteHeader";
import SiteFooter from "@/components/shop/SiteFooter";
import { useSession } from "@/api/auth";
import { trackShipment } from "@/api/shipments";

export default function LacakPengirimanPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-slate-500">
          Memuat…
        </div>
      }
    >
      <LacakPengirimanRoute />
    </Suspense>
  );
}

function LacakPengirimanRoute() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  // `key` memastikan form ter-reset saat membuka pesanan lain dari riwayat.
  return <LacakPengirimanContent key={id} initialQuery={id} />;
}

function LacakPengirimanContent({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const session = useSession();
  const hydrated = useHydrated();
  const [query, setQuery] = useState(initialQuery);
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const tracking = submittedQuery ? trackShipment(submittedQuery) : null;

  useEffect(() => {
    if (hydrated && !session) {
      router.replace("/login?next=/pesanan/lacak");
    }
  }, [session, router, hydrated]);

  function handleTrack() {
    const next = query.trim();
    if (!next) {
      setError("Masukkan nomor resi atau ID pesanan.");
      return;
    }
    setSubmittedQuery(next);
    setError("");
    setCopied(false);
  }

  async function handleCopy() {
    if (!tracking) return;
    try {
      await navigator.clipboard.writeText(tracking.trackingNumber);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Gagal menyalin nomor resi.");
    }
  }

  if (!session) return null;

  return (
    <div className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900`}>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <h1 className="mb-4 text-2xl font-bold">Lacak Pengiriman</h1>

          {/* Search */}
          <div className="mb-6 flex gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Masukkan nomor resi / ID pesanan"
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={handleTrack}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Lacak
            </button>
          </div>
          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

                {/* Map */}
                <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
                  <h2 className="mb-3 text-lg font-bold">Peta Pengiriman (Kota Semarang)</h2>
                  <div className="h-64 rounded-lg overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3985.628927236514!2d110.4166631154614!3d-6.966699695007516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e70586b6b8e967d%3A0x8df1d9ac9b7f8c4e!2sSemarang%2C%20Central%20Java%2C%20Indonesia!5e0!3m2!1sen!2sid!4v1728923456789!5m2!1sen!2sid"
                      title="Peta‑pengiriman"
                    />
                  </div>
                </div>

          {/* Tracking Result */}
          {tracking && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm">{tracking.order_id}</p>
                  <p className="text-xs text-slate-500">{tracking.courier} • {tracking.status}</p>
                  <p className="text-xs text-slate-500">Resi: {tracking.trackingNumber}</p>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  aria-live="polite"
                >
                  {copied ? "Tersalin" : "Salin Resi"}
                </button>
              </div>
              <div className="space-y-4">
                {tracking.history.map((h, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${i === tracking.history.length - 1 ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"}`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 border-l border-slate-200 pl-3">
                      <p className="text-xs font-semibold">{h.timestamp}</p>
                      <p className="text-sm text-slate-700">{h.location}</p>
                      <p className="text-xs text-slate-500">{h.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
