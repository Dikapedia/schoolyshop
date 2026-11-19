import { z } from "zod";
import { ORDERS_KEY } from "./mocks/keys";
import {
  readUserCollection,
  readUserMap,
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
  notifyOrdersChanged();

  return orderId;
}

/** Event internal agar halaman yang menampilkan pesanan ikut refresh. */
export const ORDERS_EVENT = "schooly:orders";

function notifyOrdersChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(ORDERS_EVENT));
}

/**
 * Ubah status satu pesanan di penyimpanan per-user.
 *
 * Semua perubahan status lewat helper ini supaya key yang dipakai selalu
 * sama dengan `listOrders` dan halaman lain mendapat notifikasi.
 */
function updateOrderStatus(
  userId: string,
  orderId: string,
  status: OrderStatus,
): boolean {
  const value = readUserCollection<unknown>(ORDERS_KEY, userId);
  if (value === null) return false;

  const parsed = orderSchema.array().safeParse(value);
  if (!parsed.success) return false;

  const updated = parsed.data.map((order) =>
    order.id === orderId ? { ...order, status } : order,
  );
  writeUserCollection(ORDERS_KEY, userId, updated);
  notifyOrdersChanged();
  return true;
}

/**
 * Tandai pesanan sudah diterima.
 *
 * TODO(backend): ganti dengan POST /orders/:id/receive.
 */
export function markOrderReceived(userId: string, orderId: string): boolean {
  return updateOrderStatus(userId, orderId, "Selesai");
}

/**
 * Tandai pesanan sedang dalam proses pengembalian.
 *
 * TODO(backend): ganti dengan POST /orders/:id/return.
 */
export function markOrderReturning(userId: string, orderId: string): boolean {
  return updateOrderStatus(userId, orderId, "Dalam Pengembalian");
}
