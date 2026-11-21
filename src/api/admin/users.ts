import { adminRequest } from "./client";
import { fetchAllAdminPages } from "./shared";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  joinedAt: string;
  status: "Aktif" | "Nonaktif";
  role: string;
  verified: boolean;
  totalOrders: number;
  completedOrders: number;
  processingOrders: number;
  cancelledOrders?: number;
  totalSpent?: number;
};

export type BaseUser = Pick<
  AdminUser,
  "id" | "name" | "email" | "joinedAt" | "status"
>;

type AdminUserRow = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  roleLabel?: string;
  status: string;
  statusLabel?: string;
  joinedAt: string;
  totalOrders: number;
  completedOrders: number;
  processingOrders: number;
  cancelledOrders?: number;
  totalSpent?: number;
};

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];
const MONTHS_LONG = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

/**
 * Backend mengirim `joinedAt` sebagai ISO datetime. Ambil bagian tanggalnya
 * saja agar format lama `YYYY-MM-DD` tetap kompatibel.
 */
export function formatUserDate(
  isoDate: string,
  style: "short" | "long" = "short",
): string {
  const [year, month, day] = isoDate.slice(0, 10).split("-").map(Number);
  if (style === "long") {
    return `${day} ${MONTHS_LONG[(month ?? 1) - 1]} ${year}`;
  }
  return `${day} ${MONTHS_SHORT[(month ?? 1) - 1]} ${year}`;
}

function mapAdminUser(row: AdminUserRow): AdminUser {
  return {
    id: String(row.id),
    name: row.name,
    email: row.email,
    phone: row.phone,
    joinedAt: row.joinedAt,
    status:
      row.statusLabel === "Aktif" || row.status === "active"
        ? "Aktif"
        : "Nonaktif",
    role: row.roleLabel ?? row.role,
    verified: row.status === "active",
    totalOrders: row.totalOrders,
    completedOrders: row.completedOrders,
    processingOrders: row.processingOrders,
    cancelledOrders: row.cancelledOrders,
    totalSpent: row.totalSpent,
  };
}

/** GET /admin/users */
export async function getAdminUsers(): Promise<AdminUser[]> {
  const rows = await fetchAllAdminPages<AdminUserRow>("/admin/users");
  return rows.map(mapAdminUser);
}

/** GET /admin/users/:id */
export async function getAdminUser(id: string): Promise<AdminUser> {
  const row = await adminRequest<AdminUserRow>(`/admin/users/${id}`);
  return mapAdminUser(row);
}
