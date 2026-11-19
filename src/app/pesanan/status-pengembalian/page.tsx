"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { inter } from "@/lib/fonts";
import { useHydrated } from "@/lib/use-hydrated";
import SiteHeader from "@/components/shop/SiteHeader";
import SiteFooter from "@/components/shop/SiteFooter";
import { useSession } from "@/api/auth";
import { listReturns } from "@/api/returns";

export default function ReturnStatusPage() {
  const router = useRouter();
  const session = useSession();
  const hydrated = useHydrated();
  const data = useMemo(
    () => (session ? listReturns(session.id) : []),
    [session],
  );
  const returns = data ?? [];
  const error =
    session && data === null ? "Gagal memuat data pengembalian." : "";

  useEffect(() => {
    if (hydrated && !session) {
      router.replace("/login?next=/pesanan/status-pengembalian");
    }
  }, [session, router, hydrated]);

  if (!session) return null;
  if (error) return <div className="flex min-h-screen items-center justify-center text-slate-500">{error}</div>;

  return (
    <div className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900`}>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <h1 className="mb-4 text-2xl font-bold">Status Pengembalian</h1>
          {returns.length === 0 ? (
            <p className="text-slate-600">Tidak ada pengembalian yang diajukan.</p>
          ) : (
            <ul className="space-y-4">
              {returns.map((r, idx) => (
                <li key={idx} className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="font-semibold">Order ID: {r.orderId}</p>
                  <p className="text-xs text-slate-500">Diajukan pada: {new Date(r.submittedAt).toLocaleString()}</p>
                  <ul className="mt-2 space-y-2">
                    {r.items.map((it) => (
                      <li key={it.productId} className="text-sm">
                        {it.name} (Qty: {it.qty}) – {it.reason}
                      </li>
                    ))}
                  </ul>
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
