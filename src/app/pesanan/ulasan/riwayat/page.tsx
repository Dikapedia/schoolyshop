"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { inter } from "@/lib/fonts";
import SiteHeader from "@/components/shop/SiteHeader";
import SiteFooter from "@/components/shop/SiteFooter";
import { useSession } from "@/lib/auth/use-session";

type Review = {
  orderId: string;
  productId: string;
  productName: string;
  rating: number;
  comment: string;
  submittedAt: string;
};

export default function UlasanRiwayatPage() {
  const router = useRouter();
  const session = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session) {
      router.replace("/login?next=/pesanan/ulasan/riwayat");
      return;
    }
    try {
      const raw = window.localStorage.getItem("schooly.reviews");
      if (!raw) {
        setReviews([]);
      } else {
        const all: Record<string, Review[]> = JSON.parse(raw);
        setReviews(all[session.id] ?? []);
      }
    } catch {
      setError("Gagal memuat ulasan.");
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
          <h1 className="mb-4 text-2xl font-bold">Riwayat Ulasan</h1>
          {reviews.length === 0 ? (
            <p className="text-slate-600">Belum ada ulasan yang dikirim.</p>
          ) : (
            <ul className="space-y-4">
              {reviews.map((r, idx) => (
                <li key={idx} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold">{r.productName}</p>
                    <p className="text-sm text-yellow-500">{"★".repeat(r.rating)}</p>
                  </div>
                  {r.comment && <p className="text-sm text-slate-600 mt-1">{r.comment}</p>}
                  <p className="text-xs text-slate-400 mt-2">Order: {r.orderId} • {new Date(r.submittedAt).toLocaleString()}</p>
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
