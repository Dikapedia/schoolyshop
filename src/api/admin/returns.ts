import { request } from "../client";

export type ReturnStatus =
  | "Menunggu Persetujuan"
  | "Menunggu Barang Kembali"
  | "Pengembalian Diproses"
  | "Pengembalian Selesai"
  | "Ditolak";

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
  "Ditolak",
];

/** GET /admin/returns?page=&search=&status= */
export function getAdminReturns(): Promise<AdminReturn[]> {
  return request<AdminReturn[]>("/admin/returns");
}

/** Hitung ringkasan dari baris yang benar-benar dimuat. */
export function countReturnStatuses(
  returns: AdminReturn[],
): Record<ReturnStatus, number> {
  const counts = Object.fromEntries(
    RETURN_STATUS_OPTIONS.map((status) => [status, 0]),
  ) as Record<ReturnStatus, number>;

  for (const item of returns) counts[item.status] += 1;
  return counts;
}

/** POST /admin/returns/:id/approve */
export function approveAdminReturn(id: string): Promise<AdminReturn> {
  return request<AdminReturn>(`/admin/returns/${id}/approve`, {
    method: "POST",
  });
}

/** POST /admin/returns/:id/reject */
export function rejectAdminReturn(
  id: string,
  reason?: string,
): Promise<AdminReturn> {
  return request<AdminReturn>(`/admin/returns/${id}/reject`, {
    method: "POST",
    body: { reason },
  });
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
    case "Ditolak":
      return { badge: "bg-red-50 text-red-700", dot: "bg-red-500" };
  }
}
