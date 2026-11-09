import type { PaymentBank } from "../payments";

/**
 * Daftar bank Virtual Account contoh untuk halaman pembayaran.
 *
 * TODO(backend): ganti dengan response POST /payments (Midtrans VA) berisi
 * paymentId, method, vaNumber, expiresAt, dan status.
 */
export const PAYMENT_BANK_MOCKS: PaymentBank[] = [
  { id: "bca", name: "BCA", vaNumber: "8801 2025 0101 001" },
  { id: "bni", name: "BNI", vaNumber: "9881 2025 0101 002" },
  { id: "mandiri", name: "Mandiri", vaNumber: "8950 2025 0101 003" },
  { id: "bri", name: "BRI", vaNumber: "8881 2025 0101 004" },
  { id: "bsi", name: "BSI", vaNumber: "9001 2025 0101 005" },
  { id: "btn", name: "BTN", vaNumber: "8830 2025 0101 006" },
  { id: "cimb", name: "CIMB Niaga", vaNumber: "8600 2025 0101 007" },
  { id: "permata", name: "Permata", vaNumber: "8520 2025 0101 008" },
];
