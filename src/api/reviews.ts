import { useMemo, useSyncExternalStore } from "react";
import { z } from "zod";
import { ApiError } from "./errors";
import { REVIEWS_KEY } from "./mocks/keys";
import { readRaw, readUserMap, writeJson } from "./mocks/storage";
import type { Order } from "./orders";
import { resolveProductId } from "./products";

export const reviewSchema = z.object({
  orderId: z.string(),
  productId: z.string(),
  productName: z.string(),
  rating: z.number(),
  comment: z.string(),
  submittedAt: z.string(),
});
export type Review = z.infer<typeof reviewSchema>;

export type ReviewDraft = {
  productId: string;
  rating: number;
  comment: string;
};

const REVIEWS_EVENT = "schooly:reviews";

function notifyReviewsChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(REVIEWS_EVENT));
}

function subscribeReviews(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener(REVIEWS_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(REVIEWS_EVENT, callback);
  };
}

/**
 * Riwayat ulasan user.
 *
 * `null` berarti data rusak/tidak bisa dibaca; daftar kosong berarti user
 * belum pernah mengirim ulasan.
 *
 * TODO(backend): ganti dengan GET /reviews?userId=me.
 */
export function listReviews(userId: string): Review[] | null {
  const raw = readRaw(REVIEWS_KEY);
  if (!raw) return [];

  const all = readUserMap<unknown>(REVIEWS_KEY);
  if (!all) return null;

  const parsed = reviewSchema.array().safeParse(all[userId]);
  return parsed.success ? parsed.data : null;
}

/**
 * Semua ulasan untuk satu produk, dari seluruh user.
 *
 * Dipakai halaman produk agar ulasan yang baru dikirim langsung terlihat.
 *
 * TODO(backend): ganti dengan GET /products/:id/reviews.
 */
export function listProductReviews(productId: string): Review[] {
  const all = readUserMap<unknown>(REVIEWS_KEY);
  if (!all) return [];

  const normalizedId = resolveProductId(productId);
  const result: Review[] = [];

  for (const value of Object.values(all)) {
    const parsed = reviewSchema.array().safeParse(value);
    if (!parsed.success) continue;
    result.push(
      ...parsed.data.filter(
        (review) => resolveProductId(review.productId) === normalizedId,
      ),
    );
  }

  return result.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

/**
 * Hook ulasan produk untuk komponen client.
 *
 * Snapshot berupa string agar `useSyncExternalStore` stabil; daftar baru
 * dibaca ulang saat ada event `storage` atau ulasan baru disimpan.
 */
export function useProductReviews(productId: string): Review[] {
  const snapshot = useSyncExternalStore(
    subscribeReviews,
    () => JSON.stringify(listProductReviews(productId)),
    () => "[]",
  );

  return useMemo(() => {
    try {
      return JSON.parse(snapshot) as Review[];
    } catch {
      return [];
    }
  }, [snapshot]);
}

/**
 * Simpan ulasan untuk item pesanan yang diberi rating.
 *
 * TODO(backend): ganti dengan POST /orders/:id/reviews dan konfirmasi apakah
 * backend mengizinkan satu ulasan per item atau banyak ulasan.
 */
export function createReviews(
  userId: string,
  order: Order,
  drafts: ReviewDraft[],
): Review[] {
  const byProduct = new Map(
    drafts.map((draft) => [draft.productId, draft]),
  );

  const newReviews = order.items
    .filter((item) => (byProduct.get(item.productId)?.rating ?? 0) > 0)
    .map((item) => {
      const draft = byProduct.get(item.productId)!;
      return {
        orderId: order.id,
        productId: resolveProductId(item.productId),
        productName: item.name,
        rating: draft.rating,
        comment: draft.comment || "",
        // TODO(backend): timestamp ulasan sebaiknya dibuat server.
        submittedAt: new Date().toISOString(),
      };
    });

  const raw = readRaw(REVIEWS_KEY);
  let all: Record<string, unknown> = {};

  if (raw) {
    try {
      const existing = JSON.parse(raw) as unknown;
      if (
        !existing ||
        typeof existing !== "object" ||
        Array.isArray(existing)
      ) {
        throw new Error("invalid reviews storage");
      }
      all = existing as Record<string, unknown>;
    } catch {
      throw new ApiError("SERVER", "Gagal menyimpan ulasan.");
    }
  }

  const current = Array.isArray(all[userId])
    ? (all[userId] as Review[])
    : [];
  all[userId] = [...current, ...newReviews];

  if (!writeJson(REVIEWS_KEY, all)) {
    throw new ApiError("SERVER", "Gagal menyimpan ulasan.");
  }
  notifyReviewsChanged();

  return newReviews;
}
