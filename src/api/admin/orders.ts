import { adminRequest } from "./client";
import {
  fetchAllAdminPages,
  formatAdminRupiah,
} from "./shared";

/**
 * Status pembayaran yang ditampilkan UI. Nilai backend (huruf kecil, bahasa
 * Inggris) dipetakan ke label Indonesia agar badge dan filter tetap terbaca.
 */
export type PaymentStatus =
  | "Berhasil"
  | "Menunggu Pembayaran"
  | "Kedaluwarsa"
  | "Dikembalikan"
  | "Sebagian Dikembalikan";

export type OrderStatus =
  | "Menunggu Pembayaran"
  | "Menunggu Verifikasi"
  | "Diproses"
  | "Dikirim"
  | "Dalam Pengembalian"
  | "Selesai"
  | "Dibatalkan";

export type AdminOrder = {
  id: string;
  customer: string;
  product: string;
  total: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  buyerType?: string;
  paymentMethod?: string;
  itemCount?: number;
  createdAt?: string;
};

export const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  "Menunggu Pembayaran",
  "Menunggu Verifikasi",
  "Diproses",
  "Dikirim",
  "Dalam Pengembalian",
  "Selesai",
  "Dibatalkan",
];

export type AdminOrderFilters = {
  search?: string;
  paymentStatus?: PaymentStatus;
  orderStatus?: OrderStatus;
};

/** Baris dari `GET /admin/orders` (backend). */
export type AdminOrderRow = {
  id: number;
  status: OrderStatus;
  orderStatus?: OrderStatus;
  paymentStatus: string;
  paymentMethod: string | null;
  buyer?: {
    name: string;
    email: string;
    phone: string;
  };
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  total: number;
  itemCount: number;
  productName: string | null;
  createdAt: string;
};

export function mapPaymentStatus(status: string | null | undefined): PaymentStatus {
  switch (status) {
    case "paid":
      return "Berhasil";
    case "refunded":
      return "Dikembalikan";
    case "partial_refund":
      return "Sebagian Dikembalikan";
    case "expired":
      return "Kedaluwarsa";
    case "pending":
    case "unpaid":
    default:
      return "Menunggu Pembayaran";
  }
}

function toBackendPaymentStatus(status: PaymentStatus | undefined) {
  switch (status) {
    case "Berhasil":
      return "paid";
    case "Menunggu Pembayaran":
      return "pending";
    case "Kedaluwarsa":
      return "expired";
    case "Dikembalikan":
      return "refunded";
    case "Sebagian Dikembalikan":
      return "partial_refund";
    default:
      return undefined;
  }
}

export function mapAdminOrder(row: AdminOrderRow): AdminOrder {
  const itemCount = row.itemCount ?? 0;
  const productName = row.productName ?? "-";
  const product =
    itemCount > 1 ? `${productName} +${itemCount - 1} lainnya` : productName;

  return {
    id: String(row.id),
    customer: row.buyer?.name ?? row.buyerName ?? "-",
    product,
    total: formatAdminRupiah(row.total),
    paymentStatus: mapPaymentStatus(row.paymentStatus),
    orderStatus: row.orderStatus ?? row.status,
    paymentMethod: row.paymentMethod ?? undefined,
    itemCount,
    createdAt: row.createdAt,
  };
}

/** GET /admin/orders?page=&search=&paymentStatus=&orderStatus= */
export async function getAdminOrders(
  filters: AdminOrderFilters = {},
): Promise<AdminOrder[]> {
  const rows = await fetchAllAdminPages<AdminOrderRow>("/admin/orders", {
    search: filters.search,
    paymentStatus: toBackendPaymentStatus(filters.paymentStatus),
    orderStatus: filters.orderStatus,
  });

  return rows.map(mapAdminOrder);
}

/** POST /admin/orders/:id/verify */
export function verifyAdminOrder(
  id: string,
  decision: "approve" | "reject" = "approve",
  reason?: string,
): Promise<void> {
  return adminRequest<void>(`/admin/orders/${id}/verify`, {
    method: "POST",
    body: { decision, ...(reason ? { reason } : {}) },
  });
}
