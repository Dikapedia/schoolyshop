import { request } from "../client";
import type { OrderStatus, PaymentStatus } from "./orders";

export type AdminOrderItem = {
  name: string;
  sku: string;
  seller: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type AdminOrderDetail = {
  id: string;
  buyer: {
    name: string;
    type: string;
    contact: string;
    email: string;
    orderedAt: string;
    address: string;
  };
  transaction: {
    provider: string;
    method: string;
    transactionId: string;
    paidAt: string;
    settledLabel: string;
  };
  warehouse: string;
  verifiedAt: string;
  items: AdminOrderItem[];
  summary: {
    subtotal: number;
    shippingLabel: string;
    shippingCost: number;
    total: number;
  };
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
};

/** GET /admin/orders/:id */
export function getAdminOrderDetail(id: string): Promise<AdminOrderDetail> {
  return request<AdminOrderDetail>(`/admin/orders/${id}`);
}
