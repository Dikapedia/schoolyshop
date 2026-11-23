import { z } from "zod";
import { request } from "./client";

const returnStatusSchema = z.enum([
  "Menunggu Keputusan",
  "Disetujui",
  "Ditolak",
]);
export type ReturnStatus = z.infer<typeof returnStatusSchema>;

const returnItemRowSchema = z.object({
  id: z.number(),
  orderItemId: z.number().nullable(),
  productId: z.number().nullable(),
  productName: z.string(),
  variantId: z.number().nullable(),
  variantSize: z.string().nullable(),
  qty: z.number(),
  reason: z.string(),
});

const returnRowSchema = z.object({
  id: z.number(),
  orderId: z.number(),
  status: returnStatusSchema,
  decisionAt: z.string().nullable(),
  refundMethod: z.string().nullable(),
  refundProofUrl: z.string().nullable(),
  adminNote: z.string().nullable(),
  submittedAt: z.string(),
  items: z.array(returnItemRowSchema),
  photos: z.array(
    z.object({
      id: z.number(),
      url: z.string(),
      originalName: z.string(),
      mimeType: z.string(),
      size: z.number(),
    }),
  ),
});

const returnListSchema = z.object({ data: z.array(returnRowSchema) });

/** Bentuk retur yang dipakai halaman lama (ID sebagai string). */
export const returnItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  qty: z.number(),
  reason: z.string(),
});
export type ReturnItem = z.infer<typeof returnItemSchema>;

export const returnRequestSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  status: returnStatusSchema,
  adminNote: z.string().nullable(),
  submittedAt: z.string(),
  items: z.array(returnItemSchema),
});
export type ReturnRequest = z.infer<typeof returnRequestSchema>;

export type CreateReturnInput = {
  orderId: number;
  items: Array<{ orderItemId: number; qty: number; reason: string }>;
};

function toReturn(row: z.infer<typeof returnRowSchema>): ReturnRequest {
  return {
    id: String(row.id),
    orderId: String(row.orderId),
    status: row.status,
    adminNote: row.adminNote,
    submittedAt: row.submittedAt,
    items: row.items.map((item) => ({
      productId: String(item.productId ?? item.orderItemId ?? item.id),
      name: item.productName,
      qty: item.qty,
      reason: item.reason,
    })),
  };
}

/** GET /returns */
export async function listReturns(): Promise<ReturnRequest[]> {
  const payload = await request("/returns", { responseSchema: returnListSchema });
  return payload.data.map(toReturn);
}

/** POST /returns */
export async function createReturn(
  input: CreateReturnInput,
): Promise<ReturnRequest> {
  const row = await request("/returns", {
    method: "POST",
    body: input,
    responseSchema: returnRowSchema,
    statusMessages: {
      409: "Pesanan sudah memiliki pengajuan retur aktif.",
      422: "Pesanan belum dapat diretur.",
    },
  });
  return toReturn(row);
}

/**
 * Upload foto bukti pengembalian.
 *
 * Backend menerima `multipart/form-data` dengan field `photos` (array file),
 * endpoint: `POST /returns/:id/photos`.
 */
export async function uploadReturnPhoto(
  returnId: number,
  files: File[],
): Promise<ReturnRequest> {
  const formData = new FormData();
  for (const file of files) {
    formData.append("photos", file);
  }

  const row = await request(`/returns/${returnId}/photos`, {
    method: "POST",
    body: formData,
    responseSchema: returnRowSchema,
  });
  return toReturn(row);
}
