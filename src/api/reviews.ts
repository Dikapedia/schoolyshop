import { z } from "zod";
import { ApiError } from "./errors";
import { REVIEWS_KEY } from "./mocks/keys";
import { readRaw, readUserMap, writeJson } from "./mocks/storage";
import type { Order } from "./orders";

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
        productId: item.productId,
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

  return newReviews;
}
