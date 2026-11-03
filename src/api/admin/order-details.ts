import {
  DEFAULT_ORDER_ADDRESS,
  ORD_001_MOCK,
  PRODUCT_META,
} from "../mocks/admin/order-details";
import { getAdminOrders, type OrderStatus, type PaymentStatus } from "./orders";

export type AdminOrderItem = {
  name: string;
  sku: string;
  seller: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type AdminOrderDetail = {
  id: string;
  buyer: {
    name: string;
    type: string;
    contact: string;
    email: string;
    orderedAt: string;
    address: string;
  };
  transaction: {
    provider: string;
    method: string;
    transactionId: string;
    paidAt: string;
    settledLabel: string;
  };
  warehouse: string;
  verifiedAt: string;
  items: AdminOrderItem[];
  summary: {
    subtotal: number;
    shippingLabel: string;
    shippingCost: number;
    total: number;
  };
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
};

function fallbackSku(product: string) {
  const letters = product.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase();
  return `SCH-${letters || "PRD"}-001`;
}

/**
 * TODO(backend): ganti dengan GET /admin/orders/:id. Beberapa field di sini
 * masih diturunkan dari data ringkas (email, alamat, transaksi).
 */
export function getAdminOrderDetail(
  rawId: string | undefined,
): AdminOrderDetail | undefined {
  if (!rawId) return undefined;

  const order = getAdminOrders().find(
    (item) => item.id.toLowerCase() === rawId.toLowerCase(),
  );
  if (!order) return undefined;
  if (order.id === ORD_001_MOCK.id) return ORD_001_MOCK;

  const total = Number(order.total.replace(/\D/g, ""));
  const meta = PRODUCT_META[order.product] ?? {
    seller: "Supplier Sekolah",
    sku: fallbackSku(order.product),
  };
  const firstName = order.customer.split(" ")[0].toLowerCase();
  const paid = order.paymentStatus === "Berhasil";

  return {
    id: order.id,
    buyer: {
      name: order.customer,
      type: "Pelajar / Siswa",
      contact: "0812-0000-0000",
      email: `${firstName}@schooly.id`,
      orderedAt: "12 Oktober 2026, 09:30 WIB",
      address: DEFAULT_ORDER_ADDRESS,
    },
    transaction: {
      provider: "Midtrans Gateway",
      method: "Midtrans (BCA VA / QRIS)",
      transactionId: `TRX-${order.id.replace("-", "")}`,
      paidAt: paid ? "12 Oktober 2026, 09:35 WIB" : "-",
      settledLabel: paid ? "Midtrans Settle Confirmed" : "Menunggu Pembayaran",
    },
    warehouse: "Semarang Central",
    verifiedAt: "12 Oktober 2026, 09:40 WIB",
    items: [
      {
        name: order.product,
        sku: meta.sku,
        seller: meta.seller,
        quantity: 1,
        unitPrice: total,
        subtotal: total,
      },
    ],
    summary: {
      subtotal: total,
      shippingLabel: "Promo Kampus",
      shippingCost: 0,
      total,
    },
    orderStatus: order.orderStatus,
    paymentStatus: order.paymentStatus,
  };
}
