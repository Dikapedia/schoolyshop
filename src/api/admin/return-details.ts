import { request } from "../client";
import type { ReturnStatus } from "./returns";

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

/** GET /admin/returns/:id */
export function getAdminReturnDetail(id: string): Promise<AdminReturnDetail> {
  return request<AdminReturnDetail>(`/admin/returns/${id}`);
}
