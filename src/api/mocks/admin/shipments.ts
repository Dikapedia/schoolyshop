import type { AdminShipment, AdminShipmentDetail, AdminTrackingStep } from "../../admin/shipments";

export const ADMIN_SHIPMENT_MOCKS: AdminShipment[] = [
  {
    id: "ORD-001",
    customer: "Budi Santoso",
    product: "Kemeja Batik",
    total: "Rp120.000",
    courier: "Belum dipilih",
    trackingNumber: "Belum tersedia",
    status: "Siap Dikirim",
  },
  {
    id: "ORD-003",
    customer: "Hardika Pratama",
    product: "Dompet Batik",
    total: "Rp65.000",
    courier: "Belum dipilih",
    trackingNumber: "Belum tersedia",
    status: "Siap Dikirim",
  },
  {
    id: "ORD-004",
    customer: "Reza Firmansyah",
    product: "Tas Anyaman",
    total: "Rp95.000",
    courier: "SiCepat REG",
    trackingNumber: "SC910284719",
    status: "Dikirim",
  },
  {
    id: "ORD-006",
    customer: "Dimas Prakoso",
    product: "Gantungan Kunci Kayu",
    total: "Rp35.000",
    courier: "SiCepat REG",
    trackingNumber: "SC820194812",
    status: "Selesai",
  },
  {
    id: "ORD-009",
    customer: "Yoga Pratama",
    product: "Dompet Batik",
    total: "Rp55.000",
    courier: "JNE REG",
    trackingNumber: "JNE71829013",
    status: "Dikirim",
  },
];

export const SHIPMENT_OVERRIDES: Record<string, Partial<AdminShipmentDetail>> = {
  "ORD-001": {
    courier: "J&T Express",
    service: "Regular Service",
    trackingNumber: "JT8829103841",
    shippedAt: "14 Oktober 2026, 14:30 WIB",
    address:
      "Jl. Pendidikan No. 45, RT 03/RW 05, Kebayoran Baru, Jakarta Selatan, 12150",
    status: "Dikirim",
  },
};

export const DEFAULT_SHIPMENT_ADDRESS =
  "Jl. Pendidikan No. 45, RT 03/RW 05, Kebayoran Baru, Jakarta Selatan, 12150";

/**
 * Riwayat pelacakan contoh untuk halaman admin.
 *
 * TODO(backend): ganti dengan response webhook/API kurir per nomor resi.
 */
export const ADMIN_TRACKING_STEP_MOCKS: AdminTrackingStep[] = [
  {
    title: "Pengiriman berhasil dibuat",
    time: "14 Oktober 2026, 14:30 WIB",
    description:
      "Pengiriman ORD-001 telah berhasil dikonfirmasi dan tiket resi kurir JT8829103841 diterbitkan.",
    state: "done",
    badge: "Selesai",
  },
  {
    title: "Paket dijemput kurir dari Semarang",
    time: "14 Oktober 2026, 17:15 WIB",
    description:
      "Paket telah diserahkan kepada kurir J&T Express di Hub Logistik Semarang dan dipersiapkan untuk perjalanan antar-kota.",
    state: "done",
    badge: "Selesai",
  },
  {
    title: "Paket dalam perjalanan menuju kota tujuan",
    time: "15 Oktober 2026, 08:20 WIB",
    description:
      "Paket tiba di Transit Hub Jakarta dan sedang dijadwalkan untuk pengantaran ke tujuan (Jakarta Selatan).",
    state: "active",
    badge: "Sedang berlangsung",
  },
  {
    title: "Paket diterima pembeli",
    time: "Estimasi 16 Oktober 2026",
    description:
      "Paket belum diterima oleh Budi Santoso. Menunggu proses pengantaran kurir ke alamat tujuan.",
    state: "pending",
    badge: "Menunggu",
  },
];
