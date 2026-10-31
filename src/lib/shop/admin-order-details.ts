import { ADMIN_ORDERS, type OrderStatus, type PaymentStatus } from "./admin-orders";

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

const PRODUCT_META: Record<string, { seller: string; sku: string }> = {
  "Kemeja Batik": { seller: "Supplier Batik Semarang", sku: "SCH-BTK-001" },
  "Tote Bag Batik": { seller: "Konveksi Batik Solo", sku: "SCH-TTB-002" },
  "Dompet Batik": { seller: "Pengrajin Batik Pekalongan", sku: "SCH-DMT-003" },
  "Tas Anyaman": { seller: "Kerajinan Anyaman Kudus", sku: "SCH-TSY-004" },
  "Outer Batik": { seller: "Supplier Batik Semarang", sku: "SCH-OTR-005" },
  "Gantungan Kunci Kayu": { seller: "Kerajinan Kayu Jepara", sku: "SCH-GKK-006" },
  "Kerajinan Batik": { seller: "Supplier Batik Semarang", sku: "SCH-KRB-007" },
};

const DEFAULT_ADDRESS =
  "Jl. Pendidikan No. 45, RT 03/RW 05, Kebayoran Baru, Jakarta Selatan, 12150";

const ORD_001: AdminOrderDetail = {
  id: "ORD-001",
  buyer: {
    name: "Budi Santoso",
    type: "Pelajar / Siswa",
    contact: "0812-9876-5432",
    email: "budi.santoso@schooly.id",
    orderedAt: "12 Oktober 2026, 09:30 WIB",
    address: DEFAULT_ADDRESS,
  },
  transaction: {
    provider: "Midtrans Gateway",
    method: "Midtrans (BCA VA / QRIS)",
    transactionId: "TRX-ORD001",
    paidAt: "12 Oktober 2026, 09:35 WIB",
    settledLabel: "Midtrans Settle Confirmed",
  },
  warehouse: "Semarang Central",
  verifiedAt: "12 Oktober 2026, 09:40 WIB",
  items: [
    {
      name: "Kemeja Batik",
      sku: "SCH-BTK-001",
      seller: "Supplier Batik Semarang",
      quantity: 1,
      unitPrice: 120000,
      subtotal: 120000,
    },
  ],
  summary: {
    subtotal: 120000,
    shippingLabel: "Promo Kampus",
    shippingCost: 0,
    total: 120000,
  },
  orderStatus: "Diproses",
  paymentStatus: "Berhasil",
};

function fallbackSku(product: string) {
  const letters = product.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase();
  return `SCH-${letters || "PRD"}-001`;
}

export function getAdminOrderDetail(rawId: string | undefined): AdminOrderDetail | undefined {
  if (!rawId) return undefined;

  const order = ADMIN_ORDERS.find((item) => item.id.toLowerCase() === rawId.toLowerCase());
  if (!order) return undefined;
  if (order.id === ORD_001.id) return ORD_001;

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
      address: DEFAULT_ADDRESS,
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
