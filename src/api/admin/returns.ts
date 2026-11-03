import {
  ADMIN_RETURN_MOCKS,
  RETURN_STATUS_COUNTS,
} from "../mocks/admin/returns";

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

export const RETURN_STATUS_OPTIONS: ReturnStatus[] = [
  "Menunggu Persetujuan",
  "Menunggu Barang Kembali",
  "Pengembalian Diproses",
  "Pengembalian Selesai",
];

/**
 * TODO(backend): ganti dengan GET /admin/returns?page=&search=&status=.
 */
export function getAdminReturns(): AdminReturn[] {
  return ADMIN_RETURN_MOCKS;
}

/**
 * TODO(backend): hitung ringkasan status di server agar konsisten dengan
 * data yang terpaginasi.
 */
export function getAdminReturnStatusCounts(): Record<ReturnStatus, number> {
  return RETURN_STATUS_COUNTS;
}

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
