"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { inter } from "@/lib/fonts";
import { useHydrated } from "@/lib/use-hydrated";
import SiteHeader from "@/components/shop/SiteHeader";
import SiteFooter from "@/components/shop/SiteFooter";
import { useSession } from "@/api/auth";
import { listOrders } from "@/api/orders";
import { createReviews, type ReviewDraft } from "@/api/reviews";

type ReviewState = {
  rating: number;
  comment: string;
};

export default function UlasanPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-slate-500">Memuat…</div>}>
      <UlasanPageContent />
    </Suspense>
  );
}

function UlasanPageContent() {
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
  const [reviews, setReviews] = useState<Record<string, ReviewState>>({});
  const [submitted, setSubmitted] = useState(false);
  const error = submitError || load.error;

  useEffect(() => {
    if (hydrated && !session) {
      router.replace("/login?next=/pesanan/ulasan");
    }
  }, [session, router, hydrated]);

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
      setSubmitError("Beri rating untuk minimal satu produk.");
      return;
    }
    try {
      const drafts: ReviewDraft[] = Object.entries(reviews).map(
        ([productId, review]) => ({
          productId,
          rating: review.rating,
          comment: review.comment,
        }),
      );
      createReviews(session.id, order, drafts);
      setSubmitted(true);
    } catch {
      setSubmitError("Gagal menyimpan ulasan.");
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
