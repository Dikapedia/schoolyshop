"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { inter } from "@/lib/fonts";
import SiteHeader from "@/components/shop/SiteHeader";
import SiteFooter from "@/components/shop/SiteFooter";
import { useSession } from "@/api/auth";
import { useHydrated } from "@/lib/use-hydrated";
import { useAsyncData } from "@/lib/use-async-data";
import { listReviews } from "@/api/reviews";

export default function UlasanRiwayatPage() {
  const router = useRouter();
  const session = useSession();
  const hydrated = useHydrated();
  const { data, loading, error } = useAsyncData("reviews:me", listReviews);
  const reviews = data ?? [];

  useEffect(() => {
    if (hydrated && !session) {
      router.replace("/login?next=/pesanan/ulasan/riwayat");
    }
  }, [session, router, hydrated]);

  if (!session) return null;

  return (
    <div className={`${inter.className} flex min-h-screen flex-col bg-slate-50 text-slate-900`}>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <h1 className="mb-4 text-2xl font-bold">Riwayat Ulasan</h1>
          {loading ? (
            <p className="text-slate-600">Memuat…</p>
          ) : error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : reviews.length === 0 ? (
            <p className="text-slate-600">Belum ada ulasan yang dikirim.</p>
          ) : (
            <ul className="space-y-4">
              {reviews.map((review, index) => (
                <li key={`${review.orderId}-${review.productId}-${index}`} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="font-semibold">{review.productName}</p>
                    <p className="text-sm text-yellow-500">{"★".repeat(review.rating)}</p>
                  </div>
                  {review.comment && <p className="mt-1 text-sm text-slate-600">{review.comment}</p>}
                  <p className="mt-2 text-xs text-slate-400">
                    Order: {review.orderId} • {new Date(review.submittedAt).toLocaleString("id-ID")}
                  </p>
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
