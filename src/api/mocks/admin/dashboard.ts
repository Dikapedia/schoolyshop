import type {
  AdminDashboardStat,
  AdminRecentOrder,
} from "../../admin/dashboard";

/**
 * Ringkasan dashboard admin contoh.
 *
 * TODO(backend): ganti dengan GET /admin/dashboard/summary. Angka saat ini
 * tidak diturunkan dari data pesanan/produk lain.
 */
export const ADMIN_DASHBOARD_STATS: AdminDashboardStat[] = [
  {
    label: "Total Produk",
    value: "48 Produk",
    subtext: "+4 produk baru minggu ini",
  },
  {
    label: "Total Pesanan",
    value: "10 Pesanan",
    subtext: "3 menunggu, 7 diproses/selesai",
  },
  {
    label: "Total Transaksi",
    value: "10 Transaksi",
    subtext: "7 lunas, 3 pending bayar",
  },
  {
    label: "Total User",
    value: "30 User",
    subtext: "Siswa, Guru, dan Civitas",
  },
  {
    label: "Total Pendapatan",
    value: "Rp3.450.000",
    subtext: "Rp3.330.000 setelah retur",
  },
];

/**
 * TODO(backend): ganti dengan GET /admin/orders?limit=5&sort=createdAt:desc.
 */
export const ADMIN_RECENT_ORDER_MOCKS: AdminRecentOrder[] = [
  {
    id: "ORD-001",
    buyer: "Budi Santoso",
    meta: "Siswa • XI TKJ 2",
    product: "Kemeja Batik Klasik Solo (1 pcs)",
    total: "Rp120.000",
    status: "Diproses",
    statusClass: "bg-blue-50 text-blue-700",
  },
  {
    id: "ORD-002",
    buyer: "Ghofuur Ramadhan",
    meta: "Siswa • XII Mesin",
    product: "Tote Bag Batik Parang (1 pcs)",
    total: "Rp75.000",
    status: "Menunggu Pembayaran",
    statusClass: "bg-amber-50 text-amber-700",
  },
  {
    id: "ORD-003",
    buyer: "Hardika Pratama",
    meta: "Siswa • X RPL",
    product: "Dompet Batik Kulit Sintetis (1 pcs)",
    total: "Rp65.000",
    status: "Siap Dikirim",
    statusClass: "bg-sky-50 text-sky-700",
  },
  {
    id: "ORD-004",
    buyer: "Reza Firmansyah",
    meta: "Guru • Olahraga",
    product: "Tas Anyaman Tradisional (1 pcs)",
    total: "Rp95.000",
    status: "Dikirim",
    statusClass: "bg-violet-50 text-violet-700",
  },
  {
    id: "ORD-006",
    buyer: "Dimas Prakoso",
    meta: "Siswa • XII Akuntansi 1",
    product: "Gantungan Kunci Kayu Ukir (2 pcs)",
    total: "Rp35.000",
    status: "Selesai",
    statusClass: "bg-emerald-50 text-emerald-700",
  },
];
