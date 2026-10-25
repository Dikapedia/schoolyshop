"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { inter } from "@/lib/fonts";
import SiteHeader from "@/components/shop/SiteHeader";
import SiteFooter from "@/components/shop/SiteFooter";
import { useSession } from "@/lib/auth/use-session";

type Order = {
  id: string;
  date: string;
  items: { productId: string; name: string; qty: number; price: number }[];
  total: number;
  status: string;
};

type Review = {
  productId: string;
  rating: number;
  comment: string;
};

export default function UlasanPage() {
  const router = useRouter();
  const session = useSession();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState<Record<string, Review>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!session) {
      router.replace("/login?next=/pesanan/ulasan");
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

  function updateReview(productId: string, field: "rating" | "comment", value: number | string) {
    setReviews(prev => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value }
    }));
  }

  function handleSubmit() {
    if (!order || !session) return;
    const filled = Object.keys(reviews).filter(pid => reviews[pid].rating > 0);
    if (filled.length === 0) {
      setError("Beri rating untuk minimal satu produk.");
      return;
    }
    try {
      const key = "schooly.reviews";
      const existing = window.localStorage.getItem(key);
      const all = existing ? JSON.parse(existing) : {};
      const userList = all[session.id] ?? [];
      const newReviews = order.items
        .filter(item => reviews[item.productId]?.rating > 0)
        .map(item => ({
          orderId: order.id,
          productId: item.productId,
          productName: item.name,
          rating: reviews[item.productId].rating,
          comment: reviews[item.productId].comment || "",
          submittedAt: new Date().toISOString(),
        }));
      all[session.id] = [...userList, ...newReviews];
      window.localStorage.setItem(key, JSON.stringify(all));
      setSubmitted(true);
    } catch {
      setError("Gagal menyimpan ulasan.");
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
              <div className="text-5xl mb-4">⭐</div>
              <h2 className="text-2xl font-bold text-emerald-800">Terima Kasih Atas Ulasan Anda!</h2>
              <p className="mt-2 text-sm text-emerald-700">Ulasan membantu kami meningkatkan layanan.</p>
              <button onClick={() => router.push("/pesanan")} className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
                Kembali ke Riwayat
              </button>
            </div>
          ) : (
            <>
              <h1 className="mb-4 text-2xl font-bold">Beri Ulasan Produk</h1>
              <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
                <p className="font-semibold">Order ID: {order.id}</p>
                <p className="text-sm text-slate-600">{new Date(order.date).toLocaleString()}</p>
              </div>
              <div className="space-y-6">
                {order.items.map(item => (
                  <div key={item.productId} className="rounded-xl border border-slate-200 bg-white p-5">
                    <p className="font-semibold mb-3">{item.name}</p>
                    <div className="mb-3">
                      <p className="text-sm text-slate-600 mb-2">Rating:</p>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            onClick={() => updateReview(item.productId, "rating", star)}
                            className={`text-2xl transition ${reviews[item.productId]?.rating >= star ? "text-yellow-400" : "text-slate-300"}`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-2">Komentar (opsional):</p>
                      <textarea
                        placeholder="Bagikan pengalaman Anda dengan produk ini..."
                        value={reviews[item.productId]?.comment || ""}
                        onChange={e => updateReview(item.productId, "comment", e.target.value)}
                        className="w-full rounded border border-slate-300 p-2 text-sm focus:outline-none focus:border-blue-500"
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
              <button onClick={handleSubmit} className="mt-6 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                Kirim Ulasan
              </button>
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
