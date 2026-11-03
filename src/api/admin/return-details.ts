import {
  DEFAULT_RETURN_PHOTOS,
  DETAIL_OVERRIDES,
} from "../mocks/admin/return-details";
import { getAdminReturns, type ReturnStatus } from "./returns";

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

/**
 * TODO(backend): ganti dengan GET /admin/returns/:id dan konfirmasi field
 * foto, keputusan admin, serta metode refund.
 */
export function getAdminReturnDetail(
  id: string | undefined,
): AdminReturnDetail | null {
  if (!id) return null;
  const base = getAdminReturns().find((item) => item.id === id);
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
    photos: DEFAULT_RETURN_PHOTOS,
    refundMethod: "Tukar Size / Dana",
    ...override,
  };
}
