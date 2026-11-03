import type { AdminOrderDetail } from "../../admin/order-details";

export const PRODUCT_META: Record<string, { seller: string; sku: string }> = {
  "Kemeja Batik": { seller: "Supplier Batik Semarang", sku: "SCH-BTK-001" },
  "Tote Bag Batik": { seller: "Konveksi Batik Solo", sku: "SCH-TTB-002" },
  "Dompet Batik": { seller: "Pengrajin Batik Pekalongan", sku: "SCH-DMT-003" },
  "Tas Anyaman": { seller: "Kerajinan Anyaman Kudus", sku: "SCH-TSY-004" },
  "Outer Batik": { seller: "Supplier Batik Semarang", sku: "SCH-OTR-005" },
  "Gantungan Kunci Kayu": { seller: "Kerajinan Kayu Jepara", sku: "SCH-GKK-006" },
  "Kerajinan Batik": { seller: "Supplier Batik Semarang", sku: "SCH-KRB-007" },
};

export const DEFAULT_ORDER_ADDRESS =
  "Jl. Pendidikan No. 45, RT 03/RW 05, Kebayoran Baru, Jakarta Selatan, 12150";

export const ORD_001_MOCK: AdminOrderDetail = {
  id: "ORD-001",
  buyer: {
    name: "Budi Santoso",
    type: "Pelajar / Siswa",
    contact: "0812-9876-5432",
    email: "budi.santoso@schooly.id",
    orderedAt: "12 Oktober 2026, 09:30 WIB",
    address: DEFAULT_ORDER_ADDRESS,
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
