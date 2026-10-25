"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { inter } from "@/lib/fonts";
import SiteHeader from "@/components/shop/SiteHeader";
import SiteFooter from "@/components/shop/SiteFooter";
import { formatRupiah } from "@/lib/format";
import { useSession } from "@/lib/auth/use-session";
import { site } from "@/lib/site";

type Order = {
  id: string;
  date: string;
  items: { productId: string; name: string; qty: number; price: number }[];
  total: number;
  status: string;
};

export default function TerimaPesananPage() {
  const router = useRouter();
  const session = useSession();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!session) {
      router.replace("/login?next=/pesanan/terima");
      return;
    }
    const id = new URLSearchParams(window.location.search).get("id") ?? "";
    if (!id) {
      setError("ID pesanan belum diberikan.");
      setLoading(false);
      return;
    }
    try {
      const raw = window.localStorage.getItem("schooly.orders");
      if (!raw) {
        setError("Belum ada riwayat pesanan.");
        setLoading(false);
        return;
      }
      const all: Record<string, Order[]> = JSON.parse(raw);
      const list = all[session.id] ?? [];
      const found = list.find((o: Order) => o.id === id);
      if (!found) {
        setError("Pesanan tidak ditemukan.");
      } else {
        setOrder(found);
      }
    } catch {
      setError("Gagal membaca data pesanan.");
    } finally {
      setLoading(false);
    }
  }, [session, router]);

  function handleConfirm() {
    if (!session) return;
    setConfirmed(true);
    // Update order status to "Selesai" in localStorage
    try {
      const raw = window.localStorage.getItem("schooly/orders");
      if (raw) {
        const all: Record<string, Order[]> = JSON.parse(raw);
        const list = all[session.id] ?? [];
        const updated = list.map((o: Order) => o.id === order?.id ? { ...o, status: "Selesai" } : o);
        all[session.id] = updated;
        window.localStorage.setItem("schooly/orders", JSON.stringify(all));
      }
    } catch {
      // ignore
    }
  }

  if (!session) return null;
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Memuat detail pesanan...
      </div>
    );
  }
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
