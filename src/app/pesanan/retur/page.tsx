"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { inter } from "@/lib/fonts";
import { useHydrated } from "@/lib/use-hydrated";
import SiteHeader from "@/components/shop/SiteHeader";
import SiteFooter from "@/components/shop/SiteFooter";
import { formatRupiah } from "@/lib/format";
import { useSession } from "@/api/auth";
import { listOrders, markOrderReturning } from "@/api/orders";
import { createReturn } from "@/api/returns";

export default function ReturPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-slate-500">Memuat…</div>}>
      <ReturPageContent />
    </Suspense>
  );
}

function ReturPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session = useSession();
  const hydrated = useHydrated();
  const id = searchParams.get("id") ?? "";

  const load = useMemo(() => {
    if (!session) return { order: null, error: "" };
    if (!id) return { order: null, error: "ID pesanan tidak diberikan." };
    const list = listOrders(session.id);
    if (list === null)
      return { order: null, error: "Gagal membaca data pesanan." };
    const found = list.find((item) => item.id === id) ?? null;
    return {
      order: found,
      error: found ? "" : "Pesanan tidak ditemukan.",
    };
  }, [session, id]);
  const order = load.order;

  const [submitError, setSubmitError] = useState("");
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const error = submitError || load.error;

  useEffect(() => {
    if (hydrated && !session) {
      router.replace("/login?next=/pesanan/retur");
    }
  }, [session, router, hydrated]);

  function handleReasonChange(productId: string, value: string) {
    setReasons(prev => ({ ...prev, [productId]: value }));
  }

  function handleSubmit() {
    if (!order || !session) return;
    const items = order.items
      .filter(i => reasons[i.productId])
      .map(i => ({ productId: i.productId, name: i.name, qty: i.qty, reason: reasons[i.productId] }));
    if (items.length === 0) {
      setSubmitError("Pilih setidaknya satu item untuk dikembalikan.");
      return;
    }
    try {
      createReturn(session.id, {
        orderId: order.id,
        items,
      });
      markOrderReturning(session.id, order.id);
      setSubmitted(true);
    } catch {
      setSubmitError("Gagal menyimpan permintaan pengembalian.");
    }
  }

  if (!session) return null;
  if (error || !order) return <div className="flex min-h-screen items-center justify-center text-slate-500">{error || "Pesanan tidak ditemukan."}</div>;

  return (
    <div className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900`}>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-6">
          {submitted ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
              <h2 className="text-2xl font-bold text-emerald-800">Permintaan Pengembalian Dikirim</h2>
              <p className="mt-2 text-sm text-emerald-700">Terima kasih, tim kami akan memproses pengembalian Anda.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <button onClick={() => router.push("/pesanan/status-pengembalian")} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
                  Lihat Status Pengembalian
                </button>
                <button onClick={() => router.push("/pesanan")} className="rounded-lg border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50">
                  Kembali ke Riwayat
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="mb-4 text-2xl font-bold">Ajukan Pengembalian</h1>
              <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4">
                <p className="font-semibold">Order ID: {order.id}</p>
                <p className="text-sm text-slate-600">{new Date(order.date).toLocaleString()}</p>
              </div>
              <ul className="space-y-4">
                {order.items.map(item => (
                  <li key={item.productId} className="flex items-start gap-3 rounded border border-slate-200 bg-white p-3">
                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-xs text-slate-500">Qty: {item.qty} • {formatRupiah(item.price)}</p>
                      <textarea
                        placeholder="Alasan pengembalian"
                        value={reasons[item.productId] || ""}
                        onChange={e => handleReasonChange(item.productId, e.target.value)}
                        className="mt-2 w-full rounded border border-slate-300 p-2 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </li>
                ))}
              </ul>
              {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
              <button onClick={handleSubmit} className="mt-4 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                Kirim Permintaan Pengembalian
              </button>
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
