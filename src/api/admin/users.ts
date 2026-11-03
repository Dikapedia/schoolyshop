import { BASE_USER_MOCKS } from "../mocks/admin/users";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  status: "Aktif" | "Nonaktif";
  role: string;
  verified: boolean;
  totalOrders: number;
  completedOrders: number;
  processingOrders: number;
};

export type BaseUser = Pick<
  AdminUser,
  "id" | "name" | "email" | "joinedAt" | "status"
>;

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

export function formatUserDate(
  isoDate: string,
  style: "short" | "long" = "short",
): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (style === "long") {
    return `${day} ${MONTHS_LONG[month - 1]} ${year}`;
  }
  return `${String(day).padStart(2, "0")} ${MONTHS_SHORT[month - 1]} ${year}`;
}

/**
 * TODO(backend): ganti dengan GET /admin/users?page=&search= dan gunakan
 * field agregat pesanan dari server.
 */
export function getAdminUsers(): AdminUser[] {
  return BASE_USER_MOCKS.map((user, index) => {
    const totalOrders = index === 0 ? 4 : (index % 5) + 1;
    const processingOrders = 1;

    return {
      ...user,
      role: "Pengguna Umum / Pembeli",
      verified: true,
      totalOrders,
      completedOrders: totalOrders - processingOrders,
      processingOrders,
    };
  });
}
