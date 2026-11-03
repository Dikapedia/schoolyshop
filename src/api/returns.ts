import { z } from "zod";
import { ApiError } from "./errors";
import { RETURNS_KEY } from "./mocks/keys";
import { readRaw, readUserMap, writeJson } from "./mocks/storage";

export const returnItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  qty: z.number(),
  reason: z.string(),
});
export type ReturnItem = z.infer<typeof returnItemSchema>;

export const returnRequestSchema = z.object({
  orderId: z.string(),
  items: z.array(returnItemSchema),
  submittedAt: z.string(),
});
export type ReturnRequest = z.infer<typeof returnRequestSchema>;

export const createReturnInputSchema = returnRequestSchema.omit({
  submittedAt: true,
});
export type CreateReturnInput = z.infer<typeof createReturnInputSchema>;

/**
 * Daftar pengembalian user.
 *
 * `null` berarti data rusak/tidak bisa dibaca; daftar kosong berarti user
 * memang belum pernah mengajukan pengembalian.
 *
 * TODO(backend): ganti dengan GET /returns?userId=me dan gunakan status
 * pengembalian dari server.
 */
export function listReturns(userId: string): ReturnRequest[] | null {
  const raw = readRaw(RETURNS_KEY);
  if (!raw) return [];

  const all = readUserMap<unknown>(RETURNS_KEY);
  if (!all) return null;

  const parsed = returnRequestSchema.array().safeParse(all[userId]);
  return parsed.success ? parsed.data : null;
}

/**
 * Buat permintaan pengembalian baru.
 *
 * TODO(backend): ganti dengan POST /returns. Upload foto barang dan
 * keputusan admin belum memiliki kontrak final.
 */
export function createReturn(
  userId: string,
  input: CreateReturnInput,
): ReturnRequest {
  const parsed = createReturnInputSchema.safeParse(input);
  if (!parsed.success) {
    throw new ApiError("VALIDATION", "Data pengembalian tidak valid.", {
      details: { issues: parsed.error.issues },
    });
  }

  const raw = readRaw(RETURNS_KEY);
  let all: Record<string, unknown> = {};

  if (raw) {
    try {
      const existing = JSON.parse(raw) as unknown;
      if (
        !existing ||
        typeof existing !== "object" ||
        Array.isArray(existing)
      ) {
        throw new Error("invalid returns storage");
      }
      all = existing as Record<string, unknown>;
    } catch {
      throw new ApiError(
        "SERVER",
        "Gagal menyimpan permintaan pengembalian.",
      );
    }
  }

  const current = Array.isArray(all[userId])
    ? (all[userId] as ReturnRequest[])
    : [];
  const request: ReturnRequest = {
    ...parsed.data,
    // TODO(backend): timestamp sebaiknya dibuat server, bukan browser.
    submittedAt: new Date().toISOString(),
  };
  all[userId] = [...current, request];

  if (!writeJson(RETURNS_KEY, all)) {
    throw new ApiError("SERVER", "Gagal menyimpan permintaan pengembalian.");
  }

  return request;
}
