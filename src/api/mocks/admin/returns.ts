import type { AdminReturn, ReturnStatus } from "../../admin/returns";

export const ADMIN_RETURN_MOCKS: AdminReturn[] = [
  {
    id: "ORD-001",
    customer: "Bellingham",
    initials: "B",
    avatarClass: "bg-amber-100 text-amber-700",
    product: "Kemeja Batik (Size L)",
    reason: "Ukuran tidak sesuai (kebesaran)",
    submittedAt: "16 Okt 2026, 09:30 WIB",
    status: "Menunggu Persetujuan",
  },
  {
    id: "ORD-003",
    customer: "Putra Junior",
    initials: "PJ",
    avatarClass: "bg-blue-100 text-blue-700",
    product: "Dompet Batik",
    reason: "Cacat jahitan samping",
    submittedAt: "16 Okt 2026, 14:15 WIB",
    status: "Menunggu Barang Kembali",
  },
  {
    id: "ORD-005",
    customer: "Luka Ridho",
    initials: "LR",
    avatarClass: "bg-purple-100 text-purple-700",
    product: "Outer Batik",
    reason: "Bahan tidak sesuai ekspektasi",
    submittedAt: "14 Okt 2026, 11:00 WIB",
    status: "Pengembalian Diproses",
  },
  {
    id: "ORD-002",
    customer: "Kylian Yusuf",
    initials: "KY",
    avatarClass: "bg-emerald-100 text-emerald-700",
    product: "Tote Bag Batik",
    reason: "Barang salah motif",
    submittedAt: "12 Okt 2026, 10:20 WIB",
    status: "Pengembalian Selesai",
  },
];

export const RETURN_STATUS_COUNTS: Record<ReturnStatus, number> = {
  "Menunggu Persetujuan": 1,
  "Menunggu Barang Kembali": 1,
  "Pengembalian Diproses": 1,
  "Pengembalian Selesai": 2,
};
