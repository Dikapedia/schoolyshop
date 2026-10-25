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

type ReturnRequest = {
  orderId: string;
  items: { productId: string; name: string; qty: number; reason: string }[];
  submittedAt: string;
};

export default function ReturPage() {
  const router = useRouter();
  const session = useSession();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!session) {
      router.replace("/login?next=/pesanan/retur");
      return;
    }
    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) {
      setError("ID pesanan tidak diberikan.");
      setLoading(false);
      return;
    }
    try {
      const raw = window.localStorage.getItem("schooly.orders");
      if (!raw) throw new Error();
      const all: Record<string, Order[]> = JSON.parse(raw);
      const list = all[session.id] ?? [];
      const found = list.find(o => o.id === id);
      if (!found) setError("Pesanan tidak ditemukan.");
      else setOrder(found);
    } catch {
      setError("Gagal membaca data pesanan.");
    } finally {
      setLoading(false);
    }
  }, [session, router]);

  function handleReasonChange(productId: string, value: string) {
    setReasons(prev => ({ ...prev, [productId]: value }));
  }

  function handleSubmit() {
    if (!order || !session) return;
    const items = order.items
      .filter(i => reasons[i.productId])
      .map(i => ({ productId: i.productId, name: i.name, qty: i.qty, reason: reasons[i.productId] }));
    if (items.length === 0) {
      setError("Pilih setidaknya satu item untuk dikembalikan.");
      return;
    }
    const request: ReturnRequest = {
      orderId: order.id,
      items,
      submittedAt: new Date().toISOString(),
    };
    try {
      const key = "schooly.returns";
      const existing = window.localStorage.getItem(key);
      const all = existing ? JSON.parse(existing) : {};
      const userList = all[session.id] ?? [];
      all[session.id] = [...userList, request];
      window.localStorage.setItem(key, JSON.stringify(all));
      setSubmitted(true);
    } catch {
      setError("Gagal menyimpan permintaan pengembalian.");
    }
  }

  if (!session) return null;
  if (loading) return <div className="flex min-h-screen items-center justify-center text-slate-500">Memuat...</div>;
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
              <button onClick={() => router.push("/pesanan")} className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
                Kembali ke Riwayat
              </button>
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
