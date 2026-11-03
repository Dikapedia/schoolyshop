import type { AdminOrder } from "../../admin/orders";

/**
 * Daftar pesanan admin contoh.
 *
 * TODO(backend): hapus setelah GET /admin/orders tersedia.
 */
export const ADMIN_ORDER_MOCKS: AdminOrder[] = [
  { id: "ORD-001", customer: "Budi Santoso", product: "Kemeja Batik", total: "Rp120.000", paymentStatus: "Berhasil", orderStatus: "Diproses" },
  { id: "ORD-002", customer: "Ghofuur Ramadhan", product: "Tote Bag Batik", total: "Rp75.000", paymentStatus: "Menunggu Pembayaran", orderStatus: "Menunggu Pembayaran" },
  { id: "ORD-003", customer: "Hardika Pratama", product: "Dompet Batik", total: "Rp65.000", paymentStatus: "Berhasil", orderStatus: "Diproses" },
  { id: "ORD-004", customer: "Reza Firmansyah", product: "Tas Anyaman", total: "Rp95.000", paymentStatus: "Berhasil", orderStatus: "Dikirim" },
  { id: "ORD-005", customer: "Kaji Saputra", product: "Outer Batik", total: "Rp175.000", paymentStatus: "Menunggu Pembayaran", orderStatus: "Menunggu Pembayaran" },
  { id: "ORD-006", customer: "Dimas Prakoso", product: "Gantungan Kunci Kayu", total: "Rp35.000", paymentStatus: "Berhasil", orderStatus: "Diproses" },
  { id: "ORD-007", customer: "Fajar Nugroho", product: "Kemeja Batik", total: "Rp130.000", paymentStatus: "Menunggu Pembayaran", orderStatus: "Menunggu Pembayaran" },
  { id: "ORD-008", customer: "Raka Mahendra", product: "Tote Bag Batik", total: "Rp75.000", paymentStatus: "Berhasil", orderStatus: "Menunggu Verifikasi" },
  { id: "ORD-009", customer: "Yoga Pratama", product: "Dompet Batik", total: "Rp55.000", paymentStatus: "Berhasil", orderStatus: "Dikirim" },
  { id: "ORD-010", customer: "Nabila Putri", product: "Kerajinan Batik", total: "Rp85.000", paymentStatus: "Berhasil", orderStatus: "Menunggu Verifikasi" },
];
