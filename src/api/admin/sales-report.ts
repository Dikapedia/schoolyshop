import { request } from "../client";

export type SellerRoleTone = "siswa" | "guru" | "karyawan";

export type SellerSalesRow = {
  id: number;
  name: string;
  business: string;
  role: string;
  roleTone: SellerRoleTone;
  sold: number;
  total: number;
  refund: number;
  net: number;
  date: string;
  initials: string;
};

export const SELLER_ROLE_CLASS: Record<SellerRoleTone, string> = {
  siswa: "bg-emerald-50 text-emerald-700",
  guru: "bg-amber-50 text-amber-700",
  karyawan: "bg-blue-50 text-blue-700",
};

export const SELLER_AVATAR_CLASS: Record<SellerRoleTone, string> = {
  siswa: "bg-emerald-50 text-emerald-700",
  guru: "bg-amber-50 text-amber-700",
  karyawan: "bg-blue-50 text-blue-700",
};

export function formatRupiah(value: number): string {
  return `Rp${value.toLocaleString("id-ID")}`;
}

export function formatReportDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export const REPORT_PERIOD = "01 Okt 2026 - 31 Okt 2026";

export type ProductStatusTone = "success" | "warning";

export type SellerProductRow = {
  id: number;
  name: string;
  sku: string;
  category: string;
  unitPrice: number;
  priceNote?: string;
  sold: number;
  total: number;
  refund: number;
  refundNote?: string;
  net: number;
  status: string;
  statusTone: ProductStatusTone;
};

export type SellerReportDetail = {
  seller: SellerSalesRow;
  period: string;
  products: SellerProductRow[];
  totals: {
    sold: number;
    total: number;
    refund: number;
    net: number;
  };
};

/** GET /admin/reports/sales?startDate=&endDate=&sellerId= */
export function getSalesReport(): Promise<SellerSalesRow[]> {
  return request<SellerSalesRow[]>("/admin/reports/sales");
}

/** GET /admin/reports/sales/:sellerId */
export function getSellerReportDetail(
  id: string,
): Promise<SellerReportDetail> {
  return request<SellerReportDetail>(`/admin/reports/sales/${id}`);
}
