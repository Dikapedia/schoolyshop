import { adminRequest } from "./client";
import type { ReturnStatus } from "./returns";
import {
  formatAdminDateTime,
  formatAdminRupiah,
} from "./shared";

export type ReturnPhoto = {
  label: string;
  caption: string;
  url?: string;
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
  refundProofUrl?: string | null;
  adminNote?: string | null;
};

type AdminReturnDetailRow = {
  id: number;
  orderId: number;
  status: ReturnStatus;
  submittedAt: string;
  decisionAt: string | null;
  refundMethod: string | null;
  refundProofUrl: string | null;
  adminNote: string | null;
  buyer: {
    name: string;
    email: string;
    phone: string;
  };
  order: {
    status: string;
    paymentStatus: string;
    paymentMethod: string | null;
    total: number;
  };
  items: Array<{
    productName: string;
    variantSize: string;
    qty: number;
    reason: string;
  }>;
  photos: Array<{
    id: number;
    url: string;
    originalName: string;
    mimeType: string;
    size: number;
  }>;
};

export function mapAdminReturnDetail(
  row: AdminReturnDetailRow,
): AdminReturnDetail {
  const items = Array.isArray(row.items) ? row.items : [];
  const first = items[0];
  const notes = items
    .map((item) => item.reason)
    .filter(Boolean)
    .join("; ");

  return {
    id: String(row.id),
    status: row.status,
    submittedAt: formatAdminDateTime(row.submittedAt),
    decisionTime: formatAdminDateTime(row.decisionAt),
    customer: row.buyer?.name ?? "-",
    phone: row.buyer?.phone ?? "-",
    verified: row.order?.paymentStatus === "paid",
    orderId: String(row.orderId),
    paymentMethod: row.order?.paymentMethod || "-",
    product: first?.productName ?? "-",
    price: formatAdminRupiah(row.order?.total ?? 0),
    size: first?.variantSize || "-",
    quantity: items.reduce((total, item) => total + item.qty, 0),
    sku: "-",
    category: "-",
    reason: first?.reason || "-",
    buyerNote: notes || "-",
    photos: (Array.isArray(row.photos) ? row.photos : []).map((photo) => ({
      label: photo.originalName || "Foto bukti",
      caption: photo.mimeType || "Foto dari pembeli",
      url: photo.url,
    })),
    refundMethod: row.refundMethod || "Belum ditentukan",
    refundProofUrl: row.refundProofUrl,
    adminNote: row.adminNote,
  };
}

/** GET /admin/returns/:id */
export async function getAdminReturnDetail(
  id: string,
): Promise<AdminReturnDetail> {
  const row = await adminRequest<AdminReturnDetailRow>(`/admin/returns/${id}`);
  return mapAdminReturnDetail(row);
}
