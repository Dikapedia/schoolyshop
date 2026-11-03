import type { InvoiceDetail } from "../invoices";

/**
 * Invoice demo untuk akun `user-1`.
 *
 * TODO(backend): ganti dengan URL invoice dari GET /orders/:id/invoice.
 */
export const SEED_INVOICES: Record<string, Record<string, string>> = {
  "user-1": {
    "order-001": "invoice-001.pdf",
    "order-002": "invoice-002.pdf",
    "order-003": "invoice-003.pdf",
  },
};

/**
 * Detail konsumen/pembayaran invoice contoh.
 *
 * TODO(backend): ganti dengan GET /orders/:id/invoice. Saat ini semua
 * invoice menampilkan data konsumen yang sama seperti implementasi lama.
 */
export const INVOICE_DETAIL_MOCK: InvoiceDetail = {
  customerName: "Nabila Putri Ramadhani",
  customerType: "Siswa Sekolah Menengah Kejuruan Negeri 1 Bandung",
  customerEmail: "nabila@example.com",
  customerPhone: "+62 812-3456-7890",
  shippingAddress:
    "Jalan Cikondang No. 45, Ngesrep, Kec. Coblong, Kota Bandung",
  shippingPostalCode: "40115",
  recipient: "Nabila Putri Ramadhani",
  paymentMethod: "Virtual Account BCA",
  virtualAccountNumber: "8801 2025 0101 001",
};
