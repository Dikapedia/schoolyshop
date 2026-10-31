import { ADMIN_RETURNS, type ReturnStatus } from "./admin-returns";

export type ReturnPhoto = {
  label: string;
  caption: string;
};

export type AdminReturnDetail = {
  id: string;
  status: ReturnStatus;
  submittedAt: string;
  decisionTime: string;
  customer: string;
  phone: string;
  verified: boolean;
  orderId: string;
  paymentMethod: string;
  product: string;
  price: string;
  size: string;
  quantity: number;
  sku: string;
  category: string;
  reason: string;
  buyerNote: string;
  photos: ReturnPhoto[];
  refundMethod: string;
};

const DETAIL_OVERRIDES: Record<string, Partial<AdminReturnDetail>> = {
  "ORD-001": {
    customer: "Jude Bellingham",
    phone: "0812-3456-7890",
    verified: true,
    orderId: "ORD-001",
    paymentMethod: "Virtual Account Mandiri / (Lunas)",
    product: "Kemeja Batik Siswa Lengan Pendek SMA (Size L)",
    price: "Rp120.000",
    size: "Size L",
    quantity: 1,
    sku: "SCH-BTK-001",
    category: "Ukuran Tidak Sesuai",
    reason:
      "Ukuran tidak sesuai (kebesaran / kemeja batik ukuran L terlalu longgar di bagian bahu sehingga tidak nyaman digunakan saat upacara)",
    buyerNote:
      "Mohon dibantu proses retur atau ganti size M bila memungkinkan. Terima kasih banyak admin Schooly Shop.",
    decisionTime: "16 Okt 2026, 10:15 WIB",
    refundMethod: "Tukar Size / Dana",
  },
  "ORD-003": {
    customer: "Putra Junior",
    phone: "0813-2211-4455",
    product: "Dompet Batik",
    price: "Rp65.000",
    size: "One Size",
    sku: "SCH-DMP-003",
    category: "Cacat Produk",
    reason: "Cacat jahitan samping pada dompet batik.",
    buyerNote: "Jahitan bagian samping terbuka saat pertama kali digunakan.",
    refundMethod: "Tukar Barang",
  },
  "ORD-005": {
    customer: "Luka Ridho",
    phone: "0821-7788-9900",
    product: "Outer Batik",
    price: "Rp95.000",
    size: "M",
    sku: "SCH-OTR-005",
    category: "Bahan Tidak Sesuai",
    reason: "Bahan tidak sesuai ekspektasi, terasa lebih tipis dari deskripsi produk.",
    buyerNote: "Mohon informasi apakah bisa ditukar dengan bahan yang lebih tebal.",
    refundMethod: "Tukar Barang / Dana",
  },
  "ORD-002": {
    customer: "Kylian Yusuf",
    phone: "0857-1234-5678",
    product: "Tote Bag Batik",
    price: "Rp75.000",
    size: "One Size",
    sku: "SCH-TTB-002",
    category: "Barang Salah Motif",
    reason: "Barang salah motif dari pesanan yang dipilih.",
    buyerNote: "Motif yang diterima berbeda dengan gambar pada saat pemesanan.",
    refundMethod: "Tukar Barang",
  },
};

const DEFAULT_PHOTOS: ReturnPhoto[] = [
  {
    label: "Foto 1: Tampak Keseluruhan Baju",
    caption: "Kondisi fisik kemeja utuh, tidak ada sobekan atau noda pada bagian luar.",
  },
  {
    label: "Foto 2: Label & Lengan Tekstil Masih Utuh",
    caption: "Kondisi label dan tekstil masih utuh, jahitan serta motif batik tidak rusak.",
  },
];

export function getAdminReturnDetail(id: string | undefined): AdminReturnDetail | null {
  if (!id) return null;
  const base = ADMIN_RETURNS.find((item) => item.id === id);
  if (!base) return null;

  const override = DETAIL_OVERRIDES[base.id] ?? {};

  return {
    id: base.id,
    status: base.status,
    submittedAt: base.submittedAt,
    decisionTime: "16 Okt 2026, 20:30 WIB",
    customer: base.customer,
    phone: "0812-3456-7890",
    verified: true,
    orderId: base.id,
    paymentMethod: "Virtual Account Mandiri / (Lunas)",
    product: base.product,
    price: "Rp120.000",
    size: "Size L",
    quantity: 1,
    sku: "SCH-BTK-001",
    category: "Ukuran Tidak Sesuai",
    reason: base.reason,
    buyerNote: "Mohon dibantu untuk memproses pengembalian barang ini.",
    photos: DEFAULT_PHOTOS,
    refundMethod: "Tukar Size / Dana",
    ...override,
  };
}
