import { adminRequest } from "./client";
import {
  mapAdminOrder,
  type AdminOrder,
  type AdminOrderRow,
} from "./orders";
import {
  formatAdminRupiah,
  type AdminPaginatedResponse,
} from "./shared";

export type AdminDashboardStat = {
  label: string;
  value: string;
  subtext: string;
};

export type AdminNotification = {
  id: string;
  title: string;
  detail: string;
  href: string;
};

export type AdminDashboardSummary = {
  stats: AdminDashboardStat[];
  notifications: AdminNotification[];
};

type DashboardRecentOrderRow = {
  id: number;
  buyerName: string;
  buyerEmail?: string;
  productName?: string | null;
  itemCount?: number;
  createdAt?: string;
  total: number;
  status: string;
  paymentStatus: string;
};

type AdminDashboardRow = {
  totalProducts?: number;
  totalOrders?: number;
  totalUsers?: number;
  totalTransactions?: number;
  grossRevenue?: number;
  totalRefunds?: number;
  totalRevenue?: number;
  recentOrders?: DashboardRecentOrderRow[];
};

const EMPTY_SUMMARY: AdminDashboardSummary = { stats: [], notifications: [] };

/** GET /admin/dashboard/summary */
export async function getAdminDashboardSummary(): Promise<AdminDashboardSummary> {
  const payload = await adminRequest<AdminDashboardRow>(
    "/admin/dashboard/summary",
  );

  if (!payload || typeof payload !== "object") return EMPTY_SUMMARY;

  const totalProducts = Number(payload.totalProducts ?? 0);
  const totalOrders = Number(payload.totalOrders ?? 0);
  const totalUsers = Number(payload.totalUsers ?? 0);
  const totalTransactions = Number(payload.totalTransactions ?? 0);
  const grossRevenue = Number(payload.grossRevenue ?? 0);
  const totalRefunds = Number(payload.totalRefunds ?? 0);
  const totalRevenue = Number(payload.totalRevenue ?? 0);

  const stats: AdminDashboardStat[] = [
    {
      label: "Total Produk",
      value: totalProducts.toLocaleString("id-ID"),
      subtext: "Produk terdaftar di katalog",
    },
    {
      label: "Total Pesanan",
      value: totalOrders.toLocaleString("id-ID"),
      subtext: "Seluruh pesanan masuk",
    },
    {
      label: "Total Transaksi",
      value: totalTransactions.toLocaleString("id-ID"),
      subtext: "Pembayaran lunas",
    },
    {
      label: "Total Pengguna",
      value: totalUsers.toLocaleString("id-ID"),
      subtext: "Akun terdaftar",
    },
    {
      label: "Pendapatan",
      value: formatAdminRupiah(totalRevenue),
      subtext: `Bruto ${formatAdminRupiah(grossRevenue)} • Refund ${formatAdminRupiah(totalRefunds)}`,
    },
  ];

  const recentOrders = Array.isArray(payload.recentOrders)
    ? payload.recentOrders
    : [];
  const notifications: AdminNotification[] = recentOrders
    .slice(0, 5)
    .map((order) => ({
      id: `order-${order.id}`,
      title: `Pesanan #${order.id} • ${order.buyerName}`,
      detail: `${order.productName || `${order.itemCount ?? 0} item`} • ${order.status} • ${formatAdminRupiah(order.total)}`,
      href: `/admin/pesanan/${order.id}`,
    }));

  return { stats, notifications };
}

/** GET /admin/orders?page=1&perPage=5 */
export async function getAdminRecentOrders(): Promise<AdminOrder[]> {
  const payload = await adminRequest<AdminPaginatedResponse<AdminOrderRow>>(
    "/admin/orders?page=1&perPage=5",
  );

  return Array.isArray(payload?.data) ? payload.data.map(mapAdminOrder) : [];
}
