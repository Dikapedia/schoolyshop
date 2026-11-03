import {
  GENERIC_PRODUCT_CATEGORIES,
  GENERIC_PRODUCT_NAMES,
  ISMI_PRODUCTS,
  SALES_REPORT_MOCKS,
} from "../mocks/admin/sales-report";

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

/**
 * TODO(backend): ganti dengan GET /admin/reports/sales?startDate=&endDate=
 * dan pindahkan filter tanggal/seller ke server.
 */
export function getSalesReport(): SellerSalesRow[] {
  return SALES_REPORT_MOCKS;
}

/**
 * TODO(backend): ganti dengan GET /admin/reports/sales/:sellerId.
 */
export function getSellerReportDetail(
  id: string | undefined,
): SellerReportDetail | null {
  if (!id) return null;
  const seller = SALES_REPORT_MOCKS.find((row) => String(row.id) === id);
  if (!seller) return null;

  const products: SellerProductRow[] =
    seller.id === 1
      ? ISMI_PRODUCTS
      : [
          {
            id: 1,
            name:
              GENERIC_PRODUCT_NAMES[seller.id] ??
              `Produk ${seller.business}`,
            sku: `SCH-${String(seller.id).padStart(3, "0")}`,
            category:
              GENERIC_PRODUCT_CATEGORIES[seller.id] ?? "Kriya & Kerajinan",
            unitPrice: Math.round(seller.total / seller.sold),
            sold: seller.sold,
            total: seller.total,
            refund: seller.refund,
            net: seller.net,
            status: seller.refund > 0 ? "Selesai & Sebagian Retur" : "Selesai",
            statusTone: seller.refund > 0 ? "warning" : "success",
          },
        ];

  const totals = products.reduce(
    (acc, product) => ({
      sold: acc.sold + product.sold,
      total: acc.total + product.total,
      refund: acc.refund + product.refund,
      net: acc.net + product.net,
    }),
    { sold: 0, total: 0, refund: 0, net: 0 },
  );

  return {
    seller,
    period: REPORT_PERIOD,
    products,
    totals,
  };
}
