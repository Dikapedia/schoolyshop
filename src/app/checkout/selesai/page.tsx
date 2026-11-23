"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { inter } from "@/lib/fonts";
import { site } from "@/lib/site";
import { useHydrated } from "@/lib/use-hydrated";
import SiteHeader from "@/components/shop/SiteHeader";
import SiteFooter from "@/components/shop/SiteFooter";
import { useSession } from "@/api/auth";
import { getCustomerOrder, type CustomerOrder } from "@/api/customer/orders";
import { getApiErrorMessage } from "@/api/errors";
import { formatRupiah } from "@/lib/format";

export default function CheckoutSelesaiPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-slate-500">Memuat…</div>}>
      <CheckoutSelesaiContent />
    </Suspense>
  );
}

function CheckoutSelesaiContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session = useSession();
  const hydrated = useHydrated();
  const orderId = Number(searchParams.get("order") ?? "");
  const validOrderId = Number.isFinite(orderId) && orderId > 0;

  const [order, setOrder] = useState<CustomerOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (hydrated && !session) {
      router.replace("/login?next=/checkout/selesai");
    }
  }, [session, router, hydrated]);

  useEffect(() => {
    if (!session || !validOrderId) return;

    let active = true;
    getCustomerOrder(orderId)
      .then((found) => {
        if (active) setOrder(found);
      })
      .catch((cause: unknown) => {
        if (active) setError(getApiErrorMessage(cause, "Pesanan tidak ditemukan."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [session, orderId, validOrderId]);

  if (!session) return null;
  if (!validOrderId) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Nomor pesanan tidak ditemukan.
      </div>
    );
  }
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-slate-500">Memuat…</div>;
  }
  if (error || !order) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        {error || "Pesanan tidak ditemukan."}
      </div>
    );
  }

  return (
    <div className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900`}>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-12">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-emerald-800">Pesanan Berhasil Dibuat</h1>
            <p className="mt-2 text-sm text-emerald-700">
              Terima kasih telah berbelanja di Koperasi {site.school}.
            </p>

            <div className="mt-8 space-y-4 text-left">
              <div className="flex justify-between">
                <span className="text-slate-500">Nomor Pesanan</span>
                <span className="font-mono font-bold">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tanggal</span>
                <span>{new Date(order.createdAt).toLocaleDateString("id-ID", { dateStyle: "full" })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total</span>
                <span className="font-bold text-blue-600">{formatRupiah(order.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                  {order.status}
                </span>
              </div>
            </div>

            <div className="mt-8 grid gap-3">
              <a
                href="/pesanan"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Lihat Pesanan
              </a>
              <a
                href={`/pesanan/invoice?id=${order.id}`}
                className="inline-flex items-center justify-center rounded-xl bg-white border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cetak Invoice
              </a>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
