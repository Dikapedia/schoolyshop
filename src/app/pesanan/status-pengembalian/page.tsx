"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { inter } from "@/lib/fonts";
import SiteHeader from "@/components/shop/SiteHeader";
import SiteFooter from "@/components/shop/SiteFooter";
import { useSession } from "@/api/auth";
import { useHydrated } from "@/lib/use-hydrated";
import { useAsyncData } from "@/lib/use-async-data";
import { listReturns } from "@/api/returns";

const STATUS_TONE: Record<string, string> = {
  "Menunggu Keputusan": "bg-amber-50 text-amber-700",
  Disetujui: "bg-emerald-50 text-emerald-700",
  Ditolak: "bg-red-50 text-red-700",
};

export default function ReturnStatusPage() {
  const router = useRouter();
  const session = useSession();
  const hydrated = useHydrated();
  const { data, loading, error } = useAsyncData("returns:me", listReturns);
  const returns = data ?? [];

  useEffect(() => {
    if (hydrated && !session) {
      router.replace("/login?next=/pesanan/status-pengembalian");
    }
  }, [session, router, hydrated]);

  if (!session) return null;

  return (
    <div className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900`}>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <h1 className="mb-4 text-2xl font-bold">Status Pengembalian</h1>
          {loading ? (
            <p className="text-slate-600">Memuat…</p>
          ) : error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : returns.length === 0 ? (
            <p className="text-slate-600">Tidak ada pengembalian yang diajukan.</p>
          ) : (
            <ul className="space-y-4">
              {returns.map((item) => (
                <li key={item.id} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold">Order ID: {item.orderId}</p>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_TONE[item.status] ?? "bg-slate-100 text-slate-700"}`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Diajukan pada: {new Date(item.submittedAt).toLocaleString("id-ID")}
                  </p>
                  <ul className="mt-2 space-y-2">
                    {item.items.map((entry, index) => (
                      <li key={`${item.id}-${index}`} className="text-sm">
                        {entry.name} (Qty: {entry.qty}) – {entry.reason}
                      </li>
                    ))}
                  </ul>
                  {item.adminNote && (
                    <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                      Catatan admin: {item.adminNote}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
