"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { inter } from "@/lib/fonts";
import { useHydrated } from "@/lib/use-hydrated";
import SiteHeader from "@/components/shop/SiteHeader";
import SiteFooter from "@/components/shop/SiteFooter";
import { formatRupiah } from "@/lib/format";
import { useSession } from "@/api/auth";
import { listOrders, markOrderReceived } from "@/api/orders";
import { site } from "@/lib/site";

export default function TerimaPesananPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-slate-500">Memuat…</div>}>
      <TerimaPesananContent />
    </Suspense>
  );
}

function TerimaPesananContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session = useSession();
  const hydrated = useHydrated();
  const id = searchParams.get("id") ?? "";

  const { order, error } = useMemo(() => {
    if (!session) return { order: null, error: "" };
    if (!id) return { order: null, error: "ID pesanan belum diberikan." };
    const list = listOrders(session.id);
    if (list === null)
      return { order: null, error: "Belum ada riwayat pesanan." };
    const found = list.find((item) => item.id === id) ?? null;
    return {
      order: found,
      error: found ? "" : "Pesanan tidak ditemukan.",
    };
  }, [session, id]);

  const [confirmed, setConfirmed] = useState(false);
  const [confirmError, setConfirmError] = useState("");

  useEffect(() => {
    if (hydrated && !session) {
      router.replace("/login?next=/pesanan/terima");
    }
  }, [session, router, hydrated]);

  function handleConfirm() {
    if (!session || !order) return;
    if (!markOrderReceived(session.id, order.id)) {
      setConfirmError("Gagal menyimpan status pesanan. Silakan coba lagi.");
      return;
    }
    setConfirmError("");
    setConfirmed(true);
  }

  if (!session) return null;
  if (error || !order) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        {error ?? "Pesanan tidak ditemukan."}
      </div>
    );
  }

  return (
    <div className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900`}>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-6">
          {!confirmed ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400">ID Pesanan</p>
                  <p className="text-2xl font-bold">{order.id}</p>
                  <p className="mt-1 text-xs text-slate-500">{new Date(order.date).toLocaleString()}</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                  {order.status}
                </span>
              </div>

              {/* Delivery Info */}
              <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="mb-2 text-sm font-bold text-slate-900">Info Pengiriman</h3>
                <div className="grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-slate-500">Kurir</p>
                    <p className="font-semibold">JNE Express</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Nomor Resi</p>
                    <p className="font-semibold">RN-20250116-001</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs text-slate-500">Alamat Pengiriman</p>
                    <p className="font-semibold">Jalan Cikondang No. 45, Ngesrep, Kec. Coblong, Kota Bandung</p>
                    <p className="text-xs text-slate-500">Kode Pos: 40115</p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-bold text-slate-900">Isi Pesanan</h3>
                <ul className="space-y-2">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🛍️</span>
                        <div>
                          <p className="font-semibold text-sm">{item.name}</p>
                          <p className="text-xs text-slate-500">Qty: {item.qty} x {formatRupiah(item.price)}</p>
                        </div>
                      </div>
                      <span className="font-bold text-blue-600">{formatRupiah(item.price * item.qty)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex justify-end border-t border-slate-100 pt-3 text-sm">
                  <span className="font-semibold text-slate-700">Total Pembayaran: </span>
                  <span className="ml-2 text-base font-bold text-blue-600">{formatRupiah(order.total)}</span>
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleConfirm}
                className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                ✓ Konfirmasi Pesanan Diterima
              </button>
              <p className="mt-2 text-center text-xs text-slate-500">
                Dengan mengkonfirmasi, Anda menyatakan telah menerima pesanan dalam kondisi baik.
              </p>
              {confirmError && (
                <p className="mt-2 text-center text-xs font-semibold text-red-600">
                  {confirmError}
                </p>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
              <div className="mb-4 text-5xl">✅</div>
              <h2 className="text-2xl font-bold text-emerald-800">Pesanan Berhasil Diterima!</h2>
              <p className="mt-2 text-sm text-emerald-700">
                Terima kasih telah menyelesaikan transaksi di <strong>{site.school}</strong>.
              </p>
              <p className="mt-1 text-xs text-emerald-600">Status pesanan: Selesai</p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  onClick={() => router.push("/pesanan")}
                  className="rounded-lg border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                >
                  Lihat Riwayat
                </button>
                <button
                  onClick={() => router.push("/keranjang")}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Belanja Lagi
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
