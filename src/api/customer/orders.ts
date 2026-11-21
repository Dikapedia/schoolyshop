import { request } from "../client";
import {
  invoiceSchema,
  orderListSchema,
  orderSchema,
  type CustomerInvoice,
  type CustomerOrder,
  type CustomerOrderStatus,
  type CustomerPaymentStatus,
} from "./schemas";

export type {
  CustomerInvoice,
  CustomerOrder,
  CustomerOrderItem,
  CustomerOrderStatus,
  CustomerPaymentStatus,
} from "./schemas";

export const CUSTOMER_ORDER_STATUSES: CustomerOrderStatus[] = [
  "Menunggu Pembayaran",
  "Menunggu Verifikasi",
  "Diproses",
  "Dikirim",
  "Dalam Pengembalian",
  "Selesai",
  "Dibatalkan",
];

export const CUSTOMER_ORDER_TABS: Array<{
  label: string;
  value: "Semua" | CustomerOrderStatus;
}> = [
  { label: "Semua", value: "Semua" },
  ...CUSTOMER_ORDER_STATUSES.map((status) => ({
    label: status,
    value: status,
  })),
];

/** GET /orders */
export async function listCustomerOrders(): Promise<CustomerOrder[]> {
  const payload = await request("/orders?perPage=50", {
    responseSchema: orderListSchema,
  });

  return payload.data;
}

/** GET /orders/:id */
export function getCustomerOrder(id: number): Promise<CustomerOrder> {
  return request(`/orders/${id}`, { responseSchema: orderSchema });
}

/** POST /orders/:id/receive */
export function receiveCustomerOrder(id: number): Promise<CustomerOrder> {
  return request(`/orders/${id}/receive`, {
    method: "POST",
    responseSchema: orderSchema,
  });
}

/** GET /orders/:id/invoice */
export function getCustomerInvoice(id: number): Promise<CustomerInvoice> {
  return request(`/orders/${id}/invoice`, { responseSchema: invoiceSchema });
}

export function paymentStatusLabel(
  status: CustomerPaymentStatus,
  method: string | null,
): string {
  switch (status) {
    case "paid":
      return method ? `Lunas - ${method}` : "Lunas";
    case "pending":
      return "Menunggu Pembayaran";
    case "unpaid":
      return "Belum Dibayar";
    case "expired":
      return "Pembayaran Kedaluwarsa";
    case "partial_refund":
      return "Refund Sebagian";
    case "refunded":
      return "Dana Dikembalikan";
    default:
      return status;
  }
}

export function paymentStatusTone(status: CustomerPaymentStatus): string {
  switch (status) {
    case "paid":
      return "bg-emerald-50 text-emerald-700";
    case "pending":
      return "bg-amber-50 text-amber-700";
    case "unpaid":
      return "bg-slate-100 text-slate-700";
    case "expired":
      return "bg-red-50 text-red-700";
    case "partial_refund":
    case "refunded":
      return "bg-blue-50 text-blue-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export function orderStatusTone(status: CustomerOrderStatus): string {
  switch (status) {
    case "Menunggu Pembayaran":
      return "bg-amber-50 text-amber-700";
    case "Menunggu Verifikasi":
      return "bg-indigo-50 text-indigo-700";
    case "Diproses":
      return "bg-blue-50 text-blue-700";
    case "Dikirim":
      return "bg-sky-50 text-sky-700";
    case "Dalam Pengembalian":
      return "bg-orange-50 text-orange-700";
    case "Selesai":
      return "bg-emerald-50 text-emerald-700";
    case "Dibatalkan":
      return "bg-red-50 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}
