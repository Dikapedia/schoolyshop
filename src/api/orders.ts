import { z } from "zod";
import { ORDERS_KEY } from "./mocks/keys";
import {
  readRaw,
  readUserCollection,
  readUserMap,
  writeJson,
  writeUserCollection,
} from "./mocks/storage";

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
 * Buat pesanan baru dari draft checkout (mock / frontend-only).
 *
 * TODO(backend): ganti dengan POST /orders dan buat order via Midtrans.
 */
export function createOrder(input: {
  sessionId: string;
  items: OrderItem[];
  addressId?: string;
  shippingId?: string;
  total: number;
  paymentMethod: string;
}): string {
  const orderId = `order-${Date.now()}`;
  const order: Order = {
    id: orderId,
    date: new Date().toISOString(),
    items: input.items,
    total: input.total,
    status: "Menunggu Pembayaran",
  };

  const all = readUserMap<Order[]>(ORDERS_KEY) ?? {};
  const byUser = all[input.sessionId] ?? [];
  all[input.sessionId] = [...byUser, order];
  writeUserCollection(ORDERS_KEY, input.sessionId, all[input.sessionId]);

  return orderId;
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
