"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { inter } from "@/lib/fonts";
import { useHydrated } from "@/lib/use-hydrated";
import { useAsyncData } from "@/lib/use-async-data";
import SiteHeader from "@/components/shop/SiteHeader";
import SiteFooter from "@/components/shop/SiteFooter";
import { useSession } from "@/api/auth";
import { trackShipment, type Tracking } from "@/api/shipments";

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
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");

  const { data: tracking, loading, error } = useAsyncData<Tracking | null>(
    `track:${submittedQuery}`,
    () => (submittedQuery ? trackShipment(submittedQuery) : Promise.resolve(null)),
  );

  useEffect(() => {
    if (hydrated && !session) {
      router.replace("/login?next=/pesanan/lacak");
    }
  }, [session, router, hydrated]);

  function handleTrack() {
    const next = query.trim();
    if (!next) {
      setCopyError("Masukkan nomor resi atau ID pesanan.");
      return;
    }
    setSubmittedQuery(next);
    setCopyError("");
    setCopied(false);
  }

  async function handleCopy() {
    if (!tracking) return;
    try {
      await navigator.clipboard.writeText(tracking.trackingNumber);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError("Gagal menyalin nomor resi.");
    }
  }

  if (!session) return null;

  const mapQuery = tracking?.history.at(-1)?.location || "Indonesia";
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

  return (
    <div className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900`}>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <h1 className="mb-4 text-2xl font-bold">Lacak Pengiriman</h1>

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
          {(copyError || error) && (
            <p className="mb-4 text-sm text-red-600">{copyError || error}</p>
          )}

          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold">Lokasi terakhir</h2>
              {tracking && (
                <a href={mapUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                  Buka di Google Maps
                </a>
              )}
            </div>
            <div className="mt-3 grid h-64 place-items-center rounded-lg bg-slate-100 text-center">
              <div>
                <p className="text-sm font-semibold text-slate-700">{tracking ? mapQuery : "Masukkan resi untuk melihat lokasi"}</p>
                <p className="mt-1 text-xs text-slate-500">Lokasi berdasarkan event tracking terakhir.</p>
              </div>
            </div>
          </div>

          {loading && submittedQuery && (
            <p className="text-sm text-slate-500">Melacak pengiriman…</p>
          )}

          {tracking && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">{tracking.order_id}</p>
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
                {tracking.history.map((event, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${index === tracking.history.length - 1 ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"}`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 border-l border-slate-200 pl-3">
                      <p className="text-xs font-semibold">{event.timestamp}</p>
                      <p className="text-sm text-slate-700">{event.location}</p>
                      <p className="text-xs text-slate-500">{event.description}</p>
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
