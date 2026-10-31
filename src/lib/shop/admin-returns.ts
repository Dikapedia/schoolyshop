export type ReturnStatus =
  | "Menunggu Persetujuan"
  | "Menunggu Barang Kembali"
  | "Pengembalian Diproses"
  | "Pengembalian Selesai";

export type AdminReturn = {
  id: string;
  customer: string;
  initials: string;
  avatarClass: string;
  product: string;
  reason: string;
  submittedAt: string;
  status: ReturnStatus;
};

export const ADMIN_RETURNS: AdminReturn[] = [
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

export const RETURN_STATUS_OPTIONS: ReturnStatus[] = [
  "Menunggu Persetujuan",
  "Menunggu Barang Kembali",
  "Pengembalian Diproses",
  "Pengembalian Selesai",
];

export function getReturnStatusTone(status: ReturnStatus) {
  switch (status) {
    case "Menunggu Persetujuan":
      return { badge: "bg-orange-50 text-orange-700", dot: "bg-orange-500" };
    case "Menunggu Barang Kembali":
      return { badge: "bg-blue-50 text-blue-700", dot: "bg-blue-500" };
    case "Pengembalian Diproses":
      return { badge: "bg-purple-50 text-purple-700", dot: "bg-purple-500" };
    case "Pengembalian Selesai":
      return { badge: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" };
  }
}
