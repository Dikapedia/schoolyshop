import { request } from "../client";
import type { AdminOrder } from "./orders";

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

/** GET /admin/dashboard/summary */
export function getAdminDashboardSummary(): Promise<AdminDashboardSummary> {
  return request<AdminDashboardSummary>("/admin/dashboard/summary");
}

/** GET /admin/orders?limit=5&sort=createdAt:desc */
export function getAdminRecentOrders(): Promise<AdminOrder[]> {
  return request<AdminOrder[]>("/admin/orders?limit=5&sort=createdAt:desc");
}
