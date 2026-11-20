import { adminRequest } from "./client";
import { adminInitials } from "./shared";

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
  orderCount?: number;
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

type SellerSalesRowDto = {
  id: number;
  name: string;
  business: string | null;
  type: string | null;
  role: string;
  roleTone: string;
  initials: string;
  sold: number;
  total: number;
  refund: number;
  net: number;
  orderCount?: number;
  lastSaleAt: string | null;
  date: string | null;
};

type ProductSalesRowDto = {
  productId: number | null;
  productName: string;
  sku: string | null;
  sold: number;
  total: number;
  refund: number;
  net: number;
  unitPrice: number;
  status: string;
  lastSaleAt: string | null;
  date: string | null;
};

type SalesReportResponse = {
  data?: SellerSalesRowDto[];
  period?: { startDate: string; endDate: string; timezone?: string };
  totals?: {
    sold: number;
    total: number;
    refund: number;
    net: number;
  };
};

type SellerReportResponse = {
  seller: SellerSalesRowDto;
  period?: { startDate: string; endDate: string; timezone?: string };
  products?: ProductSalesRowDto[];
  totals?: {
    sold: number;
    total: number;
    refund: number;
    net: number;
  };
};

function normalizeRoleTone(value: string): SellerRoleTone {
  const normalized = value.toLowerCase();
  if (normalized.includes("guru")) return "guru";
  if (normalized.includes("karyawan")) return "karyawan";
  return "siswa";
}

function mapSellerRow(row: SellerSalesRowDto): SellerSalesRow {
  return {
    id: row.id,
    name: row.name,
    business: row.business || "-",
    role: row.role,
    roleTone: normalizeRoleTone(row.roleTone || row.role),
    sold: row.sold ?? 0,
    total: row.total ?? 0,
    refund: row.refund ?? 0,
    net: row.net ?? 0,
    date: row.date ?? "",
    initials: row.initials || adminInitials(row.name),
    orderCount: row.orderCount,
  };
}

function formatPeriod(
  period: { startDate: string; endDate: string } | undefined,
): string {
  if (!period) return REPORT_PERIOD;
  return `${formatReportDate(period.startDate)} - ${formatReportDate(period.endDate)}`;
}

/** GET /admin/reports/sales?startDate=&endDate=&sellerId= */
export async function getSalesReport(
  startDate?: string,
  endDate?: string,
): Promise<SellerSalesRow[]> {
  const params = new URLSearchParams();
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);
  const query = params.toString();

  const payload = await adminRequest<SalesReportResponse>(
    `/admin/reports/sales${query ? `?${query}` : ""}`,
  );
  const rows = Array.isArray(payload?.data) ? payload.data : [];

  return rows.map(mapSellerRow);
}

/** GET /admin/reports/sales/:sellerId */
export async function getSellerReportDetail(
  id: string,
  startDate?: string,
  endDate?: string,
): Promise<SellerReportDetail> {
  const params = new URLSearchParams();
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);
  const query = params.toString();

  const payload = await adminRequest<SellerReportResponse>(
    `/admin/reports/sales/${id}${query ? `?${query}` : ""}`,
  );
  const products = (Array.isArray(payload?.products) ? payload.products : []).map(
    (product, index): SellerProductRow => ({
      id: product.productId ?? index,
      name: product.productName,
      sku: product.sku || "-",
      category: "-",
      unitPrice: product.unitPrice,
      sold: product.sold,
      total: product.total,
      refund: product.refund,
      net: product.net,
      status: product.status,
      statusTone: product.status.toLowerCase().includes("retur")
        ? "warning"
        : "success",
    }),
  );

  const totals =
    payload?.totals ??
    products.reduce(
      (acc, product) => ({
        sold: acc.sold + product.sold,
        total: acc.total + product.total,
        refund: acc.refund + product.refund,
        net: acc.net + product.net,
      }),
      { sold: 0, total: 0, refund: 0, net: 0 },
    );

  return {
    seller: mapSellerRow(payload.seller),
    period: formatPeriod(payload.period),
    products,
    totals,
  };
}
