import type { Tracking } from "../shipments";

/**
 * Riwayat pelacakan contoh untuk halaman publik /pesanan/lacak.
 *
 * TODO(backend): ganti dengan GET /shipments/track?receipt=... yang
 * meneruskan response Biteship/kurir.
 */
export const TRACKING_MOCK: Omit<Tracking, "order_id"> = {
  courier: "JNE Express",
  status: "Dalam Perjalanan",
  history: [
    {
      timestamp: "2025-01-15 09:30",
      location: "Gudang Utama Koperasi SMK Suka Maju",
      description: "Pesanan telah diterima dan dikemas",
    },
    {
      timestamp: "2025-01-15 14:45",
      location: "Cikampek Semarang",
      description: "Barang berada di gudang pra-pengiriman",
    },
    {
      timestamp: "2025-01-16 09:15",
      location: "Bandung Pusat",
      description: "Barang telah keluar dari gudang",
    },
    {
      timestamp: "2025-01-16 14:30",
      location: "Tujuan",
      description: "Barang siap dikirim ke alamat",
    },
  ],
};
