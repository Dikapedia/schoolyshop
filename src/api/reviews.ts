import { z } from "zod";
import { useAsyncData } from "@/lib/use-async-data";
import { request } from "./client";

const reviewRowSchema = z.object({
  id: z.number(),
  orderId: z.number(),
  orderItemId: z.number().nullable(),
  productId: z.number().nullable(),
  productName: z.string(),
  rating: z.number(),
  comment: z.string(),
  submittedAt: z.string(),
});

const reviewListSchema = z.object({
  data: z.array(reviewRowSchema),
  meta: z.object({ total: z.number() }).passthrough().optional(),
});

const createdReviewsSchema = z.object({ data: z.array(reviewRowSchema) });

/** Bentuk ulasan yang dipakai komponen lama (ID sebagai string). */
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
  productId: number;
  rating: number;
  comment: string;
};

function toReview(row: z.infer<typeof reviewRowSchema>): Review {
  return {
    orderId: String(row.orderId),
    productId: String(row.productId ?? row.orderItemId ?? ""),
    productName: row.productName,
    rating: row.rating,
    comment: row.comment,
    submittedAt: row.submittedAt,
  };
}

/** GET /reviews */
export async function listReviews(): Promise<Review[]> {
  const payload = await request("/reviews?perPage=50", {
    responseSchema: reviewListSchema,
  });
  return payload.data.map(toReview);
}

/** POST /orders/:id/reviews */
export async function createReviews(
  orderId: number,
  drafts: ReviewDraft[],
): Promise<Review[]> {
  const payload = await request(`/orders/${orderId}/reviews`, {
    method: "POST",
    body: {
      reviews: drafts.map((draft) => ({
        productId: draft.productId,
        rating: draft.rating,
        comment: draft.comment,
      })),
    },
    responseSchema: createdReviewsSchema,
    statusMessages: {
      409: "Produk pada pesanan ini sudah diulas.",
      422: "Pesanan belum selesai atau produk tidak valid.",
    },
  });
  return payload.data.map(toReview);
}

/**
 * Ulasan milik pengguna untuk satu produk.
 *
 * Backend belum menyediakan endpoint ulasan publik per produk; daftar ini
 * berasal dari GET /reviews sehingga hanya memuat ulasan pengguna sendiri.
 */
export async function listProductReviews(productId: string): Promise<Review[]> {
  const all = await listReviews();
  return all.filter((review) => review.productId === productId);
}

/** Hook ulasan produk; gagal/401 dianggap belum ada ulasan. */
export function useProductReviews(productId: string): Review[] {
  const { data } = useAsyncData(`reviews:product:${productId}`, () =>
    listProductReviews(productId).catch(() => [] as Review[]),
  );
  return data ?? [];
}
