import { z } from "zod";
import { ORDERS_KEY } from "./mocks/keys";
import { readRaw, readUserCollection, writeJson } from "./mocks/storage";

export const orderStatusSchema = z.enum([
  "Menunggu Pembayaran",
  "Diproses",
  "Dikirim",
  "Dalam Pengembalian",
  "Selesai",
]);
export type OrderStatus = z.infer<typeof orderStatusSchema>;

export const orderItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  qty: z.number(),
  price: z.number(),
});
export type OrderItem = z.infer<typeof orderItemSchema>;

export const orderSchema = z.object({
  id: z.string(),
  date: z.string(),
  items: z.array(orderItemSchema),
  total: z.number(),
  status: orderStatusSchema,
});
export type Order = z.infer<typeof orderSchema>;

export const ORDER_STATUS_OPTIONS: OrderStatus[] = orderStatusSchema.options;
export const ORDER_TABS = [
  { label: "Semua", value: "Semua" as const },
  ...ORDER_STATUS_OPTIONS.map((status) => ({
    label: status,
    value: status,
  })),
];

/**
 * Riwayat pesanan user.
 *
 * `null` berarti data belum ada / tidak bisa dibaca, agar halaman dapat
 * membedakannya dari daftar kosong seperti perilaku sebelumnya.
 *
 * TODO(backend): ganti dengan GET /orders?userId=me dan pindahkan filter
 * status ke query parameter.
 */
export function listOrders(userId: string): Order[] | null {
  const value = readUserCollection<unknown>(ORDERS_KEY, userId);
  if (value === null) return null;

  const parsed = orderSchema.array().safeParse(value);
  return parsed.success ? parsed.data : null;
}

/**
 * Tandai pesanan sudah diterima.
 *
 * Catatan: key `schooly/orders` (garis miring) dipertahankan persis dari
 * implementasi lama agar refactor tidak mengubah perilaku. Bug key ini
 * dicatat terpisah di docs/frontend-needs.md dan tidak diperbaiki diam-diam.
 *
 * TODO(backend): ganti dengan POST /orders/:id/receive.
 */
export function markOrderReceived(userId: string, orderId: string): void {
  const legacyKey = "schooly/orders";
  const raw = readRaw(legacyKey);
  if (!raw) return;

  try {
    const all = JSON.parse(raw) as unknown;
    if (!all || typeof all !== "object" || Array.isArray(all)) return;

    const byUser = all as Record<string, unknown>;
    const list = Array.isArray(byUser[userId])
      ? (byUser[userId] as Order[])
      : [];
    byUser[userId] = list.map((order) =>
      order.id === orderId ? { ...order, status: "Selesai" } : order,
    );
    writeJson(legacyKey, byUser);
  } catch {
    // Perilaku lama juga mengabaikan kegagalan pembacaan/penulisan.
  }
}
