import { request } from "../client";

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
  buyerType?: string;
  createdAt?: string;
};

export const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  "Menunggu Pembayaran",
  "Menunggu Verifikasi",
  "Diproses",
  "Dikirim",
  "Selesai",
];

export type AdminOrderFilters = {
  search?: string;
  paymentStatus?: PaymentStatus;
  orderStatus?: OrderStatus;
};

function orderQuery(filters: AdminOrderFilters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.paymentStatus) params.set("paymentStatus", filters.paymentStatus);
  if (filters.orderStatus) params.set("orderStatus", filters.orderStatus);
  const query = params.toString();
  return query ? `?${query}` : "";
}

/** GET /admin/orders?page=&search=&paymentStatus=&orderStatus= */
export function getAdminOrders(
  filters: AdminOrderFilters = {},
): Promise<AdminOrder[]> {
  return request<AdminOrder[]>(`/admin/orders${orderQuery(filters)}`);
}

/** POST /admin/orders/:id/verify */
export function verifyAdminOrder(id: string): Promise<AdminOrder> {
  return request<AdminOrder>(`/admin/orders/${id}/verify`, { method: "POST" });
}
