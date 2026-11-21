import { adminRequest } from "./client";
import {
  adminAvatarClass,
  adminInitials,
  fetchAllAdminPages,
  formatAdminDate,
} from "./shared";

export type ReturnStatus = "Menunggu Keputusan" | "Disetujui" | "Ditolak";

export type AdminReturn = {
  id: string;
  orderId: string;
  customer: string;
  initials: string;
  avatarClass: string;
  product: string;
  reason: string;
  submittedAt: string;
  status: ReturnStatus;
};

export const RETURN_STATUS_OPTIONS: ReturnStatus[] = [
  "Menunggu Keputusan",
  "Disetujui",
  "Ditolak",
];

type AdminReturnRow = {
  id: number;
  orderId: number;
  status: ReturnStatus;
  submittedAt: string;
  buyer: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    productName: string;
    reason: string;
  }>;
};

function mapAdminReturn(row: AdminReturnRow): AdminReturn {
  const items = Array.isArray(row.items) ? row.items : [];
  const first = items[0];
  const product = first
    ? items.length > 1
      ? `${first.productName} +${items.length - 1} lainnya`
      : first.productName
    : "-";

  return {
    id: String(row.id),
    orderId: String(row.orderId),
    customer: row.buyer?.name ?? "-",
    initials: adminInitials(row.buyer?.name ?? "-"),
    avatarClass: adminAvatarClass(row.id),
    product,
    reason: first?.reason || "-",
    submittedAt: formatAdminDate(row.submittedAt),
    status: row.status,
  };
}

/** GET /admin/returns?page=&search=&status= */
export async function getAdminReturns(): Promise<AdminReturn[]> {
  const rows = await fetchAllAdminPages<AdminReturnRow>("/admin/returns");
  return rows.map(mapAdminReturn);
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
export function approveAdminReturn(
  id: string,
  refundMethod = "Transfer Bank",
  adminNote?: string,
): Promise<void> {
  return adminRequest<void>(`/admin/returns/${id}/approve`, {
    method: "POST",
    body: {
      refundMethod,
      ...(adminNote ? { adminNote } : {}),
    },
  });
}

/** POST /admin/returns/:id/reject */
export function rejectAdminReturn(
  id: string,
  adminNote: string,
): Promise<void> {
  return adminRequest<void>(`/admin/returns/${id}/reject`, {
    method: "POST",
    body: { adminNote },
  });
}

export function getReturnStatusTone(status: ReturnStatus) {
  switch (status) {
    case "Menunggu Keputusan":
      return { badge: "bg-orange-50 text-orange-700", dot: "bg-orange-500" };
    case "Disetujui":
      return { badge: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" };
    case "Ditolak":
      return { badge: "bg-red-50 text-red-700", dot: "bg-red-500" };
  }
}
