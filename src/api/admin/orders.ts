import { ADMIN_ORDER_MOCKS } from "../mocks/admin/orders";

export type PaymentStatus = "Berhasil" | "Menunggu Pembayaran";

export type OrderStatus =
  | "Menunggu Pembayaran"
  | "Menunggu Verifikasi"
  | "Diproses"
  | "Dikirim"
  | "Selesai";

export type AdminOrder = {
  id: string;
  customer: string;
  product: string;
  total: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
};

export const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  "Menunggu Pembayaran",
  "Menunggu Verifikasi",
  "Diproses",
  "Dikirim",
  "Selesai",
];

/**
 * TODO(backend): ganti dengan GET /admin/orders?page=&search=&status=.
 */
export function getAdminOrders(): AdminOrder[] {
  return ADMIN_ORDER_MOCKS;
}
