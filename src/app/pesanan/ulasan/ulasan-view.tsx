"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { inter } from "@/lib/fonts";
import SiteHeader from "@/components/shop/SiteHeader";
import SiteFooter from "@/components/shop/SiteFooter";
import { useSession } from "@/api/auth";
import { getApiErrorMessage } from "@/api/errors";
import { getCustomerOrder, type CustomerOrder } from "@/api/customer/orders";
import { createReviews } from "@/api/reviews";

type ReviewState = {
  rating: number;
  comment: string;
};

export default function UlasanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session = useSession();
  const orderId = Number(searchParams.get("id") ?? "");
  const validOrderId = Number.isFinite(orderId) && orderId > 0;
  const [order, setOrder] = useState<CustomerOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState<Record<number, ReviewState>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!session) {
      router.replace("/login?next=/pesanan/ulasan");
      return;
    }
    if (!validOrderId) return;

    let active = true;
    getCustomerOrder(orderId)
      .then((found) => {
        if (active) setOrder(found);
      })
      .catch((cause: unknown) => {
        if (active) setError(getApiErrorMessage(cause));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [session, router, orderId, validOrderId]);

  function updateReview(itemId: number, field: "rating" | "comment", value: number | string) {
    setReviews((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], [field]: value },
    }));
  }

  async function handleSubmit() {
    if (!order || !session) return;
    const drafts = order.items
      .filter((item) => item.productId !== null && (reviews[item.id]?.rating ?? 0) > 0)
      .map((item) => ({
        productId: item.productId as number,
        rating: reviews[item.id].rating,
        comment: reviews[item.id].comment ?? "",
      }));

    if (drafts.length === 0) {
      setError("Beri rating untuk minimal satu produk.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await createReviews(order.id, drafts);
      setSubmitted(true);
    } catch (cause: unknown) {
      setError(getApiErrorMessage(cause, "Gagal menyimpan ulasan."));
    } finally {
      setSubmitting(false);
    }
  }

  if (!session) return null;
  if (validOrderId && loading) return <div className="flex min-h-screen items-center justify-center text-slate-500">Memuat...</div>;
  if (!validOrderId || error || !order) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        {!validOrderId ? "ID pesanan tidak diberikan." : error || "Pesanan tidak ditemukan."}
      </div>
    );
  }

  return (
    <div className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900`}>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-6">
          {submitted ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
              <div className="mb-4 text-5xl">⭐</div>
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
                <p className="text-sm text-slate-600">{new Date(order.createdAt).toLocaleString("id-ID")}</p>
              </div>
              <div className="space-y-6">
                {order.items.map((item) => (
                  <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-5">
                    <p className="mb-3 font-semibold">{item.productName}</p>
                    <div className="mb-3">
                      <p className="mb-2 text-sm text-slate-600">Rating:</p>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => updateReview(item.id, "rating", star)}
                            className={`text-2xl transition ${(reviews[item.id]?.rating ?? 0) >= star ? "text-yellow-400" : "text-slate-300"}`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-sm text-slate-600">Komentar (opsional):</p>
                      <textarea
                        placeholder="Bagikan pengalaman Anda dengan produk ini..."
                        value={reviews[item.id]?.comment ?? ""}
                        onChange={(event) => updateReview(item.id, "comment", event.target.value)}
                        className="w-full rounded border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="mt-6 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {submitting ? "Mengirim..." : "Kirim Ulasan"}
              </button>
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
