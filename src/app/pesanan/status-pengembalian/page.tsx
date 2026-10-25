"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { inter } from "@/lib/fonts";
import SiteHeader from "@/components/shop/SiteHeader";
import SiteFooter from "@/components/shop/SiteFooter";
import { useSession } from "@/lib/auth/use-session";

type ReturnRequest = {
  orderId: string;
  items: { productId: string; name: string; qty: number; reason: string }[];
  submittedAt: string;
};

export default function ReturnStatusPage() {
  const router = useRouter();
  const session = useSession();
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session) {
      router.replace("/login?next=/pesanan/status-pengembalian");
      return;
    }
    try {
      const raw = window.localStorage.getItem("schooly.returns");
      if (!raw) {
        setReturns([]);
      } else {
        const all: Record<string, ReturnRequest[]> = JSON.parse(raw);
        setReturns(all[session.id] ?? []);
      }
    } catch {
      setError("Gagal memuat data pengembalian.");
    } finally {
      setLoading(false);
    }
  }, [session, router]);

  if (!session) return null;
  if (loading) return <div className="flex min-h-screen items-center justify-center text-slate-500">Memuat...</div>;
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
