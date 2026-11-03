import {
  ADMIN_DASHBOARD_STATS,
  ADMIN_RECENT_ORDER_MOCKS,
} from "../mocks/admin/dashboard";

export type AdminDashboardStat = {
  label: string;
  value: string;
  subtext: string;
};

export type AdminRecentOrder = {
  id: string;
  buyer: string;
  meta: string;
  product: string;
  total: string;
  status: string;
  statusClass: string;
};

/**
 * TODO(backend): ganti dengan GET /admin/dashboard/summary.
 */
export function getAdminDashboardStats(): AdminDashboardStat[] {
  return ADMIN_DASHBOARD_STATS;
}

/**
 * TODO(backend): ganti dengan GET /admin/orders?limit=5&sort=createdAt:desc.
 */
export function getAdminRecentOrders(): AdminRecentOrder[] {
  return ADMIN_RECENT_ORDER_MOCKS;
}
