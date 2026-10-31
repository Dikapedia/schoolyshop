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

export const SALES_REPORT: SellerSalesRow[] = [
  {
    id: 1,
    name: "Ismi",
    business: "Batik Ismi",
    role: "Siswa — XI RPL 1",
    roleTone: "siswa",
    sold: 12,
    total: 1440000,
    refund: 120000,
    net: 1320000,
    initials: "IS",
  },
  {
    id: 2,
    name: "Intan",
    business: "Kriya Intan",
    role: "Siswa — XII Tata Busana",
    roleTone: "siswa",
    sold: 8,
    total: 520000,
    refund: 0,
    net: 520000,
    initials: "IN",
  },
  {
    id: 3,
    name: "Alwan",
    business: "Karya Alwan",
    role: "Siswa — XI DKV 2",
    roleTone: "siswa",
    sold: 7,
    total: 665000,
    refund: 0,
    net: 665000,
    initials: "AL",
  },
  {
    id: 4,
    name: "Budi",
    business: "Kerajinan Budi",
    role: "Guru — Seni & Kerajinan",
    roleTone: "guru",
    sold: 6,
    total: 495000,
    refund: 0,
    net: 495000,
    initials: "BU",
  },
  {
    id: 5,
    name: "Novita",
    business: "Batik Novita",
    role: "Karyawan — Staf TU",
    roleTone: "karyawan",
    sold: 5,
    total: 330000,
    refund: 0,
    net: 330000,
    initials: "NO",
  },
];

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

const ISMI_PRODUCTS: SellerProductRow[] = [
  {
    id: 1,
    name: "Kemeja Batik Siswa Lengan Pendek SMA",
    sku: "SCH-BTK-006L",
    category: "Pakaian Seragam",
    unitPrice: 120000,
    sold: 8,
    total: 960000,
    refund: 120000,
    refundNote: "1 pcs retur ukuran",
    net: 840000,
    status: "Selesai & Sebagian Retur",
    statusTone: "warning",
  },
  {
    id: 2,
    name: "Tote Bag Motif Batik Parang Siswa",
    sku: "SCH-BAG-002",
    category: "Aksesoris Kerajinan",
    unitPrice: 40000,
    sold: 3,
    total: 120000,
    refund: 0,
    net: 120000,
    status: "Selesai",
    statusTone: "success",
  },
  {
    id: 3,
    name: "Masker Kain Batik Edisi Sekolah",
    sku: "SCH-MSK-015",
    category: "Aksesoris",
    unitPrice: 360000,
    priceNote: "paket bundle/unit",
    sold: 1,
    total: 360000,
    refund: 0,
    net: 360000,
    status: "Selesai",
    statusTone: "success",
  },
];

const GENERIC_PRODUCT_NAMES: Record<number, string> = {
  2: "Kriya Intan Unggulan",
  3: "Karya Alwan Unggulan",
  4: "Kerajinan Budi Unggulan",
  5: "Batik Novita Unggulan",
};

const GENERIC_PRODUCT_CATEGORIES: Record<number, string> = {
  2: "Kriya & Kerajinan",
  3: "Kriya & Kerajinan",
  4: "Kriya & Kerajinan",
  5: "Batik & Tekstil",
};

export function getSellerReportDetail(id: string | undefined): SellerReportDetail | null {
  if (!id) return null;
  const seller = SALES_REPORT.find((row) => String(row.id) === id);
  if (!seller) return null;

  const products: SellerProductRow[] =
    seller.id === 1
      ? ISMI_PRODUCTS
      : [
          {
            id: 1,
            name: GENERIC_PRODUCT_NAMES[seller.id] ?? `Produk ${seller.business}`,
            sku: `SCH-${String(seller.id).padStart(3, "0")}`,
            category: GENERIC_PRODUCT_CATEGORIES[seller.id] ?? "Kriya & Kerajinan",
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
    { sold: 0, total: 0, refund: 0, net: 0 }
  );

  return {
    seller,
    period: REPORT_PERIOD,
    products,
    totals,
  };
}
